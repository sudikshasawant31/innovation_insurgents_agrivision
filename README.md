# 🌱 AgriVision AI

### AI-Powered Crop Disease Detection & Smart Farming Assistant

> **Empowering farmers with Artificial Intelligence for faster, smarter, and accessible crop disease detection.**

---

## 📌 Overview

**AgriVision AI** is an AI-powered agricultural assistant designed to help farmers identify crop diseases and receive useful recommendations through an easy-to-use digital platform.

The system combines **Artificial Intelligence, Computer Vision, Voice Assistance, and Multilingual Interaction** to make agricultural technology more accessible to farmers.

Farmers can upload an image of an affected crop or leaf, and the system analyzes it to identify potential diseases and provide relevant information and recommendations.

---

## 🎯 Problem Statement

Farmers often face difficulties in identifying crop diseases at an early stage due to:

* Lack of immediate access to agricultural experts
* Difficulty identifying diseases from symptoms
* Limited availability of agricultural resources
* Language and accessibility barriers
* Delayed disease detection leading to crop losses

AgriVision AI aims to address these challenges through an accessible AI-based solution.

---

## 💡 Our Solution

AgriVision AI provides a single platform where farmers can:

🌿 Upload crop images
🔍 Detect potential crop diseases
📋 Understand disease symptoms
💊 Get treatment and prevention guidance
🎙️ Interact using voice commands
🌐 Access multilingual assistance
👨‍🌾 Use a simple farmer-friendly interface

---

# ✨ Key Features

## 🌿 AI Crop Disease Detection

Upload an image of an affected crop or leaf and use AI-powered image analysis to identify the potential disease.

### Provides:

* Disease identification
* Disease confidence / prediction
* Symptoms
* Possible causes
* Prevention methods
* Treatment recommendations

---

## 🎙️ Voice Assistant

AgriVision AI includes a voice-based assistant that allows farmers to interact with the system naturally.

### Features:

* 🎤 Voice input
* 🔊 Voice responses
* 🌐 Multilingual interaction
* 👨‍🌾 Farmer-friendly communication

---

## 🌐 Multilingual Support

The platform is designed to support regional languages so that farmers who are not comfortable with English can interact with the system more easily.

---

## 📊 Farmer Dashboard

The dashboard provides an organized interface for accessing:

* Crop disease detection
* Disease history
* Recommendations
* Voice assistant
* Agricultural information

---

## 📱 Responsive Design

The interface is designed to provide a smooth experience across:

* 💻 Desktop
* 📱 Mobile
* 📟 Tablet

---

# 🏗️ System Architecture

```text
                         👨‍🌾 FARMER
                              │
                              ▼
                  ┌──────────────────────┐
                  │   AgriVision AI      │
                  │      Dashboard       │
                  └──────────┬───────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
      ┌────────────────┐           ┌─────────────────┐
      │  Crop Image    │           │ Voice Assistant │
      │    Upload      │           │                 │
      └───────┬────────┘           └────────┬────────┘
              │                             │
              ▼                             ▼
      ┌────────────────────────────────────────────┐
      │              AI / ML ANALYSIS              │
      │                                             │
      │       Computer Vision & Image Analysis     │
      └────────────────────┬───────────────────────┘
                           │
                           ▼
                 ┌─────────────────────┐
                 │ Disease Detection    │
                 └──────────┬──────────┘
                            │
                            ▼
              ┌──────────────────────────┐
              │ Disease Information      │
              │ & Recommendations        │
              └────────────┬─────────────┘
                           │
                           ▼
                      👨‍🌾 FARMER
```

---

# 🔄 How It Works

### 1️⃣ Upload Crop Image

The farmer uploads an image of the affected crop or leaf.

### 2️⃣ Image Processing

The uploaded image is processed by the AI-based analysis system.

### 3️⃣ Disease Detection

The system analyzes visual characteristics and identifies the most likely crop disease.

### 4️⃣ Disease Information

The farmer receives information about the detected disease, including symptoms and possible causes.

