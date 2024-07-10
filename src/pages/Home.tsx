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
  // const [movies, setMovies] = useState<SingleMovieType[]>([])
  // const [trendingMovies, setTrendingMovies] = useState<SingleMovieType[]>([])
  // const [bookmarkedMovies, setBookmarkedMovies] = useState<SingleMovieType[]>(
  //   [],
  // )
  const [firstVisible, setFirstVisible] = useState<DocumentData | null>(null)
  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null)

  const [bookmarkedPage, setBookmarkedPage] = useState<boolean>(false)
  const dispatch = useDispatch()
  const { globalUser } = useUserSlice()
  const { trendingMovies } = useMoviesSlice()

  useEffect(() => {
    fetchInitialMovies()
  }, [])

  useEffect(() => {
    fetchTrendingMovies()
    const userRef = doc(db, 'users', globalUser.id)

    const unsubscribe = onSnapshot(
      userRef,
      (userDoc) => {
        if (userDoc.exists()) {
          const userData = userDoc.data()
          const bookmarkedMoviesRefs = userData.bookmarkedMovies
          dispatch(setUserMovies(bookmarkedMoviesRefs))
          // setBookmarkedMovies(bookmarkedMoviesRefs)
        }
      },
      (error) => {
        console.error('Error fetching bookmarked movies: ', error)
      },
    )

    return () => unsubscribe()
  }, [globalUser.id])

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
    // setTrendingMovies(
    //   trendingMoviesData.docs.map((doc) => ({
    //     ...(doc.data() as SingleMovieType),
    //   })),
    // )
  }

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
    // setMovies(
    //   data.docs.map((doc) => ({
    //     ...(doc.data() as SingleMovieType),
    //   })),
    // )
    setFirstVisible(data.docs[0])
    setLastVisible(data.docs[data.docs.length - 1])
  }

  return (
    <div className="max-w-[1300px] mx-auto flex flex-col min-h-screen">
      {trendingMovies.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <>
          <Slider />
          <p className="py-4 lg:text-lg font-bold text-base lg:pl-0 pl-2">
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
              fetchInitialMovies={fetchInitialMovies}
            />
          )}
        </>
      )}
    </div>
  )
}

export default Home
