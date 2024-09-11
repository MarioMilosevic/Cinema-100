import {
  CollectionReference,
  DocumentData,
  query,
  orderBy,
  startAfter,
  startAt,
  limit,
  endBefore,
  limitToLast,
  getDocs,
  Query,
  where,
  doc,
  getDoc,
  Firestore,
  collection,
  addDoc,
  deleteDoc,
} from 'firebase/firestore'
import { logOutUser } from '../redux/features/userSlice'
import { db, auth } from '../config/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut,
} from 'firebase/auth'
import {
  CreateUserProps,
  SignInGuestProps,
  SignInUserProps,
  SignOutUserProps,
  GlobalUserType,
} from './types'

export const createUser = async ({
  data,
  dispatch,
  navigate,
  setGlobalUser,
  // setNewUser,
}: CreateUserProps) => {
  try {
    const newUser = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password,
    )
    const userQuery = query(
      collection(db, 'users'),
      where('email', '==', newUser.user.email),
    )
    const querySnapshot = await getDocs(userQuery)
    if (querySnapshot.empty) {
      const newUserData: GlobalUserType = {
        id: '',
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        bookmarkedMovies: [],
      }
      const docRef = await addDoc(collection(db, 'users'), newUserData)
      newUserData.id = docRef.id
      dispatch(setGlobalUser(newUserData))
      navigate('/home')
    } else {
      // setNewUser(initialNewUserState)
      alert('User already exists')
    }
  } catch (error) {
    console.error('Error', error)
  }
}

export const signInUser = async ({
  data,
  dispatch,
  navigate,
  setGlobalUser,
  setError,
}: SignInUserProps) => {
  try {
    const existingUser = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password,
    )
    const userQuery = query(
      collection(db, 'users'),
      where('email', '==', data.email),
    )
    const querySnapshot = await getDocs(userQuery)
    const user = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))[0] as GlobalUserType
    if (existingUser) {
      navigate('/home')
      dispatch(setGlobalUser(user))
    }
  } catch (error) {
    setError('Invalid Credentials')
    console.error(error)
  }
}

export const signInGuest = async ({
  dispatch,
  navigate,
  setGlobalUser,
}: SignInGuestProps) => {
  try {
    await signInAnonymously(auth)
    const guestUser: GlobalUserType = {
      id: '',
      name: 'Guest',
      lastName: '',
      email: 'guest@gmail.com',
      password: 'guest',
      bookmarkedMovies: [],
    }
    const docRef = await addDoc(collection(db, 'users'), guestUser)
    guestUser.id = docRef.id
    dispatch(setGlobalUser(guestUser))
    navigate('/home')
  } catch (error) {
    console.error(error)
  }
}

export const signOutUser = async ({
  dispatch,
  globalUser,
}: SignOutUserProps) => {
  try {
    await signOut(auth)
    if (globalUser.email === 'guest@gmail.com') {
      const userQuery = query(
        collection(db, 'users'),
        where('email', '==', globalUser.email),
      )
      const querySnapshot = await getDocs(userQuery)
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0]
        await deleteDoc(doc(db, 'users', userDoc.id))
      }
    }
    dispatch(logOutUser())
  } catch (error) {
    console.error('Error signing out', error)
  }
}

export const buildPaginationQuery = async (
  pageIndex: number,
  field: string,
  pageSize: number,
  moviesCollection: CollectionReference<DocumentData>,
  visibleDoc?: DocumentData | null,
  direction: 'next' | 'previous' = 'next',
) => {
  if (visibleDoc) {
    if (direction === 'next') {
      return query(
        moviesCollection,
        orderBy(field, 'desc'),
        startAfter(visibleDoc),
        limit(pageSize),
      )
    } else {
      return query(
        moviesCollection,
        orderBy(field, 'desc'),
        endBefore(visibleDoc),
        limitToLast(pageSize),
      )
    }
  }

  const data = await getDocs(
    query(
      moviesCollection,
      orderBy(field, 'desc'),
      limit(pageSize * (pageIndex + 1)),
    ),
  )

  if (direction === 'next') {
    return query(
      moviesCollection,
      orderBy(field, 'desc'),
      startAt(data.docs[pageIndex * pageSize]),
      limit(pageSize),
    )
  } else {
    return query(
      moviesCollection,
      orderBy(field, 'desc'),
      limitToLast(pageSize),
    )
  }
}

export const buildSearchQuery = (
  searchValue: string,
  genre: string,
  baseQuery: Query<DocumentData>,
) => {
  if (genre !== 'All') {
    return query(
      baseQuery,
      where('title', '>=', searchValue),
      where('title', '<=', searchValue + '\uf8ff'),
      where('genre', 'array-contains', genre),
    )
  }
  return query(
    baseQuery,
    where('title', '>=', searchValue),
    where('title', '<=', searchValue + '\uf8ff'),
  )
}

export const buildGenreQuery = (
  genre: string,
  baseQuery: Query<DocumentData>,
) => {
  return query(baseQuery, where('genre', 'array-contains', genre))
}

export const getProduct = async (
  idMovie: string | undefined,
  db: Firestore,
) => {
  if (!idMovie) return
  try {
    const docRef = doc(db, 'movies', idMovie)
    let docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      const trendingDocRef = doc(db, 'trending_movies', idMovie)
      docSnap = await getDoc(trendingDocRef)
    }
    if (docSnap.exists()) {
      return docSnap.data()
    }
  } catch (error) {
    console.error('Error fetching document:', error)
  }
}

export const fetchMovieDoc = async (
  movieId: string,
  moviesCollection: CollectionReference<DocumentData>,
) => {
  const q = query(moviesCollection, where('id', '==', movieId))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs[0]
}
