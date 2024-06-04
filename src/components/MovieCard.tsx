import { FaStar, FaSearch, FaBookmark } from 'react-icons/fa'
const MovieCard = ({ movie }) => {
  return (
    <div className="w-[300px] flex flex-col">
      <div className="w-full h-[380px] relative">
        <img
          src={movie.image}
          alt={movie.image}
          className="w-full h-full object-cover pb-4 border transition-all duration-300 hover:opacity-50"
        />
        <div className="absolute top-2 right-2 p-1 rounded-full ">
          <FaBookmark color="white" />
        </div>
        <div className="absolute bottom-1/2 right-1/2 flex items-center gap-2 translate-x-1/2 translate-y-1/2 rounded-full bg-gray-700 px-2 py-1 opacity-50">
          <span>See more</span>
          <FaSearch />
        </div>
      </div>
      <h2 className="text-md">{movie.title}</h2>
      <div className="flex text-sm gap-2 items-center">
        <span>{movie.year}</span>
        <FaStar color="orange" />
        <div className="flex gap-2">
          <span>{movie.rating}</span>
          {movie.genre.map((genre, index) => (
            <span key={index}>
              {index === movie.genre.length - 1 ? genre : `${genre},`}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MovieCard
