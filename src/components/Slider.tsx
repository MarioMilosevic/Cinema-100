import MovieCard from "./MovieCard"
const Slider = ({ movies }) => {
  return (
    <div className="border w-[90%] mx-auto py-12 flex">
      {movies.map((movie) => <MovieCard key={movie.id} {...movie} />)}
    </div>
  )
}

export default Slider

