import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
  // Replace these with your actual Firebase configuration
  // Get these values from: https://console.firebase.google.com -> Project Settings -> Web App Configuration
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | undefined;
let auth: Auth | null = null;

// Only initialize if we have valid config
const hasValidConfig = Object.values(firebaseConfig).every(val => val);

if (hasValidConfig) {
  try {
    // Check if Firebase is already initialized
    const existingApps = getApps();
    if (existingApps.length === 0) {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
    } else {
      app = existingApps[0];
      auth = getAuth(app);
    }
  } catch (error) {
    console.warn('Firebase initialization error:', error);
  }
}

export { auth };
export default app;
