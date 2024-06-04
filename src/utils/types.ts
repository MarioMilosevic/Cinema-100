import { ReactNode } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'

export type UserType = {
  email: string
  password: string
  name?: string
  lastName?: string
}

export type InputFieldProps = {
  type: string
  placeholder: string
  value: string | undefined
  changeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void
  zod: UseFormRegisterReturn
}

export type SingleMovieType = {
  rank: number
  title: string
  thumbnail: string
  rating: string
  id: string
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
