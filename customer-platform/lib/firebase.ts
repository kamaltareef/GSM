// Shared Firebase initialization.
// Reads config from NEXT_PUBLIC_FIREBASE_* env vars (see .env.local.example).
// If config is missing, `db` is null and the app falls back to local sample data —
// so it still runs without Firebase configured.
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseEnabled = Boolean(config.apiKey && config.projectId);

let db: Firestore | null = null;
if (firebaseEnabled) {
  const app: FirebaseApp = getApps().length ? getApp() : initializeApp(config);
  db = getFirestore(app);
}

export { db };
