import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, collection, orderBy, query } from 'firebase/firestore'
import { firebaseConfig } from '../config/firebase'
import { field } from '../utils/constants'
const firebaseApp = initializeApp(firebaseConfig)
const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)
const moviesCollection = collection(db, 'movies')
const trendingMoviesCollection = collection(db, "trending_movies")
const baseQuery = query(moviesCollection, orderBy(field, 'desc'))


export const useAuth = () => {
  return { firebaseApp, db, auth, moviesCollection, trendingMoviesCollection, baseQuery }
}
