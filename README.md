<div align="center">

# 🏥 Aarogya Mitra
### AI-Powered Emergency Healthcare Platform

*"Your Health Friend"*


[![Flutter](https://img.shields.io/badge/Mobile-Flutter-02569B?style=flat-square&logo=flutter&logoColor=white)](https://flutter.dev)
[![React](https://img.shields.io/badge/Web-React_19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Firebase](https://img.shields.io/badge/Backend-Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Gemini AI](https://img.shields.io/badge/AI-Google_Gemini-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev)

**Google Solution Challenge 2026 · Team CureX · SDG 3 — Good Health & Well-being**

</div>

---

<!--
  =====================================================================
  HOW TO ADD SCREENSHOTS TO THIS README
  =====================================================================
  Step 1: Go to your GitHub repo
  Step 2: Click "Issues" → "New Issue"
  Step 3: Drag and drop your screenshot into the text box
  Step 4: GitHub auto-uploads it and gives you a link like:
          https://github.com/user-attachments/assets/abc123.png
  Step 5: Copy that link and replace the placeholder URLs below
  Step 6: You don't need to save or submit the issue at all — just copy the link!

  RECOMMENDED SCREENSHOTS (take these from your live deployed site):
  - Screenshot 1: Command Center with AI triage cards showing (1280×800)
  - Screenshot 2: Bed Heatmap with colour-coded wards visible (1280×800)
  - Screenshot 3: Mobile app SOS screen or Home screen (phone screenshot)
  =====================================================================
-->

## 📸 Screenshots

| AI Command Center | Live Bed Heatmap |
|:---:|:---:|
| ![Command Center](https://github.com/user-attachments/assets/03ec7fb0-87e0-41fb-ba63-b12770656e07) | ![Bed Heatmap](https://github.com/user-attachments/assets/2f45dc6a-23c5-4b9c-9de8-28103d923d0e) |

| Mobile App | Google Maps Integration |
|:---:|:---:|
| ![Mobile App](https://github.com/user-attachments/assets/7427c768-e8d8-4de1-9caa-aaa37f3e875b) | ![Maps View](https://github.com/user-attachments/assets/9d69f988-c9e3-45af-86e0-19c6c1b50bbc) |

---

## 🎬 Demo Video

<!--
  Paste your YouTube (unlisted) or Google Drive link below.
  Replace YOUR_YOUTUBE_VIDEO_LINK_HERE with your actual video link.
-->

> [![Watch the 3-minute Demo](https://img.shields.io/badge/▶_Watch_Demo-3_Minute_Video-red?style=for-the-badge)](YOUR_YOUTUBE_VIDEO_LINK_HERE)
>
> *Click the button above to watch how Aarogya Mitra saves lives in real time.*

---

## 📌 The Problem We Are Solving

Every year in India, thousands of people die during medical emergencies — not because there were no hospitals, but because:

- **Nobody knew which hospital had a free bed** — patients waste precious minutes calling hospitals one by one
- **Ambulances had no real-time routing** — they would reach the wrong hospital or wait without knowing the patient's exact location
- **Doctors were not prepared** — hospitals had no advance information about incoming critical patients
- **Rural users had no access** — most emergency apps require smartphones and good internet, which are not available everywhere
- Only **21% of patients** receive treatment within the critical "golden hour" — the first 60 minutes after an emergency

---

## 💡 What Aarogya Mitra Does

Aarogya Mitra is a **two-sided real-time platform** that connects patients to hospitals the moment an emergency begins.

- **For patients** — Use WhatsApp, our Flutter mobile app, or even a simple phone call. No complex setup needed
- **For hospitals** — A live React dashboard shows incoming cases, bed availability, ambulance status, and AI triage results
- **For doctors** — AI (powered by Google Gemini) analyses symptoms before the patient even arrives and gives clinical guidance
- **For rural areas** — WhatsApp support means users with basic phones and poor internet can still get help in their own language

**The core idea:** *The hospital knows you're coming before you arrive.*

---

## ✨ Key Features

### 🏥 Hospital Web Dashboard

| Feature | What It Does |
|---|---|
| **AI Command Center** | Google Gemini reads incoming symptoms and instantly assigns triage priority: Critical, Moderate, or Low — with a suggested clinical action for the doctor |
| **Real-time Bed Heatmap** | A colour-coded visual grid showing every bed in every ward — green (occupied), orange (reserved), white (free). Updates live |
| **Ambulance Dispatch** | One-click dispatch with GPS routing directly to the patient's live location |
| **Doctor Clinical Hub** | Shows patient history, AI-generated case notes, vitals from wearable, and prescription tools — all in one place |
| **Analytics Dashboard** | Charts for bed occupancy trends, case load by hour, staff utilisation, and response times |
| **Billing & UPI Payments** | Built-in cashless billing — supports Google Pay, UPI QR code, and Stripe |
| **Google Maps Integration** | Nearest hospitals shown on live map with their current bed availability |
| **Patient Queue System** | Real-time queue visible to both staff and patients — estimated wait times included |
| **Multilingual Interface** | Dashboard available in English, Hindi, Marathi, Tamil, Kannada, Malayalam |

### 📱 Patient Mobile App (Flutter)

| Feature | What It Does |
|---|---|
| **SOS Emergency Button** | One tap sends patient's GPS location and symptoms to the nearest hospital via Firebase — all within 3 seconds |
| **Live GPS Tracking** | Patient's real-time location streams to the hospital dashboard until they arrive |
| **AI Health Chat** | Gemini AI answers health questions and gives first-aid instructions in plain language |
| **Wearable Integration** | Reads heart rate, SpO₂, and other vitals from connected smart devices |
| **Hospital Booking** | Find nearby hospitals and book a regular appointment without calling |
| **Medical Reports** | Store and share digital health reports securely with any doctor |
| **6 Indian Languages** | English, Hindi, Marathi, Tamil, Kannada, Malayalam — switchable from profile |

---

## 🛠️ Tech Stack

| Part | Technologies Used |
|---|---|
| Web Dashboard | React 19, TypeScript, Vite, TailwindCSS, Framer Motion, Recharts |
| Mobile App | Flutter, Dart, Material 3, Google Fonts |
| AI | Google Gemini 1.5 Flash (triage + AI chat) |
| Database | Firebase Firestore (real-time sync) |
| Authentication | Firebase Authentication + Google Sign-In |
| File Storage | Firebase Storage |
| Maps | Google Maps JavaScript API + Flutter Geolocator |
| Deployment | Firebase Hosting |
| Payments | Stripe + UPI / Google Pay |

---

## 🗂️ Project Structure

```
Aarogya-Mitra/
│
├── 📁 Aarogya Mitra/              ← Web Dashboard (React + TypeScript)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── CommandCenter.tsx      ← AI triage + emergency queue
│   │   │   ├── HMSDashboard.tsx       ← Hospital stats overview
│   │   │   ├── BedAllotment.tsx       ← Live bed heatmap
│   │   │   ├── AmbulancePage.tsx      ← Dispatch + GPS routing
│   │   │   ├── MapView.tsx            ← Google Maps + hospital finder
│   │   │   ├── PatientsPage.tsx       ← Patient records
│   │   │   ├── BillingPage.tsx        ← UPI + Stripe payments
│   │   │   ├── AnalyticsPage.tsx      ← Charts and reports
│   │   │   ├── QueueSystem.tsx        ← Patient queue management
│   │   │   ├── AppointmentsPage.tsx   ← Appointment scheduling
│   │   │   ├── StaffPage.tsx          ← Staff management
│   │   │   ├── DoctorClinicalHub.tsx  ← Doctor's workspace + AI notes
│   │   │   └── LoginPage.tsx          ← Firebase Auth login
│   │   ├── components/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Topbar.tsx
│   │   │   └── GoogleMapsView.tsx
│   │   ├── services/
│   │   │   └── geminiService.ts       ← Google Gemini AI calls
│   │   ├── firebase.ts                ← Firebase config (uses .env)
│   │   ├── hooks/useAarogyaData.ts    ← Real-time Firestore hook
│   │   └── context/AarogyaContext.tsx ← App-wide state
│   ├── .env.example                   ← Copy this → rename to .env
│   └── package.json
│
└── 📁 Mobile app/                 ← Patient App (Flutter + Dart)
    ├── lib/
    │   ├── main.dart
    │   ├── firebase_options.dart       ← Firebase config (use placeholders)
    │   ├── screens/
    │   │   ├── home_screen.dart        ← Health dashboard + SOS button
    │   │   ├── sos_screen.dart         ← Emergency SOS + GPS tracking
    │   │   ├── booking_screen.dart     ← Hospital appointment booking
    │   │   ├── chat_screen.dart        ← Gemini AI chat
    │   │   ├── reports_screen.dart     ← Health reports
    │   │   └── profile_screen.dart     ← User profile + language switch
    │   └── services/
    │       ├── firestore_service.dart
    │       └── translation_service.dart
    ├── assets/.env.example            ← Copy this → rename to .env
    └── pubspec.yaml
```

---

## 🚀 How to Run the Project Locally

### What You Need First

- **Node.js** version 18 or higher — [Download](https://nodejs.org)
- **Flutter SDK** version 3.8 or higher — [Download](https://flutter.dev/docs/get-started/install)
- A **Firebase project** — [Create one free](https://console.firebase.google.com)
- A **Google Maps API key** — [Get one free](https://console.cloud.google.com) (enable Maps JavaScript API)
- A **Gemini API key** — [Get one free](https://aistudio.google.com/app/apikey)

---

### Part 1 — Web Dashboard Setup

**Step 1 — Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/aarogya-mitra.git
cd "aarogya-mitra/Aarogya Mitra"
```

**Step 2 — Install all dependencies**
```bash
npm install
```

**Step 3 — Set up your environment variables**
```bash
# Copy the example file
cp .env.example .env
```
Now open the `.env` file and fill in your actual API keys:
```env
VITE_GOOGLE_MAPS_API_KEY=paste_your_maps_key_here
VITE_FIREBASE_API_KEY=paste_your_firebase_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Step 4 — Start the development server**
```bash
npm run dev
```
Open your browser and go to: `http://localhost:5173`

**Step 5 — Build for production** *(optional)*
```bash
npm run build
```

---

### Part 2 — Mobile App Setup

**Step 1 — Go to the mobile app folder**
```bash
cd "aarogya-mitra/Mobile app"
```

**Step 2 — Install Flutter dependencies**
```bash
flutter pub get
```

**Step 3 — Set up Gemini API key**
```bash
# Copy the example file in the assets folder
cp assets/.env.example assets/.env
```
Open `assets/.env` and add your Gemini key:
```env
GEMINI_API_KEY=paste_your_gemini_key_here
```

**Step 4 — Set up Firebase for Flutter**
- Download your `google-services.json` from Firebase Console
- Place it at: `android/app/google-services.json`
- Open `lib/firebase_options.dart` and replace all `YOUR_FIREBASE_*` values with your actual Firebase project values

**Step 5 — Run the app**
```bash
# Check connected devices
flutter devices

# Run on your device or emulator
flutter run
```

---

## 🔐 Environment Variables Reference

### Web Dashboard (`Aarogya Mitra/.env`)

| Variable | Where to Get It | What It's For |
|---|---|---|
| `VITE_GOOGLE_MAPS_API_KEY` | Google Cloud Console → Credentials | Hospital map, ambulance routing |
| `VITE_FIREBASE_API_KEY` | Firebase Console → Project Settings → Web App | Firebase connection |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Console | Google Sign-In |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Console | Firestore database |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Console | File storage |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Console | Cloud messaging |
| `VITE_FIREBASE_APP_ID` | Firebase Console | App identification |

### Mobile App (`Mobile app/assets/.env`)

| Variable | Where to Get It | What It's For |
|---|---|---|
| `GEMINI_API_KEY` | Google AI Studio | AI health chat, symptom analysis |

> ⚠️ **Important:** Never commit your actual `.env` files to GitHub. Only `.env.example` files (with placeholder values) should be committed.

---

## 🎯 SDG Goals We Address

| SDG | How |
|---|---|
| **SDG 3 — Good Health & Well-being** | Faster emergency response saves lives during the "golden hour" |
| **SDG 10 — Reduced Inequalities** | WhatsApp + 6 regional languages makes healthcare accessible to rural users |
| **SDG 9 — Industry, Innovation & Infrastructure** | Builds digital health infrastructure where none existed |
| **SDG 11 — Sustainable Cities** | Improves emergency response coordination in urban and semi-urban areas |
| **SDG 17 — Partnerships for the Goals** | Connects patients, hospitals, ambulances, and government health systems |

---

## 👥 Team

**Team Name:** CureX

| Member | Name |
|---|---|
| 1 | Shreyas Chaudhari |
| 2 | Jainesh Mugdiya   |
| 3 | Aditya karodiwal  |
| 4 | Khushi Borde      |

*Built for Google Solution Challenge 2026*

---

## 🔗 Important Links

| | Link |
|---|---|
| 🌐 Live Demo | [Click to open deployed app](YOUR_DEPLOYED_LINK_HERE) |
| ▶ Demo Video | [Watch on YouTube](YOUR_YOUTUBE_VIDEO_LINK_HERE) |
| 📊 Presentation | [View Prototype Deck](YOUR_PPT_LINK_HERE) |

---

<div align="center">
  <sub>Made with ❤️ in India · Aarogya Mitra — Your Health Friend</sub>
</div>
