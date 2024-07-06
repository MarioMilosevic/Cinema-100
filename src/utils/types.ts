import { ReactNode } from 'react'
import { DocumentData } from 'firebase/firestore'
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

export type GlobalUserType = {
  email: string
  password: string
  name: string
  lastName: string
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

export type MenuProps = {
  searchValue: string
  searchMovies: (e: React.ChangeEvent<HTMLInputElement>) => void
  searchGenre: (e: React.ChangeEvent<HTMLSelectElement>) => void
  genre: string
  bookmarkedPage: boolean
  setBookmarkedPage: (value: boolean) => void
}
