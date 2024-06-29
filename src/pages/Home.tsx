import { useState, useEffect } from 'react'
import {
  getDocs,
  query,
  orderBy,
  startAfter,
  endBefore,
  limit,
  limitToLast,
  Query,
  DocumentData,
  collection,
  where,
  doc,
  getDoc,
} from 'firebase/firestore'
import {
  moviesCollection,
  trendingMoviesCollection,
  db,
  baseQuery,
} from '../config/firebase'
import { FaBookmark } from 'react-icons/fa'
import { FaHouse } from 'react-icons/fa6'
import { SingleMovieType } from '../utils/types'
import { calculatePageButtons } from '../utils/helperFunctions'
import { SlMagnifier } from 'react-icons/sl'
import { allGenres, pageSize, field } from '../utils/constants'
import {
  buildPaginationQuery,
  buildGenreQuery,
  buildSearchQuery,
} from '../utils/api'
import { useDebounce } from '../hooks/useDebounce'
import Slider from '../components/Slider'
import LoadingSpinner from '../components/LoadingSpinner'
import AllMovies from '../components/AllMovies'
import BookmarkedMovies from '../components/BookmarkedMovies'
import { useAppSlice } from '../hooks/useAppSlice'

const Home = () => {
  const [movies, setMovies] = useState<SingleMovieType[]>([])
  const [trendingMovies, setTrendingMovies] = useState<SingleMovieType[]>([])
  const [bookmarkedMovies, setBookmarkedMovies] = useState<SingleMovieType[]>([])
  const [firstVisible, setFirstVisible] = useState<DocumentData | null>(null)
  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null)
  const [activePageIndex, setActivePageIndex] = useState<number>(0)
  const [pagesCount, setPagesCount] = useState<number[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const [genre, setGenre] = useState<string>('All')
  const [bookmarkedPage, setBookmarkedPage] = useState<boolean>(false)
  const debouncedSearch = useDebounce(searchValue)
  const { globalUser } = useAppSlice()

  useEffect(() => {
    fetchTrendingMovies()
    fetchBookmarkedMovies()
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
        fetchInitialMovies()
        return
      }

      const data = await getDocs(searchQuery)
      const filteredData = data.docs.map((doc) => ({
        ...(doc.data() as SingleMovieType),
        id: doc.id,
      }))

      setMovies(filteredData.slice(0, pageSize))
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
  }, [debouncedSearch, genre])

  const fetchTrendingMovies = async () => {
    console.log(trendingMoviesCollection)
    const trendingMoviesQuery = query(trendingMoviesCollection)
    const trendingMoviesData = await getDocs(trendingMoviesQuery)
    console.log(trendingMoviesData)
    setTrendingMovies(
      trendingMoviesData.docs.map((doc) => ({
        ...(doc.data() as SingleMovieType),
        id: doc.id,
      })),
    )
  }

  const fetchBookmarkedMovies = async () => {
    try {
      const userRef = doc(db, 'users', globalUser.id)
      const userDoc = await getDoc(userRef)
      console.log(userDoc)

      if (userDoc.exists()) {
        const userData = userDoc.data()
        const bookmarkedMoviesRefs = userData.bookmarkedMovies
        console.log('Bookmarked Movies References: ', bookmarkedMoviesRefs)
        setBookmarkedMovies(bookmarkedMoviesRefs)
      } else {
        console.log('No such document!')
      }
    } catch (error) {
      console.error('Error fetching bookmarked movies: ', error)
    }
  }

  const fetchInitialMovies = async () => {
    const initialQuery = query(
      moviesCollection,
      orderBy(field, 'desc'),
      limit(pageSize),
    )
    const moviesRef = await getDocs(collection(db, 'movies'))
    setPagesCount(calculatePageButtons(moviesRef.size, pageSize))
    setActivePageIndex(0)
    const data = await getDocs(initialQuery)
    setMovies(
      data.docs.map((doc) => ({
        ...(doc.data() as SingleMovieType),
        firebaseId: doc.id,
      })),
    )
    setFirstVisible(data.docs[0])
    setLastVisible(data.docs[data.docs.length - 1])
  }

  const fetchMovies = async (queryRef: Query<DocumentData>) => {
    const data = await getDocs(queryRef)
    setMovies(
      data.docs.map((doc) => ({
        ...(doc.data() as SingleMovieType),
        firebaseId: doc.id,
      })),
    )
    setFirstVisible(data.docs[0])
    setLastVisible(data.docs[data.docs.length - 1])
  }

  const fetchAndSetMovies = async (
    queryRef: Query<DocumentData>,
    pageIndex: number,
    pageSize: number,
  ) => {
    const data = await getDocs(queryRef)
    setMovies(
      data.docs
        .map((doc) => ({
          ...(doc.data() as SingleMovieType),
          firebaseId: doc.id,
        }))
        .slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
    )
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
      firebaseId: doc.id,
    }))

    setMovies(filteredData.slice(0, pageSize))
    setFirstVisible(data.docs[0])

    if (data.docs.length < pageSize) {
      setLastVisible(data.docs[data.docs.length - 1])
    } else {
      setLastVisible(data.docs[pageSize - 1])
    }
    setPagesCount(calculatePageButtons(filteredData.length, pageSize))
    setActivePageIndex(0)
  }

  const allMovies = [...movies, ...trendingMovies]
  // console.log(allMovies)

  // const bookmarkedMoviesIds = bookmarkedMovies.map((movie) => movie.firebaseId)
  // console.log(bookmarkedMoviesIds)

  // console.log(movies)
  // console.log(trendingMovies)
  console.log(bookmarkedMovies)

  return (
    <div className="max-w-[1300px] mx-auto flex flex-col min-h-screen">
      {movies.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <>
          <Slider trendingMovies={trendingMovies} />
          <div className="bg-gray-900 px-3 py-4 rounded-lg flex items-center justify-between">
            <div className="relative w-[250px]">
              <input
                type="text"
                placeholder="Search"
                className="w-full px-2 py-1 rounded-lg text-gray-950 placeholder:text-gray-700 focus:ring-4 focus:outline-none focus:ring-red-500 focus:border-none transition-all duration-300"
                onChange={searchMovies}
              />
              <SlMagnifier
                className="absolute bottom-1/2 right-3 translate-y-1/2 cursor-pointer"
                color="black"
              />
            </div>
            <div className="flex items-center gap-4">
              <select
                name="category"
                id="category"
                className="text-black rounded-full px-2"
                value={genre}
                onChange={searchGenre}
              >
                {allGenres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
              <FaBookmark
                size={25}
                className="cursor-pointer transition-all duration-200"
                color={bookmarkedPage ? 'red' : 'white'}
                onClick={() => setBookmarkedPage(true)}
              />
              <FaHouse
                size={25}
                className="cursor-pointer transition-all duration-200"
                color={bookmarkedPage ? 'white' : 'red'}
                onClick={() => setBookmarkedPage(false)}
              />
            </div>
          </div>
          <p className="py-4 text-lg font-medium">
            {bookmarkedPage ? 'Your bookmarked movies' : 'Top 100'}
          </p>
          {bookmarkedPage ? (
            <BookmarkedMovies />
          ) : (
            <AllMovies
              nextPage={nextPage}
              previousPage={previousPage}
              goToPage={goToPage}
              activePageIndex={activePageIndex}
              movies={movies}
              // bookmarkedMoviesIds={bookmarkedMoviesIds}
              pagesCount={pagesCount}
            />
          )}
        </>
      )}
    </div>
  )
}

export default Home

//     /*
//      moracu da uporedim all movies i bookmarkedMovies, sto znaci da oboje trebaju da budu cijeli movie sa movie.id

//      kada dodajem film, dodajem cijeli movie, kada ga micem, moram da ga nadjem u userov bookmarkedMovies [], i da vratim array bez tog filma
//      na homePageu odmah fecujem all, trending i bookmarkedMovies pa uporedim movie.id ukoliko je isti proslijedim prop true ako nije proslijedim false, ili tako nesto
//      */
