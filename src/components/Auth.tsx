import { useState } from 'react'
import movieLogo from '../assets/movie-icon-vector.jpg'
import { UserType } from '../utils/types'
import { initialUserState } from '../utils/constants'
import {
  createUserWithEmailAndPassword,
  signInAnonymously,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import InputField from './InputField'
import { useAppSlice } from '../hooks/useAppSlice'
import { toggleHasAccount } from '../redux/features/appSlice'
import { useDispatch } from 'react-redux'
import { useAuth } from '../hooks/useAuth'

const Auth = () => {
  const [user, setUser] = useState<UserType>(initialUserState)
  const { hasAccount } = useAppSlice()
  const {auth} = useAuth()
  const dispatch = useDispatch()

  const createNewUser = async () => {
    if (user.email && user.password) {
      try {
        const newUser = await createUserWithEmailAndPassword(
          auth,
          user.email,
          user.password,
        )
        console.log(newUser)
      } catch (error) {
        console.error('Error', error)
      }
      setUser(initialUserState)
    }
  }

  const signInUser = async () => {
    try {
      const existingUser = await signInWithEmailAndPassword(
        auth,
        user.email,
        user.password,
      )
      console.log(existingUser.user)
    } catch (error) {
      console.error(error)
    }
  }

  const signInGuest = async () => {
    try {
      const guest = await signInAnonymously(auth)
      console.log(guest)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="mt-16 w-[400px] flex flex-col mx-auto items-center gap-8">
      <div className="flex items-center gap-4">
        <img src={movieLogo} alt="movie logo" className="w-[75px]" />
        <h1 className="text-2xl font-medium">Cinema 100</h1>
      </div>
      <div className="bg-gray-800 w-[400px] mx-auto p-10 flex flex-col text-sm gap-8 rounded-lg">
        <h2 className="text-2xl">{hasAccount ? "Log In" : "Sign Up"}</h2>
        <div className="flex flex-col gap-4">
          {!hasAccount && (
            <>
              <InputField
                type="text"
                placeholder="Name"
                value={user.name}
                changeHandler={(e) =>
                  setUser((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              <InputField
                type="text"
                placeholder="Last Name"
                value={user.lastName}
                changeHandler={(e) =>
                  setUser((prev) => ({ ...prev, lastName: e.target.value }))
                }
              />
            </>
          )}
          <InputField
            type="text"
            placeholder="Email"
            value={hasAccount ? user.email : user.email}
            changeHandler={(e) =>
              setUser((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
          />
          <InputField
            type="password"
            placeholder="Password"
            value={hasAccount ? user.password : user.password}
            changeHandler={(e) =>
              setUser((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
          />
          <button
            className="bg-red-500 rounded-lg p-2"
            onClick={hasAccount ? signInUser : createNewUser}
          >
            {hasAccount ? 'Log In' : 'Sign Up'}
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <p className="flex justify-center gap-2">
            {hasAccount
              ? "Don't have an account ?"
              : 'Already have an account ?'}
            <span
              className="text-red-500 cursor-pointer"
              onClick={() => dispatch(toggleHasAccount())}
            >
              {hasAccount ? "Sign Up" : "Log In"}
            </span>
          </p>
          {hasAccount && (
            <p className="flex justify-center gap-2 text-sm">
              Or,
              <span
                className="text-red-500 cursor-pointer"
                onClick={signInGuest}
              >
                Log in as guest
              </span>
            </p>
          )}
        </div>
      </div>
      {/* <p>User not found</p> */}
    </div>
  )
}

export default Auth
