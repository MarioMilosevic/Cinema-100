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
import { SingleMovieType } from '../utils/types'
import MovieCard from '../components/MovieCard'

const Home = () => {
  const [movies, setMovies] = useState<SingleMovieType[]>([])
  const [firstVisible, setFirstVisible] = useState(null)
  const [lastVisible, setLastVisible] = useState(null)
  const { db } = useAuth()
  const pageSize = 12
  const field = 'rating'

  const fetchMovies = async (queryRef) => {
    try {
      const data = await getDocs(queryRef)
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      if (filteredData.length > 0) {
        setLastVisible(data.docs[data.docs.length - 1])
        setFirstVisible(data.docs[0])
      }
      setMovies(filteredData)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
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

  const prevPage = () => {
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

  if (movies.length === 0) return null

  return (
    <div className="max-w-[1300px] mx-auto border">
      <div className="grid grid-cols-4 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      <div className="border flex justify-center gap-12">
        <button onClick={prevPage}>
          Previous
        </button>
        <button onClick={nextPage}>
          Next
        </button>
      </div>
    </div>
  )
}

export default Home
