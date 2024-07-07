import movieLogo from '../assets/movie-icon-vector.jpg'
import { useState } from 'react'
import { UserType, NewUserType } from '../utils/types'
import { initialUserState, initialNewUserState } from '../utils/constants'
import { authenticationSchema, UserFormFormValues } from '../utils/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useAppSlice } from '../hooks/useAppSlice'
import { toggleHasAccount, setGlobalUser } from '../redux/features/appSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import LogIn from './LogIn'
import SignUp from './SignUp'
import { createUser, signInUser, signInGuest } from '../utils/api'

const Auth = () => {
  const [user, setUser] = useState<UserType>(initialUserState)
  const [newUser, setNewUser] = useState<NewUserType>(initialNewUserState)
  const { hasAccount } = useAppSlice()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const form = useForm<UserFormFormValues>({
    defaultValues: {
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

  const onSubmit = async (data: UserFormFormValues) => {
    if (hasAccount) {
      await signInUser({ data, dispatch, navigate, setGlobalUser })
    } else {
      await createUser({ data, dispatch, navigate, setGlobalUser, setNewUser })
    }
  }

  return (
    <div className="mt-16 w-[400px] flex flex-col mx-auto items-center gap-8">
      <div className="flex items-center gap-4">
        <img src={movieLogo} alt="movie logo" className="w-[75px]" />
        <h1 className="text-2xl font-medium">Cinema 100</h1>
      </div>
      <div className="bg-gray-800 w-[400px] mx-auto p-10 flex flex-col text-sm gap-8 rounded-lg">
        <h2 className="text-2xl">{hasAccount ? 'Log In' : 'Sign Up'}</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          {hasAccount ? (
            <LogIn user={user} setUser={setUser} register={register} />
          ) : (
            <SignUp
              newUser={newUser}
              setNewUser={setNewUser}
              register={register}
            />
          )}
          <button className="bg-red-500 rounded-lg p-2" type="submit">
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
                onClick={() =>
                  signInGuest({ dispatch, navigate, setGlobalUser })
                }
              >
                Log in as guest
              </span>
            </p>
          )}
        </div>
      </div>
      {errors && (
        <div className="text-red-500 text-sm py-1">
          {Object.values(errors).map((error, index) => (
            <p key={index}>{error.message}</p>
          ))}
        </div>
      )}
    </div>
  )
}

export default Auth
