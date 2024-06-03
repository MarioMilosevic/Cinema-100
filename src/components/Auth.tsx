import { useState } from 'react'
import movieLogo from '../assets/movie-icon-vector.jpg'
import { UserType } from '../utils/types'
import { initialUserState } from '../utils/constants'
import { authenticationSchema, UserFormFormValues } from '../utils/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

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
import { useNavigate } from 'react-router'

const Auth = () => {
  const [user, setUser] = useState<UserType>(initialUserState)
  const { hasAccount } = useAppSlice()
  const { auth } = useAuth()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const form = useForm<UserFormFormValues>({
    defaultValues: {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
    },
    resolver: zodResolver(authenticationSchema),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  const createNewUser = async () => {
    if (user.email && user.password) {
      try {
        const newUser = await createUserWithEmailAndPassword(
          auth,
          user.email,
          user.password,
        )
        console.log(newUser)
        navigate('/home')
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
      if (existingUser) navigate('/home')
    } catch (error) {
      console.error(error)
    }
  }

  const signInGuest = async () => {
    try {
      const guest = await signInAnonymously(auth)
      console.log(guest)
      navigate('/home')
    } catch (error) {
      console.error(error)
    }
  }

  const onSubmit = () => hasAccount ? signInUser() : createNewUser()
  
  return (
    <div className="mt-16 w-[400px] flex flex-col mx-auto items-center gap-8">
      <div className="flex items-center gap-4">
        <img src={movieLogo} alt="movie logo" className="w-[75px]" />
        <h1 className="text-2xl font-medium">Cinema 100</h1>
      </div>
      <div className="bg-gray-800 w-[400px] mx-auto p-10 flex flex-col text-sm gap-8 rounded-lg">
        <h2 className="text-2xl">{hasAccount ? 'Log In' : 'Sign Up'}</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          {!hasAccount && (
            <>
              <InputField
                type="text"
                placeholder="Name"
                value={user.name}
                changeHandler={(e) =>
                  setUser((prev) => ({ ...prev, name: e.target.value }))
                }
                zod={{
                  ...register('name', {
                    required: {
                      value: true,
                      message: 'Name is required',
                    },
                  }),
                }}
              />
              <InputField
                type="text"
                placeholder="Last Name"
                value={user.lastName}
                changeHandler={(e) =>
                  setUser((prev) => ({ ...prev, lastName: e.target.value }))
                }
                zod={{
                  ...register('lastName', {
                    required: {
                      value: true,
                      message: 'Last Name is required',
                    },
                  }),
                }}
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
            zod={{
              ...register('email', {
                required: {
                  value: true,
                  message: 'Email is required',
                },
              }),
            }}
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
            zod={{
              ...register('password', {
                required: {
                  value: true,
                  message: 'Password is required',
                },
              }),
            }}
          />
          <button
            className="bg-red-500 rounded-lg p-2"
            onClick={hasAccount ? signInUser : createNewUser}
          >
            {hasAccount ? 'Log In' : 'Sign Up'}
          </button>
        </form>
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
                onClick={signInGuest}
              >
                Log in as guest
              </span>
            </p>
          )}
        </div>
      </div>
      {errors && (
        <p className="text-red-500 text-sm py-1">
          {errors.name?.message ||
            errors.lastName?.message ||
            errors.email?.message ||
            errors.password?.message}
        </p>
      )}
    </div>
  )
}

export default Auth
