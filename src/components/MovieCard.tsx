import { FaStar, FaSearch, FaBookmark } from 'react-icons/fa'
import { SingleMovieType } from '../utils/types'
import { useState } from 'react'
const MovieCard = ({ image, title, year, rating, genre }: SingleMovieType) => {
  const [visible, setVisible] = useState<boolean>(false)
  const mario = title.length > 36 ? `${title.slice(0, 36)}...` : title
  return (
    <div className="w-[300px] flex flex-col">
      {/*  */}
      <div className="w-full h-[380px] relative">
        <img
          src={image}
          alt={image}
          className="w-full h-full object-cover pb-4 transition-all duration-300 hover:opacity-60"
        />
        <div
          className={`absolute top-0 right-0 w-full h-full ${visible ? 'block' : 'hidden'} transition-all duration-200`}
        >
          <FaBookmark className="absolute top-2 right-2 " />
          <div className="flex items-center gap-2 absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 rounded-full bg-gray-900 px-2 py-1 opacity-70 cursor-pointer hover:opacity-100 hover:text-gray-50 hover:bg-gray-400">
            <span>See more</span>
            <FaSearch />
          </div>
        </div>
      </div>
      {/*  */}
      <h2 className="text-base font-medium">{mario}</h2>
      <div className="flex text-sm gap-2 items-center">
        <span>{year}</span>
        <FaStar color="orange" />
        <div className="flex gap-2">
          <span>{rating}</span>
          {genre.map((genre, index) => (
            <span key={index}>
              {index === genre.length - 1 ? genre : `${genre},`}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MovieCard
