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
