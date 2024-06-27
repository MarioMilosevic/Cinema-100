import { ReactNode } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'

export type UserType = {
  email: string
  password: string
}

export type NewUserType = {
  email: string
  password: string
  name: string
  lastName: string
  bookmarkedMovies: SingleMovieType[]
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
}

export type AppState = {
  hasAccount: boolean
  globalUser: NewUserType
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
  movies: SingleMovieType[]
  nextPage: () => Promise<void>
  previousPage: () => Promise<void>
  goToPage: (pageIndex: number) => Promise<void>
  pagesCount: number[]
  activePageIndex: number
}