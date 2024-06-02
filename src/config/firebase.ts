import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { collection, getDocs, getFirestore, addDoc, getDoc, setDoc, doc } from 'firebase/firestore'
// import { data } from '../utils/constants'
import { SingleMovieType } from '../utils/types'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

const colRef = collection(db, 'movies')

const flagDocRef = doc(db, "flags", "moviesAddedFlag")

export const fetchMovies = async () => {
  try {
    const snapshot = await getDocs(colRef)
    const movies = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    console.log(movies)
  } catch (err) {
    console.error('Error fetching documents: ', err)
  }
}

export const addMovies = async (movies:SingleMovieType[]) => {
  try {
    const flagDoc = await getDoc(flagDocRef)
    if (flagDoc.exists()) {
      console.log(flagDoc)
      console.log('Movies have already been added.')
      return
    }

    for (const movie of movies) {
      const docRef = await addDoc(colRef, movie)
      console.log('Document written with ID: ', docRef.id)
    }

    await setDoc(flagDocRef, { added: true })
    console.log('Movies added and flag set.')
  } catch (err) {
    console.error('Error adding document: ', err)
  }
}

// addMovies(data)
