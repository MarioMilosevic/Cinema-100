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

// export const fetchInitialMovies = async () => {
//         const initialQuery = query(
//           moviesCollection,
//           orderBy(field, 'desc'),
//           limit(pageSize),
//         )
//         // const moviesRef = await getDocs(collection(db, 'movies'))
//     const data = await getDocs(initialQuery)
//     return data
//         // setMovies(
//         //     data.docs.map((doc) => ({
//         //         ...(doc.data() as SingleMovieType),
//         //         id: doc.id,
//         //     })),
//         // )
//         // setPagesCount(calculatePageButtons(moviesRef.size, pageSize))
//         // setActivePageIndex(0)
//         // setFirstVisible(data.docs[0])
//         // setLastVisible(data.docs[data.docs.length - 1])
//       }
