import MovieCard from './MovieCard'
import { HiArrowCircleLeft, HiArrowCircleRight } from 'react-icons/hi'
import { useState } from 'react'
const Slider = ({ movies }) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0)

  const generateDivs = (length: number) => {
    const numDivs = Math.ceil(length / 4)
    const divsArray = []
    for (let i = 0; i < numDivs; i++) {
      divsArray.push(
        <div key={i} className="h-[10px] w-[20px] bg-gray-100"></div>,
      )
    }
    return divsArray
  }
  const divsArray = generateDivs(movies.length)

  const nextSlide = () => {
    if (activeSlideIndex < divsArray.length - 1) {
      setActiveSlideIndex((prev) => prev + 1)
    } else {
      setActiveSlideIndex(0)
    }
  }

  const previousSlide = () => {
    if (activeSlideIndex === 0) {
      setActiveSlideIndex(divsArray.length - 1)
    } else {
      setActiveSlideIndex((prev) => prev - 1)
    }
  }

  return (
    <div className="w-[100%] pt-12 pb-20 flex flex-col gap-4 relative">
      <div className="w-[90%] mx-auto flex items-center justify-between">
        <h2>Currently Trending</h2>
        <div className="flex gap-1 items-center">
          {divsArray.map((div, index) => {
            const color =
              activeSlideIndex === index ? 'bg-orange-500' : 'bg-gray-100'
            return (
              <div
                key={div.key}
                className={`h-[10px] w-[20px] ${color} rounded-sm transition-all duration-200`}
              ></div>
            )
          })}
        </div>
      </div>
      <div className="flex w-[90%] mx-auto border overflow-hidden">
        <HiArrowCircleLeft
          size={60}
          className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:text-orange-500 active:text-red-500 active:scale-90"
          onClick={previousSlide}
        />
        <div className="relative h-[450px] w-full">
          {movies.map((movie, index) => {
            const calculation = 100 * (index - activeSlideIndex)
            const translate =
              calculation > 0
                ? `translateX(${calculation}%)`
                : `translateX(-${Math.abs(calculation)}%)`
            return (
              <div
                key={movie.id}
                className="absolute top-0 transition-all duration-200 w-1/4"
                style={{ transform: translate }}
              >
                <MovieCard {...movie} />
              </div>
            )
          })}
        </div>
        <HiArrowCircleRight
          size={60}
          className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:text-orange-500 active:text-red-500 active:scale-90"
          onClick={nextSlide}
        />
      </div>
    </div>
  )
}

export default Slider
