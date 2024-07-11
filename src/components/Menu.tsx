import { SlMagnifier } from 'react-icons/sl'
import { FaBookmark } from 'react-icons/fa'
import { FaHouse } from 'react-icons/fa6'
import { allGenres } from '../utils/constants'
import { MenuProps } from '../utils/types'
const Menu = ({
  searchValue,
  searchMovies,
  searchGenre,
  genre,
  bookmarkedPage,
  setBookmarkedPage,
}: MenuProps) => {
  return (
    <div className="bg-gray-900 p-2 rounded-lg flex items-center justify-between lg:w-full w-[390px] mx-auto">
      <div className="relative lg:w-[250px] w-[150px]">
        <input
          type="text"
          placeholder="Search"
          className="lg:w-full w-[150px] px-2 py-1 lg:text-base text-sm rounded-lg text-gray-950 placeholder:text-gray-700 focus:ring-4 focus:outline-none focus:ring-red-500 focus:border-none transition-all duration-300"
          onChange={searchMovies}
          value={searchValue}
        />
        <SlMagnifier
          className="absolute bottom-1/2 lg:right-3 translate-y-1/2 cursor-pointer right-2"
          color="black"
        />
      </div>
      <div className="flex items-center lg:gap-4 gap-2">
        <select
          name="category"
          id="category"
          className="text-black rounded-full pl-2 lg:text-base text-sm"
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
