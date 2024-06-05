import { useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection } from 'firebase/firestore';
import { firebaseConfig } from '../config/firebase';

export const useAuth = () => {
  const app = useMemo(() => initializeApp(firebaseConfig), []);
  const auth = useMemo(() => getAuth(app), [app]);
  const db = useMemo(() => getFirestore(app), [app]);
  const moviesCollection = useMemo(() => collection(db, 'movies'), [db]);

  return { app, auth, db, moviesCollection };
};
