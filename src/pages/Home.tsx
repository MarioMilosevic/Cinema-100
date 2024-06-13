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
  where,
  collection,
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

  const { moviesCollection, db, trendingMoviesCollection } = useAuth()

  useEffect(() => {
    const fetchInitialMovies = async () => {
      const moviesRef = await getDocs(collection(db, 'movies'))
      const trendingMoviesRef = await getDocs(collection(db, "trending_movies"))
      const initialQueryMovies = query(
        moviesCollection,
        orderBy(field, 'desc'),
        limit(pageSize),
      )

      const trendingMoviesQuery = query(
        trendingMoviesCollection
      )
      await fetchMovies(initialQueryMovies)

      const trendingMoviesData = await getDocs(trendingMoviesQuery)
       const filteredTrendingMovies = trendingMoviesData.docs.map((doc) => ({
         ...doc.data(),
         id: doc.id,
       }))
      console.log(filteredTrendingMovies)
      setTrendingMovies(filteredTrendingMovies)
      const totalPageButtons = calculatePageButtons(
        moviesRef.size,
        pageSize,
      )
      setPagesCount(totalPageButtons)
    }
    fetchInitialMovies()
  }, [moviesCollection, db])

  const fetchMovies = async (queryRef: Query<DocumentData>) => {
    try {
      const data = await getDocs(queryRef)
      // vrati querySnapshot koji ima duzinu [12]
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

  const searchMovies = async (e: React.ChangeEvent<HTMLInputElement>) => {
    /*
    da ubacim searchValue u stejt, na svaki taj onChange da uzmem sve iz baze, pa filterujem i renderujem
    u next i previous da kazem if(searchValue !== "") da radi sto je radilo iz cijele baze to, 
    else da uzme sve iz baze,
     filteruje na osnovu slova, 
     izracuna koliko ih ima, odredi broj stranica,
     i nekako prikaze nzm bas kako
    */
    const inputValue = e.target.value.toLowerCase()
    if (inputValue.length > 0) {
      try {
        const searchQuery = query(moviesCollection, orderBy('title', 'desc'))
        await fetchMovies(searchQuery)
        const data = await getDocs(searchQuery)
        const filteredData = data.docs
          .map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
          .filter((doc) => doc.title.toLowerCase().includes(inputValue))
        const totalPages = calculatePageButtons(filteredData.length, pageSize)
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
      console.log(filteredData)
      const totalPages = calculatePageButtons(100, data.size)
      setPagesCount(totalPages)
      setMovies(filteredData)
    }
  }

  // const searchMovies = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const target = e.target.value
  //   const searchQuery = query(moviesCollection, where('title', '==', target))
  //   const data = await getDocs(searchQuery)
  //   const filteredData = data.docs.map((doc) => ({
  //     ...doc.data(),
  //     id: doc.id,
  //   }))
  //   if (filteredData.length > 0) {
  //     setMovies(filteredData)
  //   }
  // }

  const selectGenre = async (e) => {
    const genreQuery = query(
      moviesCollection,
      where('genre', 'array-contains', e.target.value),
    )

    const querySnapshot = await getDocs(genreQuery)
    const filteredData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    setMovies(filteredData)
  }

  if (movies.length === 0 || trendingMovies.length === 0) return null

  return (
    <div className="max-w-[1300px] mx-auto pt-20 pb-4">
      <Slider trendingMovies={trendingMovies}/>
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
