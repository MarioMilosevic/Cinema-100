import { useState, useEffect } from 'react'
import {
  getDocs,
  collection,
  query,
  orderBy,
  startAfter,
  endBefore,
  limit,
  limitToLast,
} from 'firebase/firestore'
import { useAuth } from '../hooks/useAuth'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { SingleMovieType } from '../utils/types'
import { calculatePageButtons } from '../utils/helperFunctions'
import MovieCard from '../components/MovieCard'
import PageButton from '../components/PageButton'

const Home = () => {
  const [movies, setMovies] = useState<SingleMovieType[]>([])
  const [firstVisible, setFirstVisible] = useState(null)
  const [lastVisible, setLastVisible] = useState(null)
  const [activePageIndex, setactivePageIndex] = useState<number>(0)
  const { db } = useAuth()
  const pageSize = 12
  const field = 'rating'
  console.log('red')

  const fetchMovies = async (queryRef) => {
    try {
      const data = await getDocs(queryRef)
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      if (filteredData.length > 0) {
        setFirstVisible(data.docs[0])
        setLastVisible(data.docs[data.docs.length - 1])
      }
      setMovies(filteredData)
    } catch (error) {
      console.error(error)
    }
  }

  const createQuery = (startPoint, endPoint) => {
    const moviesCollection = collection(db, 'movies')
    let q = query(
      moviesCollection,
      orderBy(field, 'desc'),
      limit(pageSize)
    )
    if (startPoint) {
      q = query(q, startAfter(startPoint))
    }
    if (endPoint) {
      q = query(q, endBefore(endPoint), limitToLast(pageSize))
    }
    return q
  }

  useEffect(() => {
    // const initialQuery = createQuery(100,12)
    const moviesCollection = collection(db, 'movies')
    const initialQuery = query(
      moviesCollection,
      orderBy(field, 'desc'),
      limit(pageSize),
    )
    fetchMovies(initialQuery)
  }, [db])

  const nextPage = () => {
    if (lastVisible) {
      const moviesCollection = collection(db, 'movies')
      const nextQuery = query(
        moviesCollection,
        orderBy(field, 'desc'),
        startAfter(lastVisible),
        limit(pageSize),
      )
      fetchMovies(nextQuery)
    }
  }

  const previousPage = () => {
    if (firstVisible) {
      const moviesCollection = collection(db, 'movies')
      const prevQuery = query(
        moviesCollection,
        orderBy(field, 'desc'),
        endBefore(firstVisible),
        limitToLast(pageSize),
      )
      fetchMovies(prevQuery)
    }
  }

/*
const funkcija = (index) => {
setActivePageIndex(index);
// 0,1,2,3,4,5,6,7,8
}

*/

  const totalPageButtons = calculatePageButtons(100, 12)
  console.log(totalPageButtons)

  if (movies.length === 0) return null

  return (
    <div className="max-w-[1300px] mx-auto">
      <div className="grid grid-cols-4 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} {...movie} />
        ))}
      </div>

      <div className="py-8 flex justify-center items-center gap-2">
        <button className='px-4 py-2 rounded-lg transition-all duration-100 bg-gray-900 text-gray-300 hover:bg-gray-300 hover:text-gray-900' onClick={previousPage}>
          <FaArrowLeft />
        </button>
        {totalPageButtons.map((el, index) => (
          <PageButton
            key={index}
            clickHandler={() => setactivePageIndex(index)}
            isActive={activePageIndex === index ? 'true' : 'false'}
          >
            {el + 1}
          </PageButton>
        ))}
         <button className='px-4 py-2 rounded-lg transition-all duration-100 bg-gray-900 text-gray-300 hover:bg-gray-300 hover:text-gray-900' onClick={nextPage}>
          <FaArrowRight />
        </button>
      </div>
    </div>
  )
}

export default Home


