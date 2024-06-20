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
  doc,
  getDoc,
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
  const [genre, setGenre] = useState<string>('All')
  const { moviesCollection, db, trendingMoviesCollection } = useAuth()
  let searchQuery

  useEffect(() => {
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

  const fetchInitialMovies = async () => {
    const initialQueryMovies = query(
      moviesCollection,
      orderBy(field, 'desc'),
      limit(pageSize),
    )
    await fetchMovies(initialQueryMovies)
  }

  const fetchMovies = async (queryRef: Query<DocumentData>) => {
    try {
      const moviesRef = await getDocs(collection(db, 'movies'))
      const data = await getDocs(queryRef)
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      const totalPages = calculatePageButtons(moviesRef.size, pageSize)
      setPagesCount(totalPages)
      setFirstVisible(data.docs[0])
      setLastVisible(data.docs[data.docs.length - 1])
      setMovies(filteredData)
    } catch (error) {
      console.error(error)
    }
  }

  const jumpToPage = async (pageIndex: number) => {
    let queryRef
    const baseQuery = query(moviesCollection, orderBy(field, 'desc'))

    if (searchValue && genre !== 'All') {
      console.log('imam search imam genre')
      const q = query(
        baseQuery,
        where('title', '>=', searchValue),
        where('title', '<=', searchValue + '\uf8ff'),
        where('genre', 'array-contains', genre),
      )
      const data = await getDocs(q)
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      const totalPages = calculatePageButtons(filteredData.length, pageSize)
      const startIndex = pageIndex * pageSize
      const endIndex = startIndex + pageSize
      setMovies(filteredData.slice(startIndex, endIndex))
      setPagesCount(totalPages)
      setActivePageIndex(pageIndex)
    } else if (searchValue && genre === 'All') {
      console.log('imam search nemam genre')
      const q = query(
        baseQuery,
        where('title', '>=', searchValue),
        where('title', '<=', searchValue + '\uf8ff'),
      )
      const data = await getDocs(q)
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      const totalPages = calculatePageButtons(filteredData.length, pageSize)
      const startIndex = pageIndex * pageSize
      const endIndex = startIndex + pageSize
      setMovies(filteredData.slice(startIndex, endIndex))
      setPagesCount(totalPages)
      setActivePageIndex(pageIndex)
    } else if (!searchValue && genre !== 'All') {
      ////////////////////////////////////////////////////////////////////////////////////////////////////
      console.log('nemam search nemam genre')
      console.log('testiram')
      queryRef = query(
        baseQuery,
        where('genre', 'array-contains', genre),
        // limit(pageSize * (pageIndex + 1)),
      )
      const data = await getDocs(queryRef)
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      const totalPages = calculatePageButtons(filteredData.length, pageSize)
      const startIndex = pageIndex * pageSize
      const endIndex = startIndex + pageSize
      setMovies(filteredData.slice(startIndex, endIndex))
      setPagesCount(totalPages) // Adjust as needed for your page count calculation
      setActivePageIndex(pageIndex)
    } else {
      queryRef = query(
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
  }

  // const previousPage = async () => {
  //   if (activePageIndex === 0) return
  //   const baseQuery = query(moviesCollection, orderBy(field, 'desc'))

  //   if (searchValue && genre !== 'All') {
  //     const q = query(
  //       baseQuery,
  //       where('title', '>=', searchValue),
  //       where('title', '<=', searchValue + '\uf8ff'),
  //       where('genre', 'array-contains', genre),
  //     )
  //     const data = await getDocs(q)
  //     const filteredData = data.docs.map((doc) => ({
  //       ...doc.data(),
  //       id: doc.id,
  //     }))
  //     const totalPages = calculatePageButtons(filteredData.length, pageSize)
  //     if (filteredData.length > pageSize) {
  //       const startIndex = (activePageIndex - 1) * pageSize
  //       const endIndex = activePageIndex * pageSize
  //       setActivePageIndex((prev) => prev - 1)
  //       setMovies(filteredData.slice(startIndex, endIndex))
  //       setPagesCount(totalPages)
  //     } else {
  //       setFirstVisible(data.docs[0])
  //       setLastVisible(data.docs[data.docs.length - 1])
  //       setMovies(filteredData)
  //       setActivePageIndex(0)
  //       setPagesCount(1)
  //     }
  //   } else if (searchValue && genre === 'All') {
  //     const q = query(
  //       baseQuery,
  //       where('title', '>=', searchValue),
  //       where('title', '<=', searchValue + '\uf8ff'),
  //     )
  //     const data = await getDocs(q)
  //     const filteredData = data.docs.map((doc) => ({
  //       ...doc.data(),
  //       id: doc.id,
  //     }))
  //     const totalPages = calculatePageButtons(filteredData.length, pageSize)
  //     if (filteredData.length > pageSize) {
  //       const startIndex = (activePageIndex - 1) * pageSize
  //       const endIndex = activePageIndex * pageSize
  //       setActivePageIndex((prev) => prev - 1)
  //       setMovies(filteredData.slice(startIndex, endIndex))
  //       setPagesCount(totalPages)
  //     } else {
  //       setFirstVisible(data.docs[0])
  //       setLastVisible(data.docs[data.docs.length - 1])
  //       setMovies(filteredData)
  //       setActivePageIndex(0)
  //       setPagesCount([0])
  //     }
  //   } else if (!searchValue && genre !== 'All') {
  //     const prevQuery = query(
  //       baseQuery,
  //       where('genre', 'array-contains', genre),
  //       endBefore(firstVisible),
  //       limitToLast(pageSize),
  //     )
  //     await fetchMovies(prevQuery)
  //     setActivePageIndex((prevIndex) => prevIndex - 1)
  //   } else {
  //     const prevQuery = query(
  //       moviesCollection,
  //       orderBy(field, 'desc'),
  //       endBefore(firstVisible),
  //       limitToLast(pageSize),
  //     )
  //     await fetchMovies(prevQuery)
  //     setActivePageIndex((prevIndex) => prevIndex - 1)
  //   }
  // }

  const previousPage = async () => {
    if (activePageIndex === 0) return
    const baseQuery = query(moviesCollection, orderBy(field, 'desc'))
    let q

    if (searchValue && genre !== 'All') {
      q = query(
        baseQuery,
        where('title', '>=', searchValue),
        where('title', '<=', searchValue + '\uf8ff'),
        where('genre', 'array-contains', genre),
      )
    } else if (searchValue && genre === 'All') {
      q = query(
        baseQuery,
        where('title', '>=', searchValue),
        where('title', '<=', searchValue + '\uf8ff'),
      )
    } else if (!searchValue && genre !== 'All') {
      console.log('testiram')
      q = query(
        baseQuery,
        where('genre', 'array-contains', genre),
        endBefore(firstVisible),
        limitToLast(pageSize),
      )
    } else {
      q = query(baseQuery, endBefore(firstVisible), limitToLast(pageSize))
      await fetchMovies(q)
      setActivePageIndex((prevIndex) => prevIndex - 1)
      return
    }

    const data = await getDocs(q)
    const filteredData = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }))
    console.log(filteredData)
    // const totalPages = calculatePageButtons(filteredData.length, pageSize)

    if (filteredData.length > pageSize) {
      const startIndex = (activePageIndex - 1) * pageSize
      const endIndex = activePageIndex * pageSize
      setActivePageIndex((prev) => prev - 1)
      setMovies(filteredData.slice(startIndex, endIndex))
      // setPagesCount(totalPages)
    } else {
      setFirstVisible(data.docs[0])
      setLastVisible(data.docs[data.docs.length - 1])
      setMovies(filteredData)
      setActivePageIndex(0)
      setPagesCount([0])
    }
  }

  const nextPage = async () => {
    if (activePageIndex === pagesCount.length - 1) return
    const baseQuery = query(moviesCollection, orderBy(field, 'desc'))
    let q
    if (searchValue && genre !== 'All') {
      q = query(
        baseQuery,
        where('title', '>=', searchValue),
        where('title', '<=', searchValue + '\uf8ff'),
        where('genre', 'array-contains', genre),
      )
    } else if (searchValue && genre === 'All') {
      console.log('imam search zanr je ALL')
      q = query(
        baseQuery,
        where('title', '>=', searchValue),
        where('title', '<=', searchValue + '\uf8ff'),
      )
    } else if (!searchValue && genre !== 'All') {
      console.log('testiram')
      q = query(baseQuery, where('genre', 'array-contains', genre))
    } else {
      q = query(baseQuery, startAfter(lastVisible))
      await fetchMovies(q)
      setActivePageIndex((prevIndex) => prevIndex + 1)
      return
    }

    const data = await getDocs(q)
    const filteredData = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }))
    console.log(filteredData)
    // const totalPages = calculatePageButtons(filteredData.length, pageSize)

    if (filteredData.length > pageSize) {
      const startIndex = (activePageIndex + 1) * pageSize
      const endIndex = (activePageIndex + 2) * pageSize
      setActivePageIndex((prev) => prev + 1)
      setMovies(filteredData.slice(startIndex, endIndex))
      // setPagesCount(totalPages)
    } else {
      setFirstVisible(data.docs[0])
      setLastVisible(data.docs[data.docs.length - 1])
      setMovies(filteredData)
      setActivePageIndex(0)
      setPagesCount([0])
    }
  }

  // else if (searchValue && genre === 'All') {
  //   const q = query(
  //     baseQuery,
  //     where('title', '>=', searchValue),
  //     where('title', '<=', searchValue + '\uf8ff'),
  //   )
  //   const data = await getDocs(q)
  //   const filteredData = data.docs.map((doc) => ({
  //     ...doc.data(),
  //     id: doc.id,
  //   }))
  //   const totalPages = calculatePageButtons(filteredData.length, pageSize)
  //   if (filteredData.length > pageSize) {
  //     const startIndex = (activePageIndex + 1) * pageSize
  //     const endIndex = (activePageIndex + 2) * pageSize
  //     setActivePageIndex((prev) => prev + 1)
  //     setMovies(filteredData.slice(startIndex, endIndex))
  //     setPagesCount(totalPages)
  //   } else {
  //     setFirstVisible(data.docs[0])
  //     setLastVisible(data.docs[data.docs.length - 1])
  //     setMovies(filteredData)
  //     setActivePageIndex(0)
  //     setPagesCount([0])
  //   }
  // } else if (!searchValue && genre !== 'All') {
  //   ////////////////////////////////////////////////////////////////////////////////////////////////////////
  //   console.log('testiram')
  //   const nextQuery = query(
  //     baseQuery,
  //     where('genre', 'array-contains', genre),
  //     startAfter(lastVisible),
  //     limit(pageSize),
  //   )
  //   await fetchMovies(nextQuery)
  //   setActivePageIndex((prevIndex) => prevIndex + 1)
  // }

  /*
  const jumpToPage = async (pageIndex: number) => {
    let queryRef
    if (searchValue) {
      const baseQuery = query(moviesCollection, orderBy(field, 'desc'))
      const q = query(
        baseQuery,
        where('title', '>=', searchValue),
        where('title', '<=', searchValue + '\uf8ff'),
      )
      const data = await getDocs(q)
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      const totalPages = calculatePageButtons(filteredData.length, pageSize)
      const startIndex = pageIndex * pageSize
      const endIndex = startIndex + pageSize
      setMovies(filteredData.slice(startIndex, endIndex))
      setPagesCount(totalPages)
      setActivePageIndex(pageIndex)
    } else {
      queryRef = query(
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
  }

  const previousPage = async () => {
    if (activePageIndex === 0) return
    if (searchValue) {
      const baseQuery = query(moviesCollection, orderBy(field, 'desc'))
      const q = query(
        baseQuery,
        where('title', '>=', searchValue),
        where('title', '<=', searchValue + '\uf8ff'),
      )

      const data = await getDocs(q)
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))

      const totalPages = calculatePageButtons(filteredData.length, pageSize)
      if (filteredData.length > pageSize) {
        const startIndex = (activePageIndex - 1) * pageSize
        const endIndex = activePageIndex * pageSize
        setActivePageIndex((prev) => prev - 1)
        setMovies(filteredData.slice(startIndex, endIndex))
        setPagesCount(totalPages)
      } else {
        setFirstVisible(data.docs[0])
        setLastVisible(data.docs[data.docs.length - 1])
        setMovies(filteredData)
        setActivePageIndex(0)
        setPagesCount(1)
      }
    } else {
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

  const nextPage = async () => {
    if (activePageIndex === pagesCount.length - 1) return
    if (searchValue) {
      {
        const baseQuery = query(moviesCollection, orderBy(field, 'desc'))
        const q = query(
          baseQuery,
          where('title', '>=', searchValue),
          where('title', '<=', searchValue + '\uf8ff'),
        )
        const data = await getDocs(q)
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
        const totalPages = calculatePageButtons(filteredData.length, pageSize)
        if (filteredData.length > pageSize) {
          const startIndex = (activePageIndex + 1) * pageSize
          const endIndex = (activePageIndex + 2) * pageSize
          setActivePageIndex((prev) => prev + 1)
          setMovies(filteredData.slice(startIndex, endIndex)) // ne hvata poslednji index
          setPagesCount(totalPages)
        } else {
          setFirstVisible(data.docs[0])
          setLastVisible(data.docs[data.docs.length - 1])
          setMovies(filteredData)
          setActivePageIndex(0)
          setPagesCount(1)
        }
      }
    } else {
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
  */

  // ova ispod je dobra

  // const searchMovies = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const searchInput = e.target.value.toLowerCase()
  //   setSearchValue(searchInput)

  //   if (searchInput) {
  //     const baseQuery = query(moviesCollection, orderBy(field, 'desc'))
  //     const q = query(
  //       baseQuery,
  //       where('title', '>=', searchInput),
  //       where('title', '<=', searchInput + '\uf8ff'),
  //     )
  //     const data = await getDocs(q)
  //     const filteredData = data.docs.map((doc) => ({
  //       ...doc.data(),
  //       id: doc.id,
  //     }))
  //     const totalPages = calculatePageButtons(filteredData.length, pageSize)
  //     if (filteredData.length > 12) {
  //       setFirstVisible(data.docs[0])
  //       setLastVisible(data.docs[11])
  //       setMovies(filteredData.slice(0, 12))
  //     } else {
  //       setFirstVisible(data.docs[0])
  //       setLastVisible(data.docs[data.docs.length - 1])
  //       setMovies(filteredData)
  //     }
  //     setPagesCount(totalPages)
  //     setActivePageIndex(0)
  //   } else {
  //     fetchInitialMovies()
  //   }
  // }
  const searchMovies = (e) => {
    const searchInput = e.target.value.toLowerCase()
    setSearchValue(searchInput)
    filterMovies(searchInput, genre)
  }

  const searchGenre = (e) => {
    const selectedGenre = e.target.value
    setGenre(selectedGenre)
    filterMovies(searchValue, selectedGenre)
  }

  const filterMovies = async (searchInput: string, selectedGenre: string) => {
    console.log(searchInput, selectedGenre)
    const baseQuery = query(moviesCollection, orderBy(field, 'desc'))
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
      console.log('test')
      searchQuery = query(
        baseQuery,
        where('genre', 'array-contains', selectedGenre),
      )
    } else if (searchInput === '' && selectedGenre === 'All') {
      fetchInitialMovies()
      return
    }
    const data = await getDocs(searchQuery)
    const filteredData = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }))
    console.log(filteredData)

    if (filteredData.length > 12) {
      console.log('duze od 12')
      const totalPages = calculatePageButtons(filteredData.length, pageSize)
      console.log(filteredData.length, pageSize)
      console.log(totalPages)
      setFirstVisible(data.docs[0])
      setLastVisible(data.docs[11])
      setMovies(filteredData.slice(0, 12))
      setActivePageIndex(0)
      setPagesCount(totalPages)
    } else {
      setFirstVisible(data.docs[0])
      setLastVisible(data.docs[data.docs.length - 1])
      setMovies(filteredData)
      setActivePageIndex(0)
      setPagesCount([0])
    }
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
            clickHandler={() => jumpToPage(index)}
            isActive={activePageIndex === index ? 'true' : 'false'}
          >
            {el + 1}
          </PageButton>
        ))}
        <button
          className="px-4 py-2 rounded-lg transition-all duration-100 bg-gray-900 text-gray-300 hover:bg-gray-300 hover:text-gray-900"
          onClick={() => nextPage(activePageIndex)}
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  )
}

export default Home
