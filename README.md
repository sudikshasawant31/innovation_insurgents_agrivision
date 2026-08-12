# AgriVision AI

Premium Next.js farm dashboard with a 3D digital-twin scene, camera preview, disease-analysis workflow, multilingual-ready assistant, weather risk views, remedies, nutrient plans, field heatmap, QR profile, scheme cards, and offline queue UX.

## Run the ML service

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python train.py
uvicorn app.main:app --reload --port 8000
```

`train.py` downloads `snikhilrao/crop-disease-detection-dataset` using `kagglehub`, trains EfficientNetB0 on the detected class directories, and saves `models/plant_disease.keras` plus labels. The API refuses scans until these real model artifacts exist; it never fabricates a diagnosis.

## Run the web app

```powershell
Copy-Item .env.example .env.local
pnpm install
pnpm dev
```

Open `http://localhost:3000`. The crop-analysis upload routes to FastAPI; Puter powers the browser assistant with `gpt-5.4-nano` without an API key. For production, deploy the Next app to Vercel and the `backend` service to Render/Railway, then set `ML_SERVICE_URL` to the public backend URL.

## Farmer login and map

Sign-in has two paths, both of which end with the browser holding a normal Firebase session (so the rest of the app — Firestore profile, farm data — doesn't need to change):

1. **Mobile OTP via Twilio Verify.** The client calls `POST /api/auth/send-otp` and `POST /api/auth/verify-otp`. Those routes talk to Twilio's Verify API, and once the code checks out, the server mints a Firebase custom sign-in token for that phone number.
2. **Google sign-in via your own OAuth client.** Clicking "Continue with Google" redirects to `GET /api/auth/google`, which sends the browser through Google's OAuth consent screen using your own `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` (not Firebase's built-in Google provider). `GET /api/auth/google/callback` exchanges the code, reads the Google profile, and mints a Firebase custom token, then redirects to `/auth/complete` where the client signs into Firebase with that token.

Setup:

1. **Firebase project.** Create a Firebase web app and copy its four public config values into `NEXT_PUBLIC_FIREBASE_*` in `.env.local`.
2. **Firebase Admin.** In Firebase console → Project settings → Service accounts, generate a private key. Either paste the whole downloaded JSON into `FIREBASE_SERVICE_ACCOUNT_JSON` (as one line), or split it into `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY`.
3. **Twilio Verify.** Create a [Verify Service](https://console.twilio.com/us1/develop/verify/services) in the Twilio console, then set `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_VERIFY_SERVICE_SID`.
4. **Google OAuth client.** In [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials), create an OAuth 2.0 Web application client. Add `http://localhost:3000/api/auth/google/callback` (and your production URL's equivalent) as an authorized redirect URI, then set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

The field heatmap is an interactive India map: click a field marker to inspect its health, then use the external-link button to open the exact point in Google Maps.
