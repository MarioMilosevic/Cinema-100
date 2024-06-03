import { FaStar } from 'react-icons/fa'
const MovieCard = ({ movie }) => {
  console.log(movie)
  return (
    <div className="border mt-32">
      <img
        src={movie.image}
        alt={movie.image}
        className="w-[170px] h-[250px] object-cover"
      />
      <h2>{movie.title}</h2>
      <div className="flex text-sm gap-2 items-center">
        <span>{movie.year}</span>
        <FaStar color="orange" />
        <div className='flex gap-2'>
          <span>{movie.rating}</span>
          {movie.genre.map((genre, index) => (
            <span key={index}>{index === movie.genre.length - 1 ? genre : `${genre},`}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MovieCard