### 5️⃣ Recommendations

The system provides appropriate prevention and treatment guidance.

### 6️⃣ Voice Interaction

The farmer can also interact with the assistant through voice commands.

---

# 🛠️ Technology Stack

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

## Artificial Intelligence

* Computer Vision
* Image Classification
* AI-powered Image Analysis
* Machine Learning

## Backend / APIs

* Node.js
* REST APIs

## Other Technologies

* Web Speech API
* Authentication
* Cloud Services
* Git
* GitHub

---

# 📂 Project Structure

```text
AgriVision-AI/
│
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── ...
│
├── components/
│   ├── agrivision-dashboard.tsx
│   ├── voice.tsx
│   └── ...
│
├── public/
│   ├── images/
│   └── ...
│
├── lib/
│   └── ...
│
├── .env.local
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
```

## 2. Navigate to the Project

```bash
cd YOUR-REPOSITORY
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Configure Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=

NEXTAUTH_URL=
NEXTAUTH_SECRET=

AI_API_KEY=
```

> ⚠️ **Do not upload API keys or `.env.local` to GitHub.**

## 5. Start the Development Server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

---

# 🔐 Environment Variables

Make sure sensitive environment variables are stored locally and are not committed to the repository.

Recommended `.gitignore`:

```gitignore
.env
.env.local
.env.*.local

node_modules/
.next/
```

---

# 📚 Project Resources

## 📊 Project Presentation

The complete project presentation is available here:

👉 **[View / Download Project PPT](https://drive.google.com/file/d/1FqhQGA6CkFWhezAyIj4V3eQsGomMNyxo/view?usp=sharing)**

**PPT Link:**

```text
https://drive.google.com/file/d/1FqhQGA6CkFWhezAyIj4V3eQsGomMNyxo/view?usp=sharing
```

---

## 🎥 Project Demonstration Video

Watch the complete demonstration of AgriVision AI:

👉 **[Watch Project Demo Video](https://drive.google.com/drive/folders/1GRxlHENpNljbLaPy2eTBzFDczc2ifQXj?usp=drive_link)**

**Video Link:**

```text
https://drive.google.com/drive/folders/1GRxlHENpNljbLaPy2eTBzFDczc2ifQXj?usp=drive_link
```
---


# 🎯 Objectives

The major objectives of AgriVision AI are:

1. Detect crop diseases using Artificial Intelligence.
2. Provide farmers with quick and understandable disease information.
3. Provide treatment and prevention recommendations.
4. Enable voice-based interaction.
5. Support multilingual communication.
6. Create an accessible and farmer-friendly agricultural platform.
7. Reduce delays in identifying crop diseases.

---

# 🌾 Impact

AgriVision AI aims to contribute towards:

* Early crop disease detection
* Reduced crop losses
* Improved farmer awareness
* Faster agricultural decision-making
* Better access to agricultural information
* Increased accessibility of AI technology in rural areas

---

# 🔮 Future Scope

Future improvements may include:

* 🤖 Improved disease classification accuracy
* 🌾 Support for additional crops and diseases
* 📍 Location-based agricultural recommendations
* 🌦️ Weather-based disease prediction
* 🧪 Fertilizer recommendations
* 🗣️ Additional regional languages
* 📱 Dedicated Android / iOS application
* 📡 Offline functionality for low-connectivity areas
* 👨‍🌾 Expert consultation
* 📈 Long-term crop health monitoring
* 🛰️ Satellite and remote-sensing based crop monitoring

---

# 🤝 Team

### Team AgriVision AI

**Team Members**

* 👩‍💻 Sudiksha Sawant
* 👨‍💻 Om Rane

---

# 📜 License

This project is developed for **educational, research, innovation, and demonstration purposes**.

---

# ⭐ Support

If you find **AgriVision AI** useful or interesting, consider giving this repository a ⭐ on GitHub!

---

<div align="center">

### 🌱 AgriVision AI

**AI for Smarter Farming • Technology for Better Agriculture**

🌾 **Detect. Understand. Act.**

</div>
