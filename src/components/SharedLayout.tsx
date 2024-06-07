import { Outlet } from 'react-router'
import movieLogo from '../assets/movie-icon-vector.jpg'
import { RiShutDownLine } from 'react-icons/ri'
import { Link } from 'react-router-dom'

const SharedLayout = () => {
  return (
    <>
      <div className="bg-gray-900 px-24 py-4">
        <div className="flex justify-between items-center">
          <Link to={'/home'}>
            <div className="flex items-center gap-4">
              <img
                src={movieLogo}
                alt={movieLogo}
                className="w-[75px] h-[75px] cursor-pointer"
              />
              <span className="text-xl">Cinema 100</span>
            </div>
          </Link>
          <div className="flex gap-12">
            <span>Welcome back, Guest</span>
            <div className="flex items-center gap-4">
              <span>Log Out</span>
              <RiShutDownLine className="cursor-pointer w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
      <Outlet />
    </>
  )
}

export default SharedLayout
