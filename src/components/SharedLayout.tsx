import movieLogo from '../assets/movie-icon-vector.jpg'
import { Outlet } from 'react-router'
import { RiShutDownLine } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import { useAppSlice } from '../hooks/useAppSlice'
import { useDispatch } from 'react-redux'
import { signOutUser } from '../utils/api'

const SharedLayout = () => {
  const { globalUser } = useAppSlice()
  const dispatch = useDispatch()

  const handleSignOutUser = async () => {
    signOutUser({ dispatch, globalUser })
  }
  return (
    <>
      <div className="bg-gray-900 lg:px-24 py-4 text-sm px-4">
        <div className="flex justify-between items-center">
          <Link to={'/home'}>
            <div className="flex items-center">
              <img
                src={movieLogo}
                alt={movieLogo}
                className="w-[75px] h-[75px] cursor-pointer"
              />
              <span className="lg:text-xl">Cinema 100</span>
            </div>
          </Link>
          <div className="flex lg:gap-12 gap-8">
            <p className="flex gap-1 items-center">
              Welcome back,
              <span className="capitalize">{globalUser.name}</span>
            </p>
            <div className="flex items-center gap-4">
              <span>Log Out</span>
              <Link to={'/'}>
                <RiShutDownLine
                  className="cursor-pointer w-6 h-6"
                  onClick={handleSignOutUser}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/*  */}
      <main>
        <Outlet />
      </main>
      <footer className="py-6 bg-gray-900 flex items-center justify-center">
        <div className="flex justify-center items-center gap-2">
          Copyright &copy; Mario Milošević
          <a href="https://github.com/MarioMilosevic" target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="transition hover:scale-110 hover:rotate-[360deg] duration-700 bg-gray-50 rounded-full"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        </div>
      </footer>
    </>
  )
}

export default SharedLayout
