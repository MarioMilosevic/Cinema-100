import MovieCard from './MovieCard'
import PageButton from './PageButton'
import { SingleMovieType } from '../utils/types'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { pageSize } from '../utils/constants'
import { useState, useEffect } from 'react'
import { calculatePageButtons } from '../utils/helperFunctions'

const BookmarkedMovies = ({
  bookmarkedMovies,
  activePageIndex,
  setActivePageIndex,
  pagesCount,
  setPagesCount
}: {
  bookmarkedMovies: SingleMovieType[]
}) => {
  // const bookmarkedMoviesIds = bookmarkedMovies.map((movie) => movie.id)
  console.log(bookmarkedMovies)
  useEffect(() => {
    const totalPages = calculatePageButtons(bookmarkedMovies.length, pageSize)
    setPagesCount(totalPages)
    setActivePageIndex(0)
    setMovies(bookmarkedMovies.slice(0, pageSize))
  }, [bookmarkedMovies, setActivePageIndex, setPagesCount])

  const [movies, setMovies] = useState<SingleMovieType[]>([])

  const nextPage = () => {
    if (activePageIndex === pagesCount.length - 1) return
    const nextPageIndex = activePageIndex + 1
    setMovies(bookmarkedMovies.slice(nextPageIndex * pageSize,(nextPageIndex + 1) * pageSize ))
    setActivePageIndex(nextPageIndex)
  }

  console.log(movies)
  return movies.length > 0 ? (
    <>
      <div className="grid grid-cols-4 gap-8 py-4">
        {movies.map((movie) => {
          // const isBookmarked = bookmarkedMoviesIds.includes(movie.id)
          return (
            <MovieCard key={movie.id} {...movie} isBookmarked={true} />
          )
        })}
      </div>
      <div className="py-8 flex justify-center items-center gap-2">
        <button
          className="px-4 py-2 rounded-lg transition-all duration-100 bg-gray-900 text-gray-300 hover:bg-gray-300 hover:text-gray-900"
          // onClick={previousPage}
        >
          <FaArrowLeft />
        </button>
        {pagesCount.map((el, index) => (
          <PageButton
            key={index}
            // clickHandler={() => goToPage(index)}
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
