import MovieCard from './MovieCard'
import { HiArrowCircleLeft, HiArrowCircleRight } from 'react-icons/hi'
import { useState } from 'react'

const Slider = ({ trendingMovies, bookmarkedMovies }) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)

  const totalSlides = Math.ceil(trendingMovies.length / 4)

  const bookmarkedMoviesIds = bookmarkedMovies.map((movie) => movie.id)

  const nextSlide = () => {
    if (activeSlideIndex < totalSlides - 1) {
      setActiveSlideIndex((prev) => prev + 1)
    } else {
      setActiveSlideIndex(0)
    }
  }

  const previousSlide = () => {
    if (activeSlideIndex === 0) {
      setActiveSlideIndex(totalSlides - 1)
    } else {
      setActiveSlideIndex((prev) => prev - 1)
    }
  }

  const dots = [...Array(totalSlides).keys()]

  return (
    <div className="w-full py-16 flex flex-col gap-4 relative">
      <div className="w-[90%] mx-auto flex items-center justify-between">
        <h2 className="text-xl font-semibold">Currently Trending</h2>
        <div className="flex gap-1 items-center">
          {dots.map((index) => {
            const color =
              activeSlideIndex === index ? 'bg-orange-500' : 'bg-gray-100'
            return (
              <div
                key={index}
                className={`h-[10px] w-[20px] ${color} rounded-sm transition-all duration-200`}
              ></div>
            )
          })}
        </div>
      </div>
      <div className="w-[90%] mx-auto flex items-center relative">
        <HiArrowCircleLeft
          size={60}
          className="absolute -left-4 -translate-x-full bottom-1/2 cursor-pointer transition-all duration-200 hover:text-orange-500 active:text-red-500 active:scale-90 z-10"
          onClick={previousSlide}
        />
        <div className="relative h-[450px] w-full overflow-hidden">
          <div
            className="relative h-full w-full flex transition-transform duration-500"
            style={{ transform: `translateX(-${activeSlideIndex * 100}%)` }}
          >
            {trendingMovies.map((movie) => {
              const isBookmarked = bookmarkedMoviesIds.includes(movie.id)
              return (
                <div className="w-1/4 flex-shrink-0">
                  <MovieCard
                    key={movie.id}
                    {...movie}
                    isBookmarked={isBookmarked}
                  />
                </div>
              )
            })}
          </div>
        </div>
        <HiArrowCircleRight
          size={60}
          className="absolute -right-4 bottom-1/2 cursor-pointer translate-x-full transition-all duration-200 hover:text-orange-500 active:text-red-500 active:scale-90 z-10"
          onClick={nextSlide}
        />
      </div>
    </div>
  )
}

export default Slider
{
  /* {trendingMovies.map((movie) => (
              <div key={movie.id} className="w-1/4 flex-shrink-0">
                <MovieCard {...movie} />
              </div>
            ))} */
}
