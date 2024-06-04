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
import { calculatePageButtons } from '../utils/constants'
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

  useEffect(() => {
    const moviesCollection = collection(db, 'movies');
    const initialQuery = query(
      moviesCollection,
      orderBy(field, 'desc'),
      limit(pageSize),
    )
    fetchMovies(initialQuery)
  }, [db])

  const nextPage = () => {
    if (lastVisible) {
      console.log(lastVisible)
      console.log('uslo')
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
    console.log('prethodna')
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

  const totalPageButtons = calculatePageButtons(100, 12)
  const pageButtons = [];
  for (let i = 0; i < totalPageButtons; i++) {
    pageButtons.push(i);
  }
  console.log(pageButtons)


  if (movies.length === 0) return null

  return (
    <div className="max-w-[1300px] mx-auto">
      <div className="grid grid-cols-4 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} {...movie} />
        ))}
      </div>
      <div className="border flex justify-center items-center gap-2">
        <button className='bg-gray-800 text-gray-100 px-4 py-2 rounded-lg transition-all duration-100 hover:bg-gray-300 hover:text-gray-900'>
        <FaArrowLeft />
        </button>
        {pageButtons.map((el) => <PageButton clickHandler={() => console.log('ce ra')}>{el + 1}</PageButton>)}
        <button className='bg-gray-800 text-gray-100 px-4 py-2 rounded-lg transition-all duration-100 hover:bg-gray-300 hover:text-gray-900'>
        <FaArrowRight />
        </button>
      </div>
    </div>
  )
}

export default Home

// export const renderPageButtons = (arr, list) => {
//   list.innerHTML = "";
//   const length = arr.length;
//   const totalButtons = length / 24;
//   for (let i = 0; i < totalButtons; i++) {
//     const button = document.createElement("button");
//     button.classList.add("listBtn");
//     button.id = i + 1;
//     button.textContent = i + 1;
//     list.appendChild(button);
//   }
//   const pageBtn = document.querySelector('.listBtn')
//   pageBtn.classList.add("clickedDark", "clicked");
// };