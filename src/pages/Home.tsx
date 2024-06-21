// import { useState, useEffect } from 'react'
// import {
//   getDocs,
//   query,
//   orderBy,
//   startAfter,
//   endBefore,
//   limit,
//   limitToLast,
//   Query,
//   DocumentData,
//   startAt,
//   collection,
//   where,
// } from 'firebase/firestore'
// import { useAuth } from '../hooks/useAuth'
// import { FaArrowLeft, FaArrowRight, FaBookmark } from 'react-icons/fa'
// import { FaHouse } from 'react-icons/fa6'
// import { SingleMovieType } from '../utils/types'
// import { calculatePageButtons } from '../utils/helperFunctions'
// import { SlMagnifier } from 'react-icons/sl'
// import { allGenres, pageSize, field } from '../utils/constants'
// import MovieCard from '../components/MovieCard'
// import PageButton from '../components/PageButton'
// import Slider from '../components/Slider'

// const Home = () => {
//   const [movies, setMovies] = useState<SingleMovieType[]>([])
//   const [trendingMovies, setTrendingMovies] = useState<SingleMovieType[]>([])
//   const [firstVisible, setFirstVisible] = useState<DocumentData | null>(null)
//   const [lastVisible, setLastVisible] = useState<DocumentData | null>(null)
//   const [activePageIndex, setActivePageIndex] = useState<number>(0)
//   const [pagesCount, setPagesCount] = useState<number[]>([])
//   const [searchValue, setSearchValue] = useState<string>('')
//   const [genre, setGenre] = useState<string>('All')
//   const { moviesCollection, db, trendingMoviesCollection, baseQuery } =
//     useAuth()

//   useEffect(() => {
//     fetchInitialMovies()
//   }, [])

//   useEffect(() => {
//     const fetchTrendingMovies = async () => {
//       const trendingMoviesQuery = query(trendingMoviesCollection)

//       const trendingMoviesData = await getDocs(trendingMoviesQuery)
//       const filteredTrendingMovies: SingleMovieType[] =
//         trendingMoviesData.docs.map((doc) => ({
//           ...(doc.data() as SingleMovieType),
//           id: doc.id,
//         }))
//       setTrendingMovies(filteredTrendingMovies)
//     }
//     fetchTrendingMovies()
//   }, [trendingMoviesCollection])

//   const fetchInitialMovies = async () => {
//     const initialQueryMovies = query(
//       moviesCollection,
//       orderBy(field, 'desc'),
//       limit(pageSize),
//     )
//     const moviesRef = await getDocs(collection(db, 'movies'))
//     const totalPages = calculatePageButtons(moviesRef.size, pageSize)
//     setPagesCount(totalPages)
//     await fetchMovies(initialQueryMovies)
//   }

//   const fetchMovies = async (queryRef: Query<DocumentData>) => {
//     try {
//       const data = await getDocs(queryRef)
//       const filteredData: SingleMovieType[] = data.docs.map((doc) => ({
//         ...(doc.data() as SingleMovieType),
//         id: doc.id,
//       }))
//       setFirstVisible(data.docs[0])
//       setLastVisible(data.docs[data.docs.length - 1])
//       setMovies(filteredData)
//     } catch (error) {
//       console.error(error)
//     }
//   }

//   const goToPage = async (pageIndex: number) => {
//     let queryRef
//     let data
//     let filteredData: SingleMovieType[] = []

//     if (searchValue) {
//       if (genre !== 'All') {
//         queryRef = query(
//           baseQuery,
//           where('title', '>=', searchValue),
//           where('title', '<=', searchValue + '\uf8ff'),
//           where('genre', 'array-contains', genre),
//         )
//       } else {
//         queryRef = query(
//           baseQuery,
//           where('title', '>=', searchValue),
//           where('title', '<=', searchValue + '\uf8ff'),
//         )
//       }
//     } else if (genre !== 'All') {
//       queryRef = query(baseQuery, where('genre', 'array-contains', genre))
//     } else {
//       queryRef = query(
//         moviesCollection,
//         orderBy(field, 'desc'),
//         limit(pageSize * (pageIndex + 1)),
//       )
//       data = await getDocs(queryRef)
//       queryRef = query(
//         moviesCollection,
//         orderBy(field, 'desc'),
//         startAt(data.docs[pageIndex * pageSize]),
//         limit(pageSize),
//       )
//       await fetchMovies(queryRef)
//       setActivePageIndex(pageIndex)
//       return
//     }

//     data = await getDocs(queryRef)
//     filteredData = data.docs.map((doc) => ({
//       ...(doc.data() as SingleMovieType),
//       id: doc.id,
//     }))

