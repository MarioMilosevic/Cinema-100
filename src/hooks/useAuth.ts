import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, collection } from 'firebase/firestore'
import { firebaseConfig } from '../config/firebase'

const firebaseApp = initializeApp(firebaseConfig)
const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)
const moviesCollection = collection(db, 'movies')
const trendingMoviesCollection = collection(db, "trending_movies")

export const useAuth = () => {
  return { firebaseApp, db, auth, moviesCollection, trendingMoviesCollection }
}
