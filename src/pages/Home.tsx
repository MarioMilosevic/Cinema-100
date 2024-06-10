import { useState, useEffect } from 'react'
import {
  getDocs,
  query,
  orderBy,
  startAfter,
  endBefore,
  limit,
  limitToLast,
  startAt,
  Query,
  DocumentData,
  where,
  collection,
  getDoc
} from 'firebase/firestore'
import { useAuth } from '../hooks/useAuth'
import { FaArrowLeft, FaArrowRight, FaBookmark } from 'react-icons/fa'
import { SingleMovieType } from '../utils/types'
import { calculatePageButtons } from '../utils/helperFunctions'
import { SlMagnifier } from 'react-icons/sl'
import MovieCard from '../components/MovieCard'
import PageButton from '../components/PageButton'
import { allGenres, pageSize, field } from '../utils/constants'
import { FaHouse } from 'react-icons/fa6'

const Home = () => {
  const [movies, setMovies] = useState<SingleMovieType[]>([])
  const [firstVisible, setFirstVisible] = useState<DocumentData | null>(null)
  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null)
  const [activePageIndex, setActivePageIndex] = useState<number>(0)
  const [pagesCount, setPagesCount] = useState<number[]>([])
  const { moviesCollection, db } = useAuth()
  

  useEffect(() => {
    const fetchInitialMovies = async () => {
      const collectionRef = await getDocs(collection(db, "movies"))
      const initialQuery = query(
        moviesCollection,
        orderBy(field, 'desc'),
        limit(pageSize),
      )
      await fetchMovies(initialQuery)
      const totalPageButtons = calculatePageButtons(collectionRef.size, pageSize)
      setPagesCount(totalPageButtons)
    }
    fetchInitialMovies()
  }, [moviesCollection,db])

  const fetchMovies = async (queryRef: Query<DocumentData>) => {
    try {
      const data = await getDocs(queryRef)
      console.log(data)
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
    if (lastVisible) {
      const nextQuery = query(
        moviesCollection,
        orderBy(field, 'desc'),
        startAfter(lastVisible),
        limit(pageSize),
      )
      await fetchMovies(nextQuery)
      setActivePageIndex((prevIndex) => prevIndex + 1)
    }
  }

  const previousPage = async () => {
    if (activePageIndex === 0) return
    if (firstVisible) {
      const prevQuery = query(
        moviesCollection,
        orderBy(field, 'desc'),
        endBefore(firstVisible),
        limitToLast(pageSize),
      )
      await fetchMovies(prevQuery)
      setActivePageIndex((prevIndex) => prevIndex - 1)
    }
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

  const searchMovies = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.toLowerCase()
    if (inputValue.length > 0) {
      try {
        const searchQuery = query(moviesCollection, orderBy('title', 'desc'))
        const data = await getDocs(searchQuery)
        const filteredData = data.docs
          .map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
          .filter((doc) => doc.title.toLowerCase().includes(inputValue))
        const totalPages = calculatePageButtons(100, data.size)
        setPagesCount(totalPages)
        setMovies(filteredData)
      } catch (error) {
        console.error(error)
      }
    } else {
      const searchQuery = query(
        moviesCollection,
        orderBy(field, 'desc'),
        limit(pageSize),
      )
      const data = await getDocs(searchQuery)
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      const totalPages = calculatePageButtons(100, data.size)
      setPagesCount(totalPages)
      setMovies(filteredData)
    }
  }

  if (movies.length === 0) return null

  return (
    <div className="max-w-[1300px] mx-auto pt-20 pb-4">
      <div className="bg-gray-900 px-3 py-4 rounded-lg flex items-center justify-between">
        <div className="relative w-[250px]">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-2 py-1 rounded-lg text-gray-950 placeholder:text-gray-700 focus:ring-4 focus:outline-none focus:ring-red-500 focus:border-none transition-all duration-300"
            onChange={(e) => searchMovies(e)}
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
          >
            <option value="All">All</option>
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
