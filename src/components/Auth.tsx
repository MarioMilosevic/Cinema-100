import { useState } from 'react'
import movieLogo from '../assets/movie-icon-vector.jpg'
import { NewUserType, UserType } from '../utils/types'
import { initialNewUserState, initialUserState } from '../utils/constants'
import {
  createUserWithEmailAndPassword,
  signInAnonymously,
  signInWithEmailAndPassword,
  // signInWithEmailAndPassword,
} from 'firebase/auth'
import { auth } from '../config/firebase'
import InputField from './InputField'
import { useAppSlice } from '../hooks/useAppSlice'
import { toggleHasAccount } from '../redux/features/appSlice'
import { useDispatch } from 'react-redux'

const Auth = () => {
  // mozda sam sve mogao u 1 stejt
  const [user, setUser] = useState<UserType>(initialUserState)
  const [newUser, setNewUser] = useState<NewUserType>(initialNewUserState)
  const { hasAccount } = useAppSlice()
  const dispatch = useDispatch()

  const createNewUser = async () => {
    if (newUser.email && newUser.password) {
      try {
      const user =  await createUserWithEmailAndPassword(
          auth,
          newUser.email,
          newUser.password,
        )
        console.log(user.user)
      } catch (error) {
        console.error('Error', error)
      }
      setNewUser(initialNewUserState)
    }
  }

  const signInUser = async () => {
    try {
      const existingUser = await signInWithEmailAndPassword(auth, user.email, user.password)
      console.log(existingUser.user)
    } catch (error) {
      console.error(error)
    }
  }

  const authText = hasAccount ? 'Log In' : 'Sign Up'

  return (
    <div className="mt-16 w-[400px] flex flex-col mx-auto items-center gap-8 border">
      <div className="flex items-center gap-4">
        <img src={movieLogo} alt="movie logo" className="w-[75px]" />
        <h1 className="text-2xl font-medium">Cinema 100</h1>
      </div>
      <div className="bg-gray-800 w-[400px] mx-auto p-10 flex flex-col text-sm gap-8 rounded-lg">
        <h2 className="text-2xl">{authText}</h2>
        <div className="flex flex-col gap-4">
          {!hasAccount && (
            <>
              <InputField
                type="text"
                placeholder="Name"
                value={newUser.name}
                changeHandler={(e) =>
                  setNewUser((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              <InputField
                type="text"
                placeholder="Last Name"
                value={newUser.lastName}
                changeHandler={(e) =>
                  setNewUser((prev) => ({ ...prev, lastName: e.target.value }))
                }
              />
            </>
          )}
          <InputField
            type="text"
            placeholder="Email"
            value={hasAccount ? user.email : newUser.email}
            changeHandler={(e) => {
              ;(hasAccount ? setUser : setNewUser)((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }}
          />
          <InputField
            type="password"
            placeholder="Password"
            value={hasAccount ? user.password : newUser.password}
            changeHandler={(e) => {
              ;(hasAccount ? setUser : setNewUser)((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }}
          />
          <button
            className="bg-red-500 rounded-lg p-2"
            onClick={hasAccount ? signInUser : createNewUser}
          >
            {authText}
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
              {hasAccount ? 'Sign Up' : 'Log In'}
            </span>
          </p>
          {hasAccount && (
            <p className="flex justify-center gap-2 text-sm">
              Or,
              <span
                className="text-red-500 cursor-pointer"
                onClick={() => signInAnonymously(auth)}
              >
                Log in as guest
              </span>
            </p>
          )}
        </div>
      </div>
      <p>User not found</p>
    </div>
  )
}

export default Auth
