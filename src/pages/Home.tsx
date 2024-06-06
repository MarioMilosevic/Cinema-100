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
} from 'firebase/firestore'
import { useAuth } from '../hooks/useAuth'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { SingleMovieType } from '../utils/types'
import { calculatePageButtons } from '../utils/helperFunctions'
import MovieCard from '../components/MovieCard'
import PageButton from '../components/PageButton'

const Home = () => {
  const [movies, setMovies] = useState<SingleMovieType[]>([])
  const [firstVisible, setFirstVisible] = useState<DocumentData | null>(null)
  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null)
  const [activePageIndex, setActivePageIndex] = useState<number>(0)
  const { moviesCollection } = useAuth()
  const pageSize = 12
  const field = 'rating'

  useEffect(() => {
    const fetchInitialMovies = async () => {
      const initialQuery = query(
        moviesCollection,
        orderBy(field, 'desc'),
        limit(pageSize),
      )
      await fetchMovies(initialQuery)
    }
    fetchInitialMovies()
  }, [])

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
    if (activePageIndex === totalPageButtons.length - 1) return
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

  const totalPageButtons = calculatePageButtons(100, 12)

  if (movies.length === 0) return null

  return (
    <div className="max-w-[1300px] mx-auto">
      <div className="grid grid-cols-4 gap-4">
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
        {totalPageButtons.map((el, index) => (
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
