import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import { getMessaging } from "firebase/messaging";

// Replace with actual config for production
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "aarogya-mitra.firebaseapp.com",
  projectId: "aarogya-mitra",
  storageBucket: "aarogya-mitra.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

export default app;
