import { useState, useEffect } from 'react'
import {
  getDocs,
  query,
  orderBy,
  limit,
  DocumentData,
  doc,
  onSnapshot,
} from 'firebase/firestore'
import {
  moviesCollection,
  trendingMoviesCollection,
  db,
} from '../config/firebase'
import { SingleMovieType } from '../utils/types'
import { pageSize, field } from '../utils/constants'
import { useUserSlice } from '../hooks/useUserSlice'
import { useMoviesSlice } from '../hooks/useMovies'
import { setAllMovies, setTrendingMovies } from '../redux/features/moviesSlice'
import { setUserMovies } from '../redux/features/userSlice'
import { useDispatch } from 'react-redux'
import Slider from '../components/Slider'
import LoadingSpinner from '../components/LoadingSpinner'
import AllMovies from '../components/AllMovies'
import BookmarkedMovies from '../components/BookmarkedMovies'

const Home = () => {
  const [firstVisible, setFirstVisible] = useState<DocumentData | null>(null)
  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null)

  const [bookmarkedPage, setBookmarkedPage] = useState<boolean>(false)
  const dispatch = useDispatch()
  const { globalUser } = useUserSlice()
  const { trendingMovies } = useMoviesSlice()

  useEffect(() => {
    const fetchInitialMovies = async () => {
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
      setFirstVisible(data.docs[0])
      setLastVisible(data.docs[data.docs.length - 1])
    }

    fetchInitialMovies()
  }, [dispatch])

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      const trendingMoviesQuery = query(trendingMoviesCollection)
      const trendingMoviesData = await getDocs(trendingMoviesQuery)
      dispatch(
        setTrendingMovies(
          trendingMoviesData.docs.map((doc) => ({
            ...(doc.data() as SingleMovieType),
          })),
        ),
      )
    }

    fetchTrendingMovies()

    const userRef = doc(db, 'users', globalUser.id)
    const unsubscribe = onSnapshot(
      userRef,
      (userDoc) => {
        if (userDoc.exists()) {
          const userData = userDoc.data()
          const bookmarkedMoviesRefs = userData.bookmarkedMovies
          dispatch(setUserMovies(bookmarkedMoviesRefs))
        }
      },
      (error) => {
        console.error('Error fetching bookmarked movies: ', error)
      },
    )

    return () => unsubscribe()
  }, [dispatch, globalUser.id])

  return (
    <div className="max-w-[1300px] mx-auto flex flex-col min-h-screen">
      {trendingMovies.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <>
          <Slider />
          <p className="py-4 lg:text-lg font-bold text-base lg:w-full w-[390px] lg:mx-0 mx-auto">
            {bookmarkedPage ? 'Your bookmarked movies' : 'Top 100 movies'}
          </p>
          {bookmarkedPage ? (
            <BookmarkedMovies
              bookmarkedPage={bookmarkedPage}
              setBookmarkedPage={setBookmarkedPage}
            />
          ) : (
            <AllMovies
              bookmarkedPage={bookmarkedPage}
              setBookmarkedPage={setBookmarkedPage}
              firstVisible={firstVisible}
              setFirstVisible={setFirstVisible}
              lastVisible={lastVisible}
              setLastVisible={setLastVisible}
            />
          )}
        </>
      )}
    </div>
  )
}

export default Home
