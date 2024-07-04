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
} from 'firebase/firestore'

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

export const fetchBookmarkedMovies = async (userId: string, db: Firestore) => {
  try {
    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)
    if (userDoc.exists()) {
      const userData = userDoc.data()
      const bookmarkedMovies = userData.bookmarkedMovies
      return bookmarkedMovies
    } else {
      console.log('No such document!')
    }
  } catch (error) {
    console.error('Error fetching bookmarked movies:', error)
  }
}
