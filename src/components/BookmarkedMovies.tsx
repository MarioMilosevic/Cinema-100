import MovieCard from './MovieCard'
import { SingleMovieType } from '../utils/types'
import PageButton from './PageButton'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'

const BookmarkedMovies = ({
  bookmarkedMovies,
  previousPage,
  nextPage,
  goToPage,
  activePageIndex,
  pagesCount
}: {
  bookmarkedMovies: SingleMovieType[]
}) => {
  const bookmarkedMoviesIds = bookmarkedMovies.map((movie) => movie.id)

  return bookmarkedMovies.length > 0 ? (
    <>
      <div className="grid grid-cols-4 gap-8 py-4">
        {bookmarkedMovies.map((movie) => {
          const isBookmarked = bookmarkedMoviesIds.includes(movie.id)
          return (
            <MovieCard key={movie.id} {...movie} isBookmarked={isBookmarked} />
          )
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
