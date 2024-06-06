import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, collection } from 'firebase/firestore'
import { firebaseConfig } from '../config/firebase'

export const useAuth = () => {
  const firebaseApp = initializeApp(firebaseConfig)
  const auth = getAuth(firebaseApp)
  const db = getFirestore(firebaseApp)
  const moviesCollection = collection(db, 'movies')

  return { firebaseApp, db, auth, moviesCollection }
}

