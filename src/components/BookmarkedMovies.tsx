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
  setBookmarkedMovies,
}: BookmarkedMoviesProps) => {
  const [activePageIndex, setActivePageIndex] = useState<number>(0)
  const [pagesCount, setPagesCount] = useState<number[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const [genre, setGenre] = useState<string>('All')
  const [currentMovies, setCurrentMovies] =
    useState<SingleMovieType[]>(bookmarkedMovies)
  const [filteredMovies, setFilteredMovies] = useState<SingleMovieType[]>([])

  useEffect(() => {
    setFilteredMovies(bookmarkedMovies)
    setCurrentMovies(
      bookmarkedMovies.slice(
        activePageIndex * pageSize,
        (activePageIndex + 1) * pageSize,
      ),
    )
  }, [activePageIndex, bookmarkedMovies])

  useEffect(() => {
    setPagesCount(calculatePageButtons(bookmarkedMovies.length, pageSize))
  }, [bookmarkedMovies.length])

  const searchGenre = (e) => {
    // ova se pozove na promjenu zanra
    const searchInput = e.target.value
    setGenre(searchInput)
    filterMoviesByGenre(searchInput)
  }

  const searchMovies = (e) => {
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

  // const filterMoviesBySearchValue = (searchInput: string) => {
  //   let searchFilteredMovies
  //   if (!searchInput && genre === 'All') {
  //     console.log('NEMA searchValue NEMA genre')
  //     searchFilteredMovies = bookmarkedMovies
  //     setPagesCount(calculatePageButtons(searchFilteredMovies.length, pageSize))
  //     setFilteredMovies(searchFilteredMovies)
  //     setCurrentMovies(searchFilteredMovies.slice(0, pageSize))
  //   }
  //   if (searchInput && genre === 'All') {
  //     console.log('IMA searchValue NEMA genre')
  //     searchFilteredMovies = bookmarkedMovies.filter((movie) =>
  //       movie.title.includes(searchInput),
  //     )
  //     setFilteredMovies(searchFilteredMovies)
  //     setCurrentMovies(searchFilteredMovies.slice(0, pageSize))
  //     setPagesCount(calculatePageButtons(searchFilteredMovies.length, pageSize))
  //   }
  //   if (!searchInput && genre !== 'All') {
  //     console.log('NEMA searchValue IMA genre')
  //     searchFilteredMovies = bookmarkedMovies.filter((movie) =>
  //       movie.genre.includes(genre),
  //     )
  //     setFilteredMovies(searchFilteredMovies)
  //     setCurrentMovies(searchFilteredMovies.slice(0, 12))
  //     setPagesCount(calculatePageButtons(searchFilteredMovies.length, pageSize))
  //   }
  //   if (searchInput && genre !== 'All') {
  //     console.log('IMA searchValue IMA genre')
  //     searchFilteredMovies = filteredMovies.filter((movie) =>
  //       movie.title.includes(searchInput),
  //     )
  //     setFilteredMovies(searchFilteredMovies)
  //     setCurrentMovies(searchFilteredMovies.slice(0, pageSize))
  //     setPagesCount(calculatePageButtons(searchFilteredMovies.length, pageSize))
  //   }
  //   setActivePageIndex(0)
  // }

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

  // const filterMoviesByGenre = (genre: string) => {
  //   let genreFilteredMovies
  //   if (genre === 'All' && !searchValue) {
  //     console.log('NEMA genre NEMA seachvalue')
  //     setCurrentMovies(bookmarkedMovies.slice(0, pageSize))
  //     setFilteredMovies(bookmarkedMovies)
  //     setPagesCount(calculatePageButtons(bookmarkedMovies.length, pageSize))
  //   }
  //   if (genre !== 'All' && !searchValue) {
  //     console.log('IMA genre NEMA SearchValue')
  //     // problem nedje
  //     genreFilteredMovies = bookmarkedMovies.filter((movie) =>
  //       movie.genre.includes(genre),
  //     )
  //     setFilteredMovies(genreFilteredMovies)
  //     setCurrentMovies(genreFilteredMovies.slice(0, pageSize))
  //     setPagesCount(calculatePageButtons(genreFilteredMovies.length, pageSize))
  //   }
  //   if (genre !== 'All' && searchValue) {
  //     console.log('IMA genre IMA SearchValue')
  //     genreFilteredMovies = filteredMovies.filter((movie) =>
  //       movie.genre.includes(genre),
  //     )
  //     setFilteredMovies(genreFilteredMovies)
  //     setCurrentMovies(genreFilteredMovies.slice(0, pageSize))
  //     setPagesCount(calculatePageButtons(genreFilteredMovies.length, pageSize))
  //   }
  //   if (genre === 'All' && searchValue) {
  //     console.log('NEMA genre, IMA searchValue')
  //     // ovo testiram
  //     const searchFilteredMovies = bookmarkedMovies.filter((movie) =>
  //       movie.title.includes(searchValue),
  //     )
  //     setFilteredMovies(searchFilteredMovies)
  //     setCurrentMovies(searchFilteredMovies.slice(0, pageSize))
  //     setPagesCount(calculatePageButtons(searchFilteredMovies.length, pageSize))
  //   }
  //   setActivePageIndex(0)
  // }

  const nextPage = () => {
    if (activePageIndex < pagesCount.length - 1) {
      const nextPageIndex = activePageIndex + 1
      setActivePageIndex(nextPageIndex)
      if (!searchValue && genre === 'All') {
        setCurrentMovies(
          bookmarkedMovies.slice(
            nextPageIndex * pageSize,
            (nextPageIndex + 1) * pageSize,
          ),
        )
      }
      // if (!searchValue && genre !== 'All') {
      else {
        console.log('next kada zanr nije all')
        setCurrentMovies(
          filteredMovies.slice(
            nextPageIndex * pageSize,
            (nextPageIndex + 1) * pageSize,
          ),
        )
      }
    }
  }

  const previousPage = () => {
    if (activePageIndex > 0) {
      const prevPageIndex = activePageIndex - 1
      setActivePageIndex(prevPageIndex)
      if (!searchValue && genre === 'All') {
        setCurrentMovies(
          bookmarkedMovies.slice(
            prevPageIndex * pageSize,
            (prevPageIndex + 1) * pageSize,
          ),
        )
      }
      // if (!searchValue && genre !== 'All') {
      else {
        console.log('prev kada zanr nije all')
        setCurrentMovies(
          filteredMovies.slice(
            prevPageIndex * pageSize,
            (prevPageIndex + 1) * pageSize,
          ),
        )
      }
    }
  }

  const goToPage = (pageIndex: number) => {
    if (searchValue === '' && genre === 'All') {
      console.log('ako je sve kako treba')
      setActivePageIndex(pageIndex)
      setCurrentMovies(
        bookmarkedMovies.slice(
          pageIndex * pageSize,
          (pageIndex + 1) * pageSize,
        ),
      )
    }
    if (searchValue === '' && genre !== 'All') {
      console.log('ukoliko je zanr mjenjan')

      setActivePageIndex(pageIndex)
      setPagesCount(calculatePageButtons(filteredMovies.length, pageSize))
      setCurrentMovies((previousMovies) =>
        previousMovies.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
      )
    }
    if (searchValue !== '' && genre === 'All') {
      console.log('ukoliko je search mijenjan a genre ALL')
    }
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
