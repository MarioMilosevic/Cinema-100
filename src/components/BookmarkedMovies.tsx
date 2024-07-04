import MovieCard from './MovieCard'
import PageButton from './PageButton'
import Menu from './Menu'
import { SingleMovieType } from '../utils/types'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { pageSize } from '../utils/constants'
import { useState, useEffect } from 'react'
import { calculatePageButtons } from '../utils/helperFunctions'
import { db } from '../config/firebase'
import { onSnapshot, doc } from 'firebase/firestore'
import { useAppSlice } from '../hooks/useAppSlice'

const BookmarkedMovies = ({
  bookmarkedPage,
  setBookmarkedPage,
}: {
  bookmarkedMovies: SingleMovieType[]
}) => {
  const { globalUser } = useAppSlice()

  useEffect(() => {
    const userRef = doc(db, 'users', globalUser.id)

    const unsubscribe = onSnapshot(
      userRef,
      (userDoc) => {
        if (userDoc.exists()) {
          const userData = userDoc.data()
          const bookmarkedMoviesRefs = userData.bookmarkedMovies
          const totalPages = calculatePageButtons(
            bookmarkedMoviesRefs.length,
            pageSize,
          )
          setPagesCount(totalPages)
          setActivePageIndex(0)
          setBookmarkedMovies(bookmarkedMoviesRefs)
          //   setMovies(bookmarkedMovies.slice(0, pageSize))
        } else {
          console.log('No such document!')
        }
      },
      (error) => {
        console.error('Error fetching bookmarked movies: ', error)
      },
    )

    return () => unsubscribe()
  }, [globalUser.id])

  const [bookmarkedMovies, setBookmarkedMovies] = useState<SingleMovieType[]>(
    [],
  )
  const [activePageIndex, setActivePageIndex] = useState<number>(0)
  const [pagesCount, setPagesCount] = useState<number[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const [genre, setGenre] = useState<string>('All')

  const nextPage = () => {
    if (activePageIndex === pagesCount.length - 1) return
    const nextPageIndex = activePageIndex + 1
    setBookmarkedMovies(
      bookmarkedMovies.slice(
        nextPageIndex * pageSize,
        (nextPageIndex + 1) * pageSize,
      ),
    )
    setActivePageIndex(nextPageIndex)
  }

  const previousPage = () => {
    if (activePageIndex === 0) return
    const prevPageIndex = activePageIndex - 1
    setBookmarkedMovies(
      bookmarkedMovies.slice(
        prevPageIndex * pageSize,
        (prevPageIndex + 1) * pageSize,
      ),
    )
    setActivePageIndex(prevPageIndex)
  }

  const goToPage = (pageIndex: number) => {
    setBookmarkedMovies(
      bookmarkedMovies.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
    )
    setActivePageIndex(pageIndex)
  }

  const searchGenre = () => {
    console.log('da trazi zanr')
  }

  const searchMovies = () => {
    console.log('da trazi filmove')
  }

  return bookmarkedMovies.length > 0 ? (
    <>
      <Menu
        searchValue={searchValue}
        searchGenre={searchGenre}
        searchMovies={searchMovies}
        bookmarkedPage={bookmarkedPage}
        setBookmarkedPage={setBookmarkedPage}
        genre={genre}
      />
      <div className="grid grid-cols-4 gap-8 py-4">
        {bookmarkedMovies.map((movie) => {
          return <MovieCard key={movie.id} {...movie} isBookmarked={true} />
        })}
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
    </>
  ) : (
    <div className="flex items-center justify-center min-h-[200px]">
      <p className="text-lg font-medium">No bookmarked movies</p>
    </div>
  )
}

export default BookmarkedMovies
