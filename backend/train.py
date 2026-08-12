"""AgriVision inference service. It only returns predictions from a trained model."""
from __future__ import annotations
import io, json, os
from pathlib import Path
import numpy as np
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import tensorflow as tf

ROOT = Path(__file__).resolve().parents[1]
MODEL_PATH = Path(os.getenv("MODEL_PATH", ROOT / "models" / "plant_disease.keras"))
LABELS_PATH = MODEL_PATH.with_name("labels.json")
app = FastAPI(title="AgriVision ML", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000").split(","), allow_methods=["*"], allow_headers=["*"])
model: tf.keras.Model | None = None
labels: list[str] = []

# Per-disease remedy lookup, keyed by the exact label text your trained model
# returns (see backend/models/labels.json). Extend this if you retrain with a
# different or larger class list - any label not found here falls back to
# generic guidance in advice() below instead of erroring.
DISEASE_DB: dict[str, dict] = {
    "Apple - Apple Scab": {"nutrients": ["Potassium", "Calcium", "Micronutrients"], "recommendation": "Rake up and destroy fallen leaves to reduce spring spores, prune for better airflow, and apply a protectant fungicide (e.g. myclobutanil or captan) starting at bud break."},
    "Apple - Black Rot": {"nutrients": ["Potassium", "Calcium"], "recommendation": "Prune out cankers and mummified fruit, remove infected wood well below the lesion, and apply a fungicide during wet spring weather."},
    "Apple - Cedar Apple Rust": {"nutrients": ["Potassium", "Micronutrients"], "recommendation": "Remove nearby cedar or juniper hosts where possible, apply fungicide from the pink-bud stage onward, and favour rust-resistant varieties in future plantings."},
    "Bell Pepper - Bacterial Spot": {"nutrients": ["Calcium", "Potassium"], "recommendation": "Avoid overhead watering, apply a copper-based bactericide, remove and destroy infected plant debris, and rotate away from peppers/tomatoes next season."},
    "Cherry - Powdery Mildew": {"nutrients": ["Potassium", "Micronutrients"], "recommendation": "Improve air circulation through pruning, avoid excess nitrogen, and apply sulfur or potassium bicarbonate fungicide at the first sign of white patches."},
    "Corn (Maize) - Cercospora Leaf Spot": {"nutrients": ["Potassium", "Balanced NPK"], "recommendation": "Rotate away from corn for a season, till under crop residue, apply a foliar fungicide if disease pressure is high, and choose resistant hybrids next season."},
    "Corn (Maize) - Common Rust": {"nutrients": ["Balanced NPK"], "recommendation": "Usually mild - monitor closely and apply fungicide only if pustules are heavy; resistant hybrids largely prevent this in future seasons."},
    "Corn (Maize) - Northern Leaf Blight": {"nutrients": ["Potassium", "Balanced NPK"], "recommendation": "Rotate crops, till under infected residue, apply fungicide at early symptom onset, and select resistant hybrids going forward."},
    "Grape - Black Rot": {"nutrients": ["Potassium", "Calcium"], "recommendation": "Remove mummified berries and infected leaves, apply fungicide from bud break through veraison, and improve canopy airflow via pruning."},
    "Grape - Esca (Black Measles)": {"nutrients": ["Potassium", "Micronutrients"], "recommendation": "There is no curative spray - remove and destroy severely infected vines, avoid pruning in wet weather, and protect fresh pruning cuts with a wound sealant."},
    "Grape - Leaf Blight": {"nutrients": ["Potassium", "Calcium"], "recommendation": "Improve canopy ventilation, remove infected leaves promptly, and apply a copper-based fungicide."},
    "Peach - Bacterial Spot": {"nutrients": ["Calcium", "Potassium"], "recommendation": "Favour resistant varieties, apply copper sprays during dormancy, and avoid overhead irrigation that splashes bacteria onto leaves."},
    "Potato - Early Blight": {"nutrients": ["Potassium", "Calcium"], "recommendation": "Remove infected lower foliage, rotate crops, apply a protectant fungicide (chlorothalonil/mancozeb), and avoid water stress on plants."},
    "Potato - Late Blight": {"nutrients": ["Potassium", "Calcium"], "recommendation": "Act quickly - remove and destroy infected plants, apply fungicide immediately, and avoid overhead irrigation. This disease spreads very fast in cool, wet weather."},
    "Strawberry - Leaf Scorch": {"nutrients": ["Potassium", "Micronutrients"], "recommendation": "Remove infected leaves after harvest, improve airflow between plants, avoid overhead watering, and apply fungicide if it recurs."},
    "Tomato - Bacterial Spot": {"nutrients": ["Calcium", "Potassium"], "recommendation": "Apply a copper-based bactericide, avoid working with wet plants, remove infected debris, and rotate away from tomatoes/peppers next season."},
    "Tomato - Early Blight": {"nutrients": ["Potassium", "Calcium"], "recommendation": "Remove infected lower leaves, mulch to prevent soil splash onto foliage, apply fungicide, and rotate crops each season."},
    "Tomato - Late Blight": {"nutrients": ["Potassium", "Calcium"], "recommendation": "Act quickly - remove and destroy infected plants, apply fungicide preventatively in humid weather, and avoid overhead watering."},
    "Tomato - Septoria Leaf Spot": {"nutrients": ["Potassium", "Micronutrients"], "recommendation": "Remove infected lower leaves, mulch around the base, avoid overhead watering, and apply fungicide if spreading continues."},
    "Tomato - Yellow Leaf Curl Virus": {"nutrients": ["Balanced NPK", "Micronutrients"], "recommendation": "There is no cure - remove and destroy infected plants, control whitefly populations (the virus's carrier insect), and use resistant varieties next season."},
}
# Diseases that spread or worsen fast enough to warrant a "high" severity flag
# even when the model's confidence is moderate, since acting late is costly.
FAST_SPREADING = {"Potato - Late Blight", "Tomato - Late Blight", "Grape - Esca (Black Measles)", "Tomato - Yellow Leaf Curl Virus"}

def load_model() -> None:
    global model, labels
    if model is not None: return
    if not MODEL_PATH.exists() or not LABELS_PATH.exists():
        raise HTTPException(503, "No trained model installed. Run backend/train.py first.")
    model = tf.keras.models.load_model(MODEL_PATH, compile=False)
    labels = json.loads(LABELS_PATH.read_text(encoding="utf-8"))

def advice(label: str, confidence: float) -> dict:
    if "healthy" in label.lower():
        return {"healthy": True, "severity": "none", "recoveryChance": 99, "nutrients": ["Balanced NPK", "Calcium", "Micronutrients"], "recommendation": "Leaf appears healthy. Keep monitoring, irrigate at soil level, and scan again after rain."}
    entry = DISEASE_DB.get(label)
    severity = "high" if confidence >= .82 or label in FAST_SPREADING else "medium"
    recovery = 72 if severity == "high" else 89
    if entry:
        return {"healthy": False, "severity": severity, "recoveryChance": recovery, "nutrients": entry["nutrients"], "recommendation": entry["recommendation"]}
    # Fallback for a label our lookup doesn't cover yet (e.g. the model gets
    # retrained with a different/expanded class list) - never crash, just
    # fall back to generic guidance instead of a missing recommendation.
    return {"healthy": False, "severity": severity, "recoveryChance": recovery, "nutrients": ["Potassium", "Calcium", "Micronutrients"], "recommendation": "Remove severely affected leaves, improve spacing and airflow, avoid overhead irrigation, and confirm any fungicide choice with local agricultural guidance."}

@app.get("/health")
def health():
    return {"ready": MODEL_PATH.exists() and LABELS_PATH.exists(), "model": MODEL_PATH.name}

@app.post("/predict")
async def predict(image: UploadFile = File(...), crop: str = "Unknown"):
    if image.content_type not in {"image/jpeg", "image/png", "image/webp"}:
        raise HTTPException(415, "Upload a JPG, PNG, or WEBP leaf image.")
    raw = await image.read()
    if not raw or len(raw) > 8_000_000: raise HTTPException(413, "Image must be between 1 byte and 8 MB.")
    load_model()
    try:
        rgb = Image.open(io.BytesIO(raw)).convert("RGB").resize((224, 224))
    except Exception as exc: raise HTTPException(400, "Unreadable image.") from exc
    # EfficientNetB0 includes its own input rescaling, matching the 0–255 training batches.
    batch = np.expand_dims(np.asarray(rgb, dtype=np.float32), 0)
    scores = model.predict(batch, verbose=0)[0]
    top = np.argsort(scores)[::-1][:3]
    predictions = [{"label": labels[int(i)].replace("___", " · ").replace("_", " "), "confidence": round(float(scores[int(i)]), 4)} for i in top]
    return {"model": "EfficientNetB0 / PlantVillage", "crop": crop, "predictions": predictions, **advice(predictions[0]["label"], predictions[0]["confidence"])}