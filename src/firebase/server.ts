import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

interface FirebaseInstances {
  firebaseApp: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}

export function initializeFirebase(): FirebaseInstances {
  if (!firebaseConfig.apiKey) {
    console.warn(
      'Firebase API Key is missing. The app cannot connect to Firebase and will not function correctly.'
    );
    return { firebaseApp: null, auth: null, firestore: null };
  }

  const firebaseApp = !getApps().length
    ? initializeApp(firebaseConfig)
    : getApp();
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);
  return { firebaseApp, auth, firestore };
}
