import MovieCard from './MovieCard'
import { HiArrowCircleLeft, HiArrowCircleRight } from 'react-icons/hi'
const Slider = ({ movies }) => {
  return (
    <div className="w-[100%] pt-12 pb-20 flex flex-col gap-4 relative">
      <div className="w-[90%] mx-auto flex items-center justify-between">
        <h2>Currently Trending</h2>
        <div>nesto</div>
      </div>
      <div className="flex w-[90%] mx-auto border overflow-hidden">
        <HiArrowCircleLeft
          size={60}
          className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:text-orange-500 active:text-red-500 active:scale-90"
        />
        {movies.map((movie) => (
          <div key={movie.id} className="w-1/3">
            <MovieCard {...movie} />
          </div>
        ))}
        <HiArrowCircleRight size={60} className='absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:text-orange-500 active:text-red-500 active:scale-90'/>
      </div>
    </div>
  )
}

export default Slider
