import MovieCard from './MovieCard'
import { HiArrowCircleLeft, HiArrowCircleRight } from 'react-icons/hi'
import { useState, useEffect } from 'react'
import { useMoviesSlice } from '../hooks/useMovies'
import { useUserSlice } from '../hooks/useUserSlice'
import { BIG_SCREEN, BIG_SCREEN_BREAKPOINT, SMALL_SCREEN } from '../utils/constants'
const Slider = () => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [slidesPerDot, setSlidesPerDot] = useState(4)
  const { trendingMovies } = useMoviesSlice()
  const {globalUser:{bookmarkedMovies}} = useUserSlice()


  const updateSlidesPerDot = () => {
    if (window.innerWidth >= BIG_SCREEN_BREAKPOINT) {
      setSlidesPerDot(BIG_SCREEN)
    } else {
      setSlidesPerDot(SMALL_SCREEN)
    }
  }

  useEffect(() => {
    updateSlidesPerDot()
    window.addEventListener('resize', updateSlidesPerDot)
    return () => {
      window.removeEventListener('resize', updateSlidesPerDot)
    }
  }, [])

  const totalSlides = Math.ceil(trendingMovies.length / slidesPerDot)
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
    <div className="w-full py-16 flex flex-col gap-4 relative lg:px-0 px-12">
      <div className="w-[90%] mx-auto flex lg:flex-row lg:items-center lg:justify-between lg:gap-0 flex-col gap-4 items-center">
        <h2 className="lg:text-xl text-lg font-semibold">Currently Trending</h2>
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
          className="absolute lg:-left-4 -left-1 -translate-x-full bottom-1/2 cursor-pointer transition-all duration-200 hover:text-orange-500 active:text-red-500 active:scale-90 z-10"
          onClick={previousSlide}
        />
        <div className="relative h-[450px] w-full overflow-hidden">
          <div
            className="relative h-full w-full flex transition-transform duration-500 items-center"
            style={{ transform: `translateX(-${activeSlideIndex * 100}%)` }}
          >
            {trendingMovies.map((movie) => {
              const isBookmarked = bookmarkedMoviesIds.includes(movie.id)
              return (
                <div className="lg:w-1/4 flex-shrink-0 w-full" key={movie.id}>
                  <MovieCard
                    {...movie}
                    isBookmarked={isBookmarked}
                    size="small"
                  />
                </div>
              )
            })}
          </div>
        </div>
        <HiArrowCircleRight
          size={60}
          className="absolute lg:-right-4 -right-1 bottom-1/2 cursor-pointer translate-x-full transition-all duration-200 hover:text-orange-500 active:text-red-500 active:scale-90 z-10"
          onClick={nextSlide}
        />
      </div>
    </div>
  )
}

export default Slider