//     const totalPages = calculatePageButtons(filteredData.length, pageSize)
//     const startIndex = pageIndex * pageSize
//     const endIndex = startIndex + pageSize

//     setMovies(filteredData.slice(startIndex, endIndex))
//     setPagesCount(totalPages)
//     setActivePageIndex(pageIndex)
//   }

//   const previousPage = async () => {
//     if (activePageIndex === 0) return

//     let queryRef

//     if (searchValue) {
//       if (genre !== 'All') {
//         queryRef = query(
//           baseQuery,
//           where('title', '>=', searchValue),
//           where('title', '<=', searchValue + '\uf8ff'),
//           where('genre', 'array-contains', genre),
//         )
//       } else {
//         queryRef = query(
//           baseQuery,
//           where('title', '>=', searchValue),
//           where('title', '<=', searchValue + '\uf8ff'),
//         )
//       }
//     } else if (genre !== 'All') {
//       queryRef = query(baseQuery, where('genre', 'array-contains', genre))
//     } else {
//       queryRef = query(
//         baseQuery,
//         endBefore(firstVisible),
//         limitToLast(pageSize),
//       )
//       await fetchMovies(queryRef)
//       setActivePageIndex((prevIndex) => prevIndex - 1)
//       return
//     }

//     const data = await getDocs(queryRef)
//     const filteredData: SingleMovieType[] = data.docs.map((doc) => ({
//       ...(doc.data() as SingleMovieType),
//       id: doc.id,
//     }))

//     const totalPages = calculatePageButtons(filteredData.length, pageSize)

//     if (filteredData.length > pageSize) {
//       const startIndex = (activePageIndex - 1) * pageSize
//       const endIndex = activePageIndex * pageSize
//       setMovies(filteredData.slice(startIndex, endIndex))
//     } else {
//       setMovies(filteredData)
//     }

//     setActivePageIndex((prev) => prev - 1)
//     setPagesCount(totalPages)
//   }

//   const nextPage = async () => {
//     if (activePageIndex === pagesCount.length - 1) return

//     let queryRef

//     if (searchValue) {
//       if (genre !== 'All') {
//         queryRef = query(
//           baseQuery,
//           where('title', '>=', searchValue),
//           where('title', '<=', searchValue + '\uf8ff'),
//           where('genre', 'array-contains', genre),
//         )
//       } else {
//         queryRef = query(
//           baseQuery,
//           where('title', '>=', searchValue),
//           where('title', '<=', searchValue + '\uf8ff'),
//         )
//       }
//     } else if (genre !== 'All') {
//       queryRef = query(baseQuery, where('genre', 'array-contains', genre))
//     } else {
//       queryRef = query(baseQuery, startAfter(lastVisible), limit(pageSize))
//       await fetchMovies(queryRef)
//       setActivePageIndex((prevIndex) => prevIndex + 1)
//       return
//     }

//     const data = await getDocs(queryRef)
//     const filteredData: SingleMovieType[] = data.docs.map((doc) => ({
//       ...(doc.data() as SingleMovieType),
//       id: doc.id,
//     }))

//     const totalPages = calculatePageButtons(filteredData.length, pageSize)

//     if (filteredData.length > pageSize) {
//       const startIndex = (activePageIndex + 1) * pageSize
//       const endIndex = (activePageIndex + 2) * pageSize
//       setMovies(filteredData.slice(startIndex, endIndex))
//     } else {
//       setMovies(filteredData)
//     }

//     setActivePageIndex((prev) => prev + 1)
//     setPagesCount(totalPages)
//   }

//   const searchMovies = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const searchInput = e.target.value.toLowerCase()
//     setSearchValue(searchInput)
//     filterMovies(searchInput, genre)
//   }

//   const searchGenre = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedGenre = e.target.value
//     setGenre(selectedGenre)
//     filterMovies(searchValue, selectedGenre)
//   }

//   const filterMovies = async (searchInput: string, selectedGenre: string) => {
//     let searchQuery: Query<DocumentData> = baseQuery
//     if (searchInput && selectedGenre !== 'All') {
//       searchQuery = query(
//         baseQuery,
//         where('title', '>=', searchInput),
//         where('title', '<=', searchInput + '\uf8ff'),
//         where('genre', 'array-contains', selectedGenre),
//       )
//     } else if (searchInput && selectedGenre === 'All') {
//       searchQuery = query(
//         baseQuery,
//         where('title', '>=', searchInput),
//         where('title', '<=', searchInput + '\uf8ff'),
//       )
//     } else if (!searchInput && selectedGenre !== 'All') {
//       searchQuery = query(
//         baseQuery,
//         where('genre', 'array-contains', selectedGenre),
//       )
//     } else if (searchInput === '' && selectedGenre === 'All') {
//       fetchInitialMovies()
//       return
//     }
//     const data = await getDocs(searchQuery)
//     const filteredData: SingleMovieType[] = data.docs.map((doc) => ({
//       ...(doc.data() as SingleMovieType),
//       id: doc.id,
//     }))

