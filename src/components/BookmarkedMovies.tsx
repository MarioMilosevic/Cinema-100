import MovieCard from './MovieCard'
import PageButton from './PageButton'
import Menu from './Menu'
import { BookmarkedMoviesProps, SingleMovieType } from '../utils/types'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { pageSize } from '../utils/constants'
import { useState, useEffect } from 'react'
import { calculatePageButtons } from '../utils/helperFunctions'

const BookmarkedMovies = ({
  bookmarkedPage,
  setBookmarkedPage,
  bookmarkedMovies,
}: BookmarkedMoviesProps) => {
  const [activePageIndex, setActivePageIndex] = useState<number>(0)
  const [pagesCount, setPagesCount] = useState<number[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const [genre, setGenre] = useState<string>('All')
  const [currentMovies, setCurrentMovies] =
    useState<SingleMovieType[]>(bookmarkedMovies)
  const [filteredMovies, setFilteredMovies] = useState<SingleMovieType[]>([])

  useEffect(() => {
    const filtered = filterMovies(bookmarkedMovies, searchValue, genre)
    setFilteredMovies(filtered)
    setPagesCount(calculatePageButtons(filtered.length, pageSize))
    setActivePageIndex(0)
  }, [bookmarkedMovies, searchValue, genre])

  useEffect(() => {
    setCurrentMovies(
      filteredMovies.slice(
        activePageIndex * pageSize,
        (activePageIndex + 1) * pageSize,
      ),
    )
  }, [activePageIndex, filteredMovies])

  const filterMovies = (
    movies: SingleMovieType[],
    searchValue: string,
    genre: string,
  ) => {
    let filtered = movies

    if (genre !== 'All') {
      filtered = filtered.filter((movie) => movie.genre.includes(genre))
    }

    if (searchValue) {
      filtered = filtered.filter((movie) => movie.title.includes(searchValue))
    }

    return filtered
  }

  const searchGenre = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const searchInput = e.target.value
    setGenre(searchInput)
    filterMoviesByGenre(searchInput)
  }

  const searchMovies = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchInput = e.target.value
    setSearchValue(searchInput)
    filterMoviesBySearchValue(searchInput)
  }

  const filterMoviesBySearchValue = (searchInput: string) => {
    let searchFilteredMovies = bookmarkedMovies

    if (genre !== 'All') {
      searchFilteredMovies = searchFilteredMovies.filter((movie) =>
        movie.genre.includes(genre),
      )
    }

    if (searchInput) {
      searchFilteredMovies = searchFilteredMovies.filter((movie) =>
        movie.title.includes(searchInput),
      )
    }

    setFilteredMovies(searchFilteredMovies)
    setCurrentMovies(searchFilteredMovies.slice(0, pageSize))
    setPagesCount(calculatePageButtons(searchFilteredMovies.length, pageSize))
    setActivePageIndex(0)
  }

  const filterMoviesByGenre = (genre: string) => {
    let genreFilteredMovies = bookmarkedMovies

    if (genre !== 'All') {
      genreFilteredMovies = genreFilteredMovies.filter((movie) =>
        movie.genre.includes(genre),
      )
    }

    if (searchValue) {
      genreFilteredMovies = genreFilteredMovies.filter((movie) =>
        movie.title.includes(searchValue),
      )
    }

    setFilteredMovies(genreFilteredMovies)
    setCurrentMovies(genreFilteredMovies.slice(0, pageSize))
    setPagesCount(calculatePageButtons(genreFilteredMovies.length, pageSize))
    setActivePageIndex(0)
  }

  const nextPage = () => {
    if (activePageIndex < pagesCount.length - 1) {
      const nextPageIndex = activePageIndex + 1
      setActivePageIndex(nextPageIndex)
      setCurrentMovies(
        filteredMovies.slice(
          nextPageIndex * pageSize,
          (nextPageIndex + 1) * pageSize,
        ),
      )
    }
  }

  const previousPage = () => {
    if (activePageIndex > 0) {
      const prevPageIndex = activePageIndex - 1
      setActivePageIndex(prevPageIndex)
      setCurrentMovies(
        filteredMovies.slice(
          prevPageIndex * pageSize,
          (prevPageIndex + 1) * pageSize,
        ),
      )
    }
  }

  const goToPage = (pageIndex: number) => {
    setActivePageIndex(pageIndex)
    setCurrentMovies(
      filteredMovies.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
    )
  }

  return (
    <div>
      <Menu
        searchValue={searchValue}
        searchMovies={searchMovies}
        bookmarkedPage={bookmarkedPage}
        setBookmarkedPage={setBookmarkedPage}
        genre={genre}
        searchGenre={searchGenre}
      />
      {currentMovies.length > 0 ? (
        <>
          <div className="lg:grid lg:grid-cols-4 flex flex-col items-center gap-8 lg:py-4 py-8">
            {currentMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                {...movie}
                isBookmarked={true}
                size="small"
              />
            ))}
          </div>
          <div className="py-8 flex justify-center items-center gap-2">
            <button
              className="lg:px-4 lg:py-2 px-3 py-1 rounded-lg transition-all duration-100 bg-gray-900 text-gray-300 hover:bg-gray-300 hover:text-gray-900"
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
              className="lg:px-4 lg:py-2 px-3 py-1 rounded-lg transition-all duration-100 bg-gray-900 text-gray-300 hover:bg-gray-300 hover:text-gray-900"
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
