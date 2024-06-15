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
  where
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

const Home = () => {
  const [movies, setMovies] = useState<SingleMovieType[]>([])
  const [trendingMovies, setTrendingMovies] = useState<SingleMovieType[]>([])
  const [firstVisible, setFirstVisible] = useState<DocumentData | null>(null)
  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null)
  const [activePageIndex, setActivePageIndex] = useState<number>(0)
  const [pagesCount, setPagesCount] = useState<number[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const [genre, setGenre] = useState<string>('')
  const { moviesCollection, db, trendingMoviesCollection } = useAuth()
 

  useEffect(() => {
    const fetchInitialMovies = async () => {
      const moviesRef = await getDocs(collection(db, 'movies'))
      const initialQueryMovies = query(
        moviesCollection,
        orderBy(field, 'desc'),
        limit(pageSize),
      )
      await fetchMovies(initialQueryMovies)

      const totalPageButtons = calculatePageButtons(moviesRef.size, pageSize)
      setPagesCount(totalPageButtons)
    }
    fetchInitialMovies()
  }, [moviesCollection, db])

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      const trendingMoviesQuery = query(trendingMoviesCollection)

      const trendingMoviesData = await getDocs(trendingMoviesQuery)
      const filteredTrendingMovies = trendingMoviesData.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      setTrendingMovies(filteredTrendingMovies)
    }
    fetchTrendingMovies()
  }, [trendingMoviesCollection])

  const fetchMovies = async (queryRef: Query<DocumentData>) => {
    try {
      const data = await getDocs(queryRef)
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      setFirstVisible(data.docs[0])
      setLastVisible(data.docs[data.docs.length - 1])
      setMovies(filteredData)
    } catch (error) {
      console.error(error)
    }
  }

  const nextPage = async () => {
    if (activePageIndex === pagesCount.length - 1) return
    const nextQuery = query(
      moviesCollection,
      orderBy(field, 'desc'),
      startAfter(lastVisible),
      limit(pageSize),
    )
    await fetchMovies(nextQuery)
    setActivePageIndex((prevIndex) => prevIndex + 1)
  }

  const previousPage = async () => {
    if (activePageIndex === 0) return
    const prevQuery = query(
      moviesCollection,
      orderBy(field, 'desc'),
      endBefore(firstVisible),
      limitToLast(pageSize),
    )
    await fetchMovies(prevQuery)
    setActivePageIndex((prevIndex) => prevIndex - 1)
  }

  const jumpToPage = async (pageIndex: number) => {
    let queryRef = query(
      moviesCollection,
      orderBy(field, 'desc'),
      limit(pageSize * (pageIndex + 1)),
    )
    const data = await getDocs(queryRef)
    queryRef = query(
      moviesCollection,
      orderBy(field, 'desc'),
      startAt(data.docs[pageIndex * pageSize]),
      limit(pageSize),
    )
    await fetchMovies(queryRef)
    setActivePageIndex(pageIndex)
  }

  const fetchAndFilterMovies = async (searchValue: string, genre: string) => {
    try {
     
      
      const data = await getDocs(baseQuery)
      let filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))

      if (genre !== 'All' && genre) {
        filteredData = filteredData.filter((doc) => doc.genre.includes(genre))
      }

      if (searchValue) {
        filteredData = filteredData.filter((doc) =>
          doc.title.toLowerCase().includes(searchValue),
        )
      }

      const totalPages = calculatePageButtons(filteredData.length, pageSize)
      // setFirstVisible(filteredData[0])
      // setLastVisible(filteredData[filteredData.length - 1])
      setPagesCount(totalPages)
      setMovies(filteredData.slice(activePageIndex, pageSize))
    } catch (error) {
      console.error(error)
    }
  }

const searchMovies = async (e: React.ChangeEvent<HTMLInputElement>) => {
  let baseQuery = query(moviesCollection, orderBy(field, 'desc'))

  const q = query(
    baseQuery,
    where('title', '>=', e.target.value),
    where('title', '<=', e.target.value + '\uf8ff'),
  )
  const querySnapshot = await getDocs(q)
  const results = []
  querySnapshot.forEach((doc) => {
    results.push(doc.data())
  })
  console.log(results)
  setMovies(results)
  // setSearchValue(e.target.value.toLowerCase())
  // fetchAndFilterMovies(e.target.value.toLowerCase(), genre)
}


  const selectGenre = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGenre(e.target.value)
    fetchAndFilterMovies(searchValue, e.target.value)
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
            onChange={selectGenre}
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
            clickHandler={() => jumpToPage(index)}
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
