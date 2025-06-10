// ✅ File: /firebaseConfig.ts

import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ✅ Provided config
const firebaseConfig = {
  apiKey: "AIzaSyAzu3C2-wslq5Af6x5WvK5ISIjDA4Bg-s4",
  authDomain: "toy-savior.firebaseapp.com",
  projectId: "toy-savior",
  storageBucket: "toy-savior.appspot.com",
  messagingSenderId: "96339078764",
  appId: "1:96339078764:web:3c7b752a1e44ccdb293249"
};

// ✅ Fix: Only initialize if not already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

