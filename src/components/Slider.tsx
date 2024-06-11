
import MovieCard from './MovieCard'
import { HiArrowCircleLeft, HiArrowCircleRight } from 'react-icons/hi'
import { useState } from 'react'

const Slider = ({ movies }) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)

  const totalSlides = Math.ceil(movies.length / 4)

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

  return (
    <div className="w-full pt-12 pb-20 flex flex-col gap-4 relative">
      <div className="w-[90%] mx-auto flex items-center justify-between">
        <h2>Currently Trending</h2>
        <div className="flex gap-1 items-center">
          {[...Array(totalSlides)].map((_, index) => {
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
          className="absolute left-0 -translate-x-full cursor-pointer transition-all duration-200 hover:text-orange-500 active:text-red-500 active:scale-90 z-10"
          onClick={previousSlide}
        />
        <div className="relative h-[450px] w-full overflow-hidden">
          <div
            className="relative h-full w-full flex transition-transform duration-500"
            style={{ transform: `translateX(-${activeSlideIndex * 100}%)` }}
          >
            {movies.map((movie) => (
              <div key={movie.id} className="w-1/4 flex-shrink-0">
                <MovieCard {...movie} />
              </div>
            ))}
          </div>
        </div>
        <HiArrowCircleRight
          size={60}
          className="absolute right-0 cursor-pointer translate-x-full transition-all duration-200 hover:text-orange-500 active:text-red-500 active:scale-90 z-10"
          onClick={nextSlide}
        />
      </div>
    </div>
  )
}

export default Slider
