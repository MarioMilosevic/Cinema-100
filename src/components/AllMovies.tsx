import { AllMoviesProps } from '../utils/types'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import {
  buildSearchQuery,
  buildGenreQuery,
  buildPaginationQuery,
} from '../utils/api'
import {
  startAfter,
  limit,
  query,
  DocumentData,
  Query,
  getDocs,
  orderBy,
  collection,
  endBefore,
  limitToLast,
  where,
} from 'firebase/firestore'
import { useDebounce } from '../hooks/useDebounce'
import { pageSize, field } from '../utils/constants'
import { calculatePageButtons } from '../utils/helperFunctions'
import { baseQuery, moviesCollection, db } from '../config/firebase'
import { SingleMovieType } from '../utils/types'
import { useUserSlice } from '../hooks/useUserSlice'
import { useMoviesSlice } from '../hooks/useMovies'
import { useState, useEffect } from 'react'
import { setAllMovies } from '../redux/features/moviesSlice'
import { useDispatch } from 'react-redux'
import Menu from './Menu'
import MovieCard from './MovieCard'
import PageButton from './PageButton'
const AllMovies = ({
  bookmarkedPage,
  setBookmarkedPage,
  firstVisible,
  setFirstVisible,
  lastVisible,
  setLastVisible,
}: AllMoviesProps) => {
  const [searchValue, setSearchValue] = useState<string>('')
  const [genre, setGenre] = useState<string>('All')
  const [pagesCount, setPagesCount] = useState<number[]>([])
  const {
    globalUser: { bookmarkedMovies },
  } = useUserSlice()
  const { movies } = useMoviesSlice()
  const [activePageIndex, setActivePageIndex] = useState<number>(0)
  const dispatch = useDispatch()
  const debouncedSearch = useDebounce(searchValue)

  useEffect(() => {
    const setPagination = async () => {
      const moviesRef = await getDocs(collection(db, 'movies'))
      setPagesCount(calculatePageButtons(moviesRef.size, pageSize))
      setActivePageIndex(0)
    }
    setPagination()
  }, [])

  useEffect(() => {
    const filterMovies = async (searchInput: string, selectedGenre: string) => {
      let searchQuery: Query<DocumentData> = baseQuery

      if (searchInput && selectedGenre !== 'All') {
        searchQuery = query(
          baseQuery,
          where('title', '>=', searchInput),
          where('title', '<=', searchInput + '\uf8ff'),
          where('genre', 'array-contains', selectedGenre),
        )
      } else if (searchInput && selectedGenre === 'All') {
        searchQuery = query(
          baseQuery,
          where('title', '>=', searchInput),
          where('title', '<=', searchInput + '\uf8ff'),
        )
      } else if (!searchInput && selectedGenre !== 'All') {
        searchQuery = query(
          baseQuery,
          where('genre', 'array-contains', selectedGenre),
        )
      } else {
        const initialQuery = query(
          moviesCollection,
          orderBy(field, 'desc'),
          limit(pageSize),
        )

        const data = await getDocs(initialQuery)
        dispatch(
          setAllMovies(
            data.docs.map((doc) => ({
              ...(doc.data() as SingleMovieType),
            })),
          ),
        )
        // setMovies(
        //   data.docs.map((doc) => ({
        //     ...(doc.data() as SingleMovieType),
        //   })),
        // )
        setFirstVisible(data.docs[0])
        setLastVisible(data.docs[data.docs.length - 1])
        return
      }

      const data = await getDocs(searchQuery)
      const filteredData = data.docs.map((doc) => ({
        ...(doc.data() as SingleMovieType),
      }))

      dispatch(setAllMovies(filteredData.slice(0, pageSize)))
      // setMovies(filteredData.slice(0, pageSize))
      setFirstVisible(data.docs[0])

      if (data.docs.length < pageSize) {
        setLastVisible(data.docs[data.docs.length - 1])
      } else {
        setLastVisible(data.docs[pageSize - 1])
      }
      setPagesCount(calculatePageButtons(filteredData.length, pageSize))
      setActivePageIndex(0)
    }

    filterMovies(debouncedSearch, genre)
  }, [debouncedSearch, dispatch, genre, setFirstVisible, setLastVisible])

  const bookmarkedMoviesIds = bookmarkedMovies.map((movie) => movie.id)

  const fetchInitialMovies = async () => {
    const initialQuery = query(
      moviesCollection,
      orderBy(field, 'desc'),
      limit(pageSize),
    )

    const data = await getDocs(initialQuery)
    dispatch(setAllMovies(
        data.docs.map((doc) => ({
          ...(doc.data() as SingleMovieType),
        })),

    ))
    // setMovies(
    //   data.docs.map((doc) => ({
    //     ...(doc.data() as SingleMovieType),
    //   })),
    // )
    setFirstVisible(data.docs[0])
    setLastVisible(data.docs[data.docs.length - 1])
  }

  const nextPage = async () => {
    if (activePageIndex === pagesCount.length - 1) return

    let queryRef: Query<DocumentData>

    if (searchValue) {
      queryRef = query(
        buildSearchQuery(searchValue, genre, baseQuery),
        startAfter(lastVisible),
        limit(pageSize),
      )
    } else if (genre !== 'All') {
      queryRef = query(
        buildGenreQuery(genre, baseQuery),
        startAfter(lastVisible),
        limit(pageSize),
      )
    } else {
      queryRef = await buildPaginationQuery(
        activePageIndex + 1,
        field,
        pageSize,
        moviesCollection,
        lastVisible,
        'next',
      )
    }

    await fetchMovies(queryRef)
    setActivePageIndex((prev) => prev + 1)
  }

  const fetchAndSetMovies = async (
    queryRef: Query<DocumentData>,
    pageIndex: number,
    pageSize: number,
  ) => {
    const data = await getDocs(queryRef)
    dispatch(setAllMovies(
        data.docs
          .map((doc) => ({
            ...(doc.data() as SingleMovieType),
          }))
          .slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
    ))
    // setMovies(
    //   data.docs
    //     .map((doc) => ({
    //       ...(doc.data() as SingleMovieType),
    //     }))
    //     .slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
    // )
    setPagesCount(calculatePageButtons(data.size, pageSize))
    setActivePageIndex(pageIndex)
  }

  const goToPage = async (pageIndex: number) => {
    let queryRef: Query<DocumentData>

    if (searchValue) {
      queryRef = buildSearchQuery(searchValue, genre, baseQuery)
    } else if (genre !== 'All') {
      queryRef = buildGenreQuery(genre, baseQuery)
    } else {
      queryRef = await buildPaginationQuery(
        pageIndex,
        field,
        pageSize,
        moviesCollection,
      )
      await fetchMovies(queryRef)
      setActivePageIndex(pageIndex)
      return
    }

    await fetchAndSetMovies(queryRef, pageIndex, pageSize)
  }

  const previousPage = async () => {
    if (activePageIndex === 0) return

    let queryRef: Query<DocumentData>

    if (searchValue) {
      queryRef = query(
        buildSearchQuery(searchValue, genre, baseQuery),
        endBefore(firstVisible),
        limitToLast(pageSize),
      )
    } else if (genre !== 'All') {
      queryRef = query(
        buildGenreQuery(genre, baseQuery),
        endBefore(firstVisible),
        limitToLast(pageSize),
      )
    } else {
      queryRef = await buildPaginationQuery(
        activePageIndex - 1,
        field,
        pageSize,
        moviesCollection,
        firstVisible,
        'previous',
      )
    }

    await fetchMovies(queryRef)
    setActivePageIndex((prev) => prev - 1)
  }

  const searchMovies = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchInput = e.target.value.toLowerCase()
    setSearchValue(searchInput)
    filterMovies(debouncedSearch, genre)
  }

  const searchGenre = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGenre = e.target.value
    setGenre(selectedGenre)
    filterMovies(searchValue, selectedGenre)
  }

  const filterMovies = async (searchInput: string, selectedGenre: string) => {
    let searchQuery: Query<DocumentData> = baseQuery

    if (searchInput && selectedGenre !== 'All') {
      searchQuery = query(
        baseQuery,
        where('title', '>=', searchInput),
        where('title', '<=', searchInput + '\uf8ff'),
        where('genre', 'array-contains', selectedGenre),
      )
    } else if (searchInput && selectedGenre === 'All') {
      searchQuery = query(
        baseQuery,
        where('title', '>=', searchInput),
        where('title', '<=', searchInput + '\uf8ff'),
      )
    } else if (!searchInput && selectedGenre !== 'All') {
      searchQuery = query(
        baseQuery,
        where('genre', 'array-contains', selectedGenre),
      )
    } else {
      fetchInitialMovies()
      return
    }

    const data = await getDocs(searchQuery)
    const filteredData = data.docs.map((doc) => ({
      ...(doc.data() as SingleMovieType),
    }))

    dispatch(setAllMovies(filteredData.slice(0, pageSize)))
    // setMovies(filteredData.slice(0, pageSize))
    setFirstVisible(data.docs[0])

    if (data.docs.length < pageSize) {
      setLastVisible(data.docs[data.docs.length - 1])
    } else {
      setLastVisible(data.docs[pageSize - 1])
    }
    setPagesCount(calculatePageButtons(filteredData.length, pageSize))
    setActivePageIndex(0)
  }

  const fetchMovies = async (queryRef: Query<DocumentData>) => {
    const data = await getDocs(queryRef)
    dispatch(setAllMovies(
      data.docs.map((doc) => ({
        ...(doc.data() as SingleMovieType),
      })),
    ))
    // setMovies(
    //   data.docs.map((doc) => ({
    //     ...(doc.data() as SingleMovieType),
    //   })),
    // )
    setFirstVisible(data.docs[0])
    setLastVisible(data.docs[data.docs.length - 1])
  }
  return (
    <>
      <Menu
        searchValue={searchValue}
        searchMovies={searchMovies}
        searchGenre={searchGenre}
        genre={genre}
        bookmarkedPage={bookmarkedPage}
        setBookmarkedPage={setBookmarkedPage}
      />
      <div className="lg:grid lg:grid-cols-4 flex flex-col items-center gap-2 lg:py-4 py-8">
        {movies.map((movie) => {
          const isBookmarked = bookmarkedMoviesIds.includes(movie.id)
          return (
            <MovieCard
              key={movie.id}
              {...movie}
              isBookmarked={isBookmarked}
              size="small"
            />
          )
        })}
      </div>
      <div className="py-8 flex justify-center items-center lg:gap-2 gap-1">
        <button
          className="lg:px-4 lg:py-2 px-3 py-1 rounded-lg transition-all duration-100 bg-gray-900 text-gray-300 hover:bg-gray-300 hover:text-gray-900"
          onClick={previousPage}
        >
          <FaArrowLeft />
        </button>
        {pagesCount.map((el, index) => (
          <PageButton
            key={index}
            clickHandler={() => goToPage(index)}
            isActive={activePageIndex === index ? 'true' : 'false'}
          >
            {el + 1}
          </PageButton>
        ))}
        <button
          className="lg:px-4 lg:py-2 px-3 py-1 rounded-lg transition-all duration-100 bg-gray-900 text-gray-300 hover:bg-gray-300 hover:text-gray-900"
          onClick={nextPage}
        >
          <FaArrowRight />
        </button>
      </div>
    </>
  )
}

export default AllMovies
