import { SlMagnifier } from 'react-icons/sl'
import { FaBookmark } from 'react-icons/fa'
import { FaHouse } from 'react-icons/fa6'
import { allGenres } from '../utils/constants'
const Menu = ({
  searchValue,
  searchMovies,
  searchGenre,
  genre,
  bookmarkedPage,
  setBookmarkedPage,
}) => {
  return (
    <div className="bg-gray-900 px-3 py-4 rounded-lg flex items-center justify-between">
      <div className="relative w-[250px]">
        <input
          type="text"
          placeholder="Search"
          className="w-full px-2 py-1 rounded-lg text-gray-950 placeholder:text-gray-700 focus:ring-4 focus:outline-none focus:ring-red-500 focus:border-none transition-all duration-300"
          onChange={searchMovies}
          value={searchValue}
        />
        <SlMagnifier
          className="absolute bottom-1/2 right-3 translate-y-1/2 cursor-pointer"
          color="black"
        />
      </div>
      <div className="flex items-center gap-4">
        <select
          name="category"
          id="category"
          className="text-black rounded-full px-2"
          value={genre}
          onChange={searchGenre}
        >
          {allGenres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
        <FaBookmark
          size={25}
          className="cursor-pointer transition-all duration-200"
          color={bookmarkedPage ? 'red' : 'white'}
          onClick={() => setBookmarkedPage(true)}
        />
        <FaHouse
          size={25}
          className="cursor-pointer transition-all duration-200"
          color={bookmarkedPage ? 'white' : 'red'}
          onClick={() => setBookmarkedPage(false)}
        />
      </div>
    </div>
  )
}

export default Menu
