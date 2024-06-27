import { AllMoviesProps } from '../utils/types'
import MovieCard from './MovieCard'
import PageButton from './PageButton'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
const AllMovies = ({
  movies,
  nextPage,
  previousPage,
  goToPage,
  pagesCount,
    activePageIndex,
  updateMovie
}: AllMoviesProps) => {
  return (
    <>
      <div className="grid grid-cols-4 gap-8 py-4">
        {movies.map((movie) => (
            <MovieCard key={movie.id} {...movie} updateMovie={updateMovie} />
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
    </>
  )
}

export default AllMovies
