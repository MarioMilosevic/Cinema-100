import { ReactNode } from 'react'
import { DocumentData } from 'firebase/firestore'
import { UseFormRegisterReturn } from 'react-hook-form'
import { Dispatch } from 'redux'
import { NavigateFunction } from 'react-router-dom'
import { setGlobalUser } from '../redux/features/appSlice'
import { UserFormFormValues } from './zod'

export type UserType = {
  email: string
  password: string
}

export type NewUserType = {
  email: string | undefined
  password: string | undefined
  name: string | undefined
  lastName: string | undefined
  bookmarkedMovies: SingleMovieType[]
}

export type GlobalUserType = {
  email: string | undefined
  password: string | undefined
  name: string | undefined
  lastName: string | undefined
  bookmarkedMovies: SingleMovieType[]
  id: string
}

export type InputFieldProps = {
  type: string
  placeholder: string
  value: string | undefined
  changeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void
  zod: UseFormRegisterReturn
}

export type SingleMovieType = {
  id: string
  rank: number
  title: string
  thumbnail: string
  rating: string
  year: number
  image: string
  description: string
  trailer: string
  genre: string[]
  director: string[]
  writers: string[]
  imdbid: string
  isBookmarked: boolean
  firebaseId: string
}

export type AppState = {
  hasAccount: boolean
  globalUser: GlobalUserType
}

export type PageButtonProps = {
  children: ReactNode
  clickHandler: () => void
  isActive: keyof PageButtonOptions
}

export type PageButtonOptions = {
  true: string
  false: string
}

export type AllMoviesProps = {
  bookmarkedMovies: SingleMovieType[]
  movies: SingleMovieType[]
  setMovies: React.Dispatch<React.SetStateAction<SingleMovieType[]>>
  bookmarkedPage: boolean
  setBookmarkedPage: React.Dispatch<React.SetStateAction<boolean>>
  firstVisible: DocumentData | null
  setFirstVisible: React.Dispatch<React.SetStateAction<DocumentData | null>>
  lastVisible: DocumentData | null
  setLastVisible: React.Dispatch<React.SetStateAction<DocumentData | null>>
  fetchInitialMovies: () => Promise<void>
}

export type BookmarkedMoviesProps = {
  bookmarkedPage: boolean
  setBookmarkedPage: (page: boolean) => void
  bookmarkedMovies: SingleMovieType[]
}

export type SliderProps = {
  bookmarkedMovies: SingleMovieType[]
  trendingMovies: SingleMovieType[]
}

export type MenuProps = {
  searchValue: string
  searchMovies: (e: React.ChangeEvent<HTMLInputElement>) => void
  searchGenre: (e: React.ChangeEvent<HTMLSelectElement>) => void
  genre: string
  bookmarkedPage: boolean
  setBookmarkedPage: (value: boolean) => void
}

export type CreateUserProps = {
  data: UserFormFormValues
  dispatch: Dispatch
  navigate: NavigateFunction
  setGlobalUser: typeof setGlobalUser
  setNewUser: (newUser: NewUserType) => void
}

export type SignInUserProps = {
  data: UserFormFormValues
  dispatch: Dispatch
  navigate: NavigateFunction
  setGlobalUser: typeof setGlobalUser
}

export type SignInGuestProps = {
  dispatch: Dispatch
  navigate: NavigateFunction
  setGlobalUser: typeof setGlobalUser
}

export type SignOutUserProps = {
  dispatch: Dispatch
  globalUser: GlobalUserType
}
