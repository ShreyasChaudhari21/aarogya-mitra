import { auth, db, doc, setDoc } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const testUsers = [
  { email: 'admin@aarogya.com', password: 'admin123', name: 'Aditya Admin', role: 'Admin' },
  { email: 'aditi@aarogya.com', password: 'doctor123', name: 'Dr. Aditi', role: 'Doctor' },
  { email: 'khanna@aarogya.com', password: 'khanna123', name: 'Dr. Khanna', role: 'Doctor' },
  { email: 'reception@aarogya.com', password: 'reception123', name: 'Rohan Reception', role: 'Receptionist' }
];

export const initializeFirebaseUsers = async () => {
  console.log("🚀 Starting Identity Initialization...");
  
  for (const user of testUsers) {
    try {
      let uid;
      try {
        console.log(`Creating ${user.role}: ${user.email}...`);
        const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
        uid = userCredential.user.uid;
      } catch (err: any) {
        if (err.code === 'auth/email-already-in-use') {
          console.log(`ℹ️ ${user.role} exists, synchronizing profile...`);
          const userCredential = await signInWithEmailAndPassword(auth, user.email, user.password);
          uid = userCredential.user.uid;
        } else {
          throw err;
        }
      }

      if (uid) {
        await setDoc(doc(db, "users", uid), {
          name: user.name,
          role: user.role,
          email: user.email,
          updatedAt: new Date().toISOString()
        });
        console.log(`✅ ${user.role} identity (${user.name}) synchronized.`);
        await signOut(auth);
      }
    } catch (err: any) {
      console.error(`❌ Sync Failed for ${user.role}:`, err.message);
    }
  }

  console.log("📍 Identity Setup Complete.");
};