//     if (filteredData.length > 12) {
//       const totalPages = calculatePageButtons(filteredData.length, pageSize)
//       setFirstVisible(data.docs[0])
//       setLastVisible(data.docs[11])
//       setMovies(filteredData.slice(0, 12))
//       setActivePageIndex(0)
//       setPagesCount(totalPages)
//     } else {
//       setFirstVisible(data.docs[0])
//       setLastVisible(data.docs[data.docs.length - 1])
//       setMovies(filteredData)
//       setActivePageIndex(0)
//       setPagesCount([0])
//     }
//   }

//   return (
//     <div className="max-w-[1300px] mx-auto pt-20 pb-4">
//       <Slider trendingMovies={trendingMovies} />
//       <div className="bg-gray-900 px-3 py-4 rounded-lg flex items-center justify-between">
//         <div className="relative w-[250px]">
//           <input
//             type="text"
//             placeholder="Search"
//             className="w-full px-2 py-1 rounded-lg text-gray-950 placeholder:text-gray-700 focus:ring-4 focus:outline-none focus:ring-red-500 focus:border-none transition-all duration-300"
//             onChange={searchMovies}
//           />
//           <SlMagnifier
//             className="absolute bottom-1/2 right-3 translate-y-1/2 cursor-pointer"
//             color="black"
//           />
//         </div>

//         <div className="flex items-center gap-4">
//           <select
//             name="category"
//             id="category"
//             className="text-black rounded-full px-2"
//             value={genre}
//             onChange={searchGenre}
//           >
//             {allGenres.map((genre) => (
//               <option key={genre} value={genre}>
//                 {genre}
//               </option>
//             ))}
//           </select>
//           <FaBookmark size={25} className="cursor-pointer" />
//           <FaHouse size={25} className="cursor-pointer" />
//         </div>
//       </div>

//       <div className="grid grid-cols-4 gap-8 py-4">
//         {movies.map((movie) => (
//           <MovieCard key={movie.id} {...movie} />
//         ))}
//       </div>

//       <div className="py-8 flex justify-center items-center gap-2">
//         <button
//           className="px-4 py-2 rounded-lg transition-all duration-100 bg-gray-900 text-gray-300 hover:bg-gray-300 hover:text-gray-900"
//           onClick={previousPage}
//         >
//           <FaArrowLeft />
//         </button>
//         {pagesCount.map((el, index) => (
//           <PageButton
//             key={index}
//             clickHandler={() => goToPage(index)}
//             isActive={activePageIndex === index ? 'true' : 'false'}
//           >
//             {el + 1}
//           </PageButton>
//         ))}
//         <button
//           className="px-4 py-2 rounded-lg transition-all duration-100 bg-gray-900 text-gray-300 hover:bg-gray-300 hover:text-gray-900"
//           onClick={nextPage}
//         >
//           <FaArrowRight />
//         </button>
//       </div>
//     </div>
//   )
// }

