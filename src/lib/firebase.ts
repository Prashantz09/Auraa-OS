import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Helper to remove surrounding quotes if accidentally included in env variables
const cleanEnv = (val?: string) => val?.replace(/^"|'|"|'$/g, '');

export const firebaseConfig = {
    apiKey: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
    authDomain: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
    projectId: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
    storageBucket: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
    messagingSenderId: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
    appId: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
    measurementId: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID)
};

// Initialize Firebase gracefully: prevents crashing during the Next.js build
// if environment variables are not loaded, or on the server side.
let app;
if (!getApps().length) {
    if (firebaseConfig.apiKey) {
        app = initializeApp(firebaseConfig);
    }
} else {
    app = getApp();
}

const auth = app ? getAuth(app) : ({} as any);
const db = app ? getFirestore(app) : ({} as any);

export { app, auth, db };
