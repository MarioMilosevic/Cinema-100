import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { authenticationSchema, UserFormFormValues } from '../utils/zod'
import { createUser, signInUser, signInGuest } from '../utils/api'
import { useUserSlice } from '../hooks/useUserSlice'
import { toggleHasAccount, setGlobalUser } from '../redux/features/userSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import LogIn from '../components/LogIn'
import SignUp from '../components/SignUp'
import movieLogo from '../assets/movie-icon-vector.jpg'

const Auth = () => {
  const [error, setError] = useState<string>('')
  const { hasAccount } = useUserSlice()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const form = useForm<UserFormFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(authenticationSchema),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  const onSubmit = async (data: UserFormFormValues) => {
    try {
      if (hasAccount) {
        await signInUser({ data, dispatch, navigate, setGlobalUser, setError })
      } else {
        await createUser({
          data,
          dispatch,
          navigate,
          setGlobalUser,
        })
      }
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
      <div className="bg-gray-800 lg:w-[400px] w-[375px] mx-auto p-10 flex flex-col text-sm gap-8 rounded-lg">
        <h2 className="text-2xl">{hasAccount ? 'Log In' : 'Sign Up'}</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          {hasAccount ? (
            <LogIn register={register} />
          ) : (
            <SignUp register={register} />
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
        {errors && (
          <div className="text-red-500 text-sm py-1">
            {Object.values(errors).map((error, index) => (
              <p key={index}>{error.message}</p>
            ))}
          </div>
        )}
        {error && <div className="text-lg text-center">{error}</div>}
      </div>
    </div>
  )
}

export default Auth