// export default Home

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
  const { moviesCollection, db, trendingMoviesCollection, baseQuery } =
    useAuth()

  useEffect(() => {
    fetchInitialMovies()
    fetchTrendingMovies()
  }, [])

  const fetchTrendingMovies = async () => {
    const trendingMoviesQuery = query(trendingMoviesCollection)
    const trendingMoviesData = await getDocs(trendingMoviesQuery)
    setTrendingMovies(
      trendingMoviesData.docs.map((doc) => ({
        ...(doc.data() as SingleMovieType),
        id: doc.id,
      })),
    )
  }

  const fetchInitialMovies = async () => {
    const initialQuery = query(
      moviesCollection,
      orderBy(field, 'desc'),
      limit(pageSize),
    )
    const moviesRef = await getDocs(collection(db, 'movies'))
    setPagesCount(calculatePageButtons(moviesRef.size, pageSize))
    await fetchMovies(initialQuery)
  }

  const fetchMovies = async (queryRef: Query<DocumentData>) => {
    const data = await getDocs(queryRef)
    setMovies(
      data.docs.map((doc) => ({
        ...(doc.data() as SingleMovieType),
        id: doc.id,
      })),
    )
    setFirstVisible(data.docs[0])
    setLastVisible(data.docs[data.docs.length - 1])
  }

  const goToPage = async (pageIndex: number) => {
    let queryRef: Query<DocumentData>
    if (searchValue) {
      queryRef =
        genre !== 'All'
          ? query(
              baseQuery,
              where('title', '>=', searchValue),
              where('title', '<=', searchValue + '\uf8ff'),
              where('genre', 'array-contains', genre),
            )
          : query(
              baseQuery,
              where('title', '>=', searchValue),
              where('title', '<=', searchValue + '\uf8ff'),
            )
    } else if (genre !== 'All') {
      queryRef = query(baseQuery, where('genre', 'array-contains', genre))
    } else {
      const data = await getDocs(
        query(
          moviesCollection,
          orderBy(field, 'desc'),
          limit(pageSize * (pageIndex + 1)),
        ),
      )
      queryRef = query(
        moviesCollection,
        orderBy(field, 'desc'),
        startAt(data.docs[pageIndex * pageSize]),
        limit(pageSize),
      )
      await fetchMovies(queryRef)
      setActivePageIndex(pageIndex)
      return
    }
    const data = await getDocs(queryRef)
    setMovies(
      data.docs
        .map((doc) => ({ ...(doc.data() as SingleMovieType), id: doc.id }))
        .slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
    )
    setPagesCount(calculatePageButtons(data.size, pageSize))
    setActivePageIndex(pageIndex)
  }

  const previousPage = async () => {
    if (activePageIndex === 0) return
    let queryRef: Query<DocumentData>
    if (searchValue) {
      queryRef =
        genre !== 'All'
          ? query(
              baseQuery,
              where('title', '>=', searchValue),
              where('title', '<=', searchValue + '\uf8ff'),
              where('genre', 'array-contains', genre),
              endBefore(firstVisible),
              limitToLast(pageSize),
            )
          : query(
              baseQuery,
              where('title', '>=', searchValue),
              where('title', '<=', searchValue + '\uf8ff'),
              endBefore(firstVisible),
              limitToLast(pageSize),
            )
    } else if (genre !== 'All') {
      queryRef = query(
        baseQuery,
        where('genre', 'array-contains', genre),
        endBefore(firstVisible),
        limitToLast(pageSize),
      )
    } else {
      queryRef = query(
        baseQuery,
        endBefore(firstVisible),
        limitToLast(pageSize),
      )
    }
    await fetchMovies(queryRef)
    setActivePageIndex((prev) => prev - 1)
  }

  const nextPage = async () => {
    if (activePageIndex === pagesCount.length - 1) return
    let queryRef: Query<DocumentData>
    if (searchValue) {
      queryRef =
        genre !== 'All'
          ? query(
              baseQuery,
              where('title', '>=', searchValue),
              where('title', '<=', searchValue + '\uf8ff'),
              where('genre', 'array-contains', genre),
              startAfter(lastVisible),
              limit(pageSize),
            )
          : query(
              baseQuery,
              where('title', '>=', searchValue),
              where('title', '<=', searchValue + '\uf8ff'),
              startAfter(lastVisible),
              limit(pageSize),
            )
    } else if (genre !== 'All') {
      queryRef = query(
        baseQuery,
        where('genre', 'array-contains', genre),
        startAfter(lastVisible),
        limit(pageSize),
      )
    } else {
      queryRef = query(baseQuery, startAfter(lastVisible), limit(pageSize))
    }
    await fetchMovies(queryRef)
    setActivePageIndex((prev) => prev + 1)
  }

  const searchMovies = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchInput = e.target.value.toLowerCase()
    setSearchValue(searchInput)
    filterMovies(searchInput, genre)
  }

  const searchGenre = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGenre = e.target.value
    setGenre(selectedGenre)
    filterMovies(searchValue, selectedGenre)
  }

  const filterMovies = async (searchInput: string, selectedGenre: string) => {
    let searchQuery: Query<DocumentData> = baseQuery
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
      searchQuery = query(
        baseQuery,
        where('genre', 'array-contains', selectedGenre),
      )
    } else {
      fetchInitialMovies()
      return
    }
    const data = await getDocs(searchQuery)
    const filteredData = data.docs.map((doc) => ({
      ...(doc.data() as SingleMovieType),
      id: doc.id,
    }))
    setMovies(filteredData.slice(0, pageSize))
    setFirstVisible(data.docs[0])
    setLastVisible(data.docs[Math.min(pageSize - 1, data.docs.length - 1)])
    setPagesCount(calculatePageButtons(filteredData.length, pageSize))
    setActivePageIndex(0)
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
            clickHandler={() => goToPage(index)}
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
