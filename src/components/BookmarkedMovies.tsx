import MovieCard from './MovieCard'
import PageButton from './PageButton'
import Menu from './Menu'
import { BookmarkedMoviesProps, SingleMovieType } from '../utils/types'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { pageSize } from '../utils/constants'
import { useState, useEffect } from 'react'
import { calculatePageButtons } from '../utils/helperFunctions'
import { db } from '../config/firebase'
import { useAppSlice } from '../hooks/useAppSlice'
import { fetchBookmarkedMovies } from '../utils/api'

const BookmarkedMovies = ({
  bookmarkedPage,
  setBookmarkedPage,
  bookmarkedMovies,
  setBookmarkedMovies,
}: BookmarkedMoviesProps) => {
  const { globalUser } = useAppSlice()

  const [activePageIndex, setActivePageIndex] = useState<number>(0)
  const [pagesCount, setPagesCount] = useState<number[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const [genre, setGenre] = useState<string>('All')
  const [currentMovies, setCurrentMovies] =
    useState<SingleMovieType[]>(bookmarkedMovies)

  // useEffect(() => {
  //   const getBookmarkedMovies = async () => {
  //     const movies = await fetchBookmarkedMovies(globalUser.id, db)
  //     const totalPages = calculatePageButtons(movies.length, pageSize)
  //     setPagesCount(totalPages)
  //     setBookmarkedMovies(movies)
  //   }
  //   getBookmarkedMovies()
  // }, [globalUser.id, setBookmarkedMovies])

  const searchGenre = (e) => {
    const searchInput = e.target.value
    setGenre(searchInput)
    filterMoviesByGenre(searchInput)
  }

  const searchMovies = () => {
    console.log('nesto')
  }

  const filterMoviesByGenre = (genre: string) => {
    // let mario = [...bookmarkedMovies]
    if (genre === 'All') {
      console.log('uslo')
      console.log(bookmarkedMovies)
      setCurrentMovies(bookmarkedMovies.slice(0, pageSize))
    } else {
      const filteredMovies = bookmarkedMovies.filter((movie) =>
        movie.genre.includes(genre),
      )
      console.log(filteredMovies)
      setCurrentMovies(filteredMovies.slice(0, pageSize))
      const totalPages = calculatePageButtons(filteredMovies.length, pageSize)
      setPagesCount(totalPages)
    }
    setActivePageIndex(0)
  }

  // const currentMovies = bookmarkedMovies.slice(
  //   activePageIndex * pageSize,
  //   (activePageIndex + 1) * pageSize,
  // )

  const nextPage = () => {
    if (activePageIndex < pagesCount.length - 1) {
      setActivePageIndex((prev) => prev + 1)
      setCurrentMovies(
        bookmarkedMovies.slice(
          activePageIndex * pageSize,
          (activePageIndex + 1) * pageSize,
        ),
      )
    }
  }

  const previousPage = () => {
    if (activePageIndex > 0) {
      setActivePageIndex((prev) => prev - 1)
      setCurrentMovies(
        bookmarkedMovies.slice(
          activePageIndex * pageSize,
          (activePageIndex - 1) * pageSize,
        ),
      )
    }
  }

  const goToPage = (pageIndex: number) => {
    setActivePageIndex(pageIndex)
  }

  return (
    <div>
      <Menu
        searchValue={searchValue}
        searchGenre={searchGenre}
        searchMovies={searchMovies}
        bookmarkedPage={bookmarkedPage}
        setBookmarkedPage={setBookmarkedPage}
        genre={genre}
      />
      {currentMovies.length > 0 ? (
        <>
          <div className="grid grid-cols-4 gap-8 py-4">
            {currentMovies.map((movie) => (
              <MovieCard key={movie.id} {...movie} isBookmarked={true} />
            ))}
          </div>
          <div className="py-8 flex justify-center items-center gap-2">
            <button
              className="px-4 py-2 rounded-lg transition-all duration-100 bg-gray-900 text-gray-300 hover:bg-gray-300 hover:text-gray-900"
              onClick={previousPage}
            >
              <FaArrowLeft />
            </button>
            {pagesCount.map((_, index) => (
              <PageButton
                key={index}
                clickHandler={() => goToPage(index)}
                isActive={activePageIndex === index ? 'true' : 'false'}
              >
                {index + 1}
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
      )}
    </div>
  )
}

export default BookmarkedMovies
