import { FaStar } from 'react-icons/fa'
const MovieCard = ({ movie }) => {
  return (
    <div className="w-[300px] flex flex-col ">
      <img
        src={movie.image}
        alt={movie.image}
        className="w-full h-[380px] object-cover pb-4"
      />
      <h2 className='text-md'>{movie.title}</h2>
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
