import { ReactNode } from 'react'
import { DocumentData } from 'firebase/firestore'
import { UseFormRegisterReturn, UseFormRegister } from 'react-hook-form'
import { Dispatch } from 'redux'
import { NavigateFunction } from 'react-router-dom'
import { setGlobalUser } from '../redux/features/userSlice'
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
}

export type MovieCardProps = {
  image: string
  title: string
  year: number
  rating: string
  genre: string[]
  isBookmarked: boolean
  id: string
  size: keyof MovieCardSizeOptions
}

export type UserState = {
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
  setError: (error: string) => void
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

export type LogInProps = {
  user: UserType
  setUser: React.Dispatch<React.SetStateAction<UserType>>
  register: UseFormRegister<UserFormFormValues>
}

export type SignUpProps = {
  newUser: NewUserType
  setNewUser: React.Dispatch<React.SetStateAction<NewUserType>>
  register: UseFormRegister<UserFormFormValues>
}

export type MovieCardSizeOptions = {
  small: string
  big: string
}
