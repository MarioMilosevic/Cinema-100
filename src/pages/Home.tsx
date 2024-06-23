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
  startAt,
  collection,
  where,
  DocumentSnapshot,
  CollectionReference,
} from 'firebase/firestore'
import { useAuth } from '../hooks/useAuth'
import { FaArrowLeft, FaArrowRight, FaBookmark } from 'react-icons/fa'
import { FaHouse } from 'react-icons/fa6'
import { SingleMovieType } from '../utils/types'
import { calculatePageButtons } from '../utils/helperFunctions'
import { SlMagnifier } from 'react-icons/sl'
import { allGenres, pageSize, field } from '../utils/constants'
import MovieCard from '../components/MovieCard'
import PageButton from '../components/PageButton'
import Slider from '../components/Slider'
import { useDebounce } from '../hooks/useDebounce'

const Home = () => {
  const [movies, setMovies] = useState<SingleMovieType[]>([])
  const [trendingMovies, setTrendingMovies] = useState<SingleMovieType[]>([])
  const [firstVisible, setFirstVisible] = useState<DocumentData | null>(null)
  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null)
  const [activePageIndex, setActivePageIndex] = useState<number>(0)
  const [pagesCount, setPagesCount] = useState<number[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const [genre, setGenre] = useState<string>('All')
  const { moviesCollection, trendingMoviesCollection, db, baseQuery } =
    useAuth()
  const debouncedSearch = useDebounce(searchValue)

  useEffect(() => {
    fetchInitialMovies()
    fetchTrendingMovies()
  }, [])

  useEffect(() => {
    filterMovies(debouncedSearch, genre)
  }, [debouncedSearch, genre])

  const fetchTrendingMovies = async () => {
    const trendingMoviesQuery = query(trendingMoviesCollection)
    const trendingMoviesData = await getDocs(trendingMoviesQuery)
    setTrendingMovies(
      trendingMoviesData.docs.map((doc) => ({
        ...(doc.data() as SingleMovieType),
        id: doc.id,
      })),
    )
  }

  const fetchInitialMovies = async () => {
    const initialQuery = query(
      moviesCollection,
      orderBy(field, 'desc'),
      limit(pageSize),
    )
    // napravim funkciju koja se zove fetchIniitalMovies
    // drugu funkciju koja pinga firebase
    // tu drugu funkciju pozovem unutar ove prve gore funckije
    // druga funkcija returna sta treba iz firebasa
    // u fetchInitial setujem stejt sa datom sto je returnana
    const moviesRef = await getDocs(collection(db, 'movies'))
    setPagesCount(calculatePageButtons(moviesRef.size, pageSize))
    await fetchMovies(initialQuery)
  }

  const fetchMovies = async (queryRef: Query<DocumentData>) => {
    const data = await getDocs(queryRef)
    setMovies(
      data.docs.map((doc) => ({
        ...(doc.data() as SingleMovieType),
        id: doc.id,
      })),
    )
    setFirstVisible(data.docs[0])
    setLastVisible(data.docs[data.docs.length - 1])
  }


  const buildSearchQuery = (
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

  const buildGenreQuery = (genre: string, baseQuery: Query<DocumentData>) => {
    return query(baseQuery, where('genre', 'array-contains', genre))
  }

  const buildPaginationQuery = async (
    pageIndex: number,
    field: string,
    pageSize: number,
    moviesCollection: CollectionReference<DocumentData>,
    lastVisible?: DocumentSnapshot<DocumentData>,
  ) => {
    if (lastVisible) {
      return query(
        moviesCollection,
        orderBy(field, 'desc'),
        startAfter(lastVisible),
        limit(pageSize),
      )
    }
    const data = await getDocs(
      query(
        moviesCollection,
        orderBy(field, 'desc'),
        limit(pageSize * (pageIndex + 1)),
      ),
    )
    return query(
      moviesCollection,
      orderBy(field, 'desc'),
      startAt(data.docs[pageIndex * pageSize]),
      limit(pageSize),
    )
  }



  const fetchAndSetMovies = async (
    queryRef: Query<DocumentData>,
    pageIndex: number,
    pageSize: number,
  ) => {
    const data = await getDocs(queryRef)
    setMovies(
      data.docs
        .map((doc) => ({ ...(doc.data() as SingleMovieType), id: doc.id }))
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
    // queryRef = buildSearchQuery(searchValue, genre, baseQuery)
    if (searchValue) {
      queryRef = buildSearchQuery(searchValue, genre, baseQuery)
        .endBefore(firstVisible)
        .limitToLast(pageSize)
    } else if (genre !== 'All') {
      queryRef = buildGenreQuery(genre, baseQuery)
        .endBefore(firstVisible)
        .limitToLast(pageSize)
    }
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
      )
    }

    await fetchMovies(queryRef)
    setActivePageIndex((prev) => prev + 1)
  }

  const searchMovies = (e: React.ChangeEvent<HTMLInputElement>) => {
    // include debounce
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

  return (
    <div className="max-w-[1300px] mx-auto pt-20 pb-4">
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
          <FaBookmark size={25} className="cursor-pointer" />
          <FaHouse size={25} className="cursor-pointer" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-8 py-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} {...movie} />
        ))}
      </div>
      <div className="py-8 flex justify-center items-center gap-2">
        <button
          className="px-4 py-2 rounded-lg transition-all duration-100 bg-gray-900 text-gray-300 hover:bg-gray-300 hover:text-gray-900"
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
          className="px-4 py-2 rounded-lg transition-all duration-100 bg-gray-900 text-gray-300 hover:bg-gray-300 hover:text-gray-900"
          onClick={nextPage}
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  )
}

export default Home
