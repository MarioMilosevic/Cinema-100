import MovieCard from './MovieCard'

const Slider = ({ movies }) => {
  return (
    <div className="border w-[90%] mx-auto flex py-12 overflow-hidden">
      {movies.map((movie) => (
        <div key={movie.id} className="w-1/3">
          <MovieCard {...movie} />
        </div>
      ))}
    </div>
  )
}

export default Slider
