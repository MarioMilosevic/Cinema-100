import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SingleMovieType } from '../../utils/types'

type MoviesInitialState = {
  movies: SingleMovieType[]
  trendingMovies: SingleMovieType[]
}

const initialState: MoviesInitialState = {
  movies: [],
  trendingMovies: [],
}

export const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setAllMovies: (state, action: PayloadAction<SingleMovieType[]>) => {
      state.movies = action.payload
    },
    setTrendingMovies: (state, action: PayloadAction<SingleMovieType[]>) => {
      state.trendingMovies = action.payload
    },
  },
})

export const { setAllMovies, setTrendingMovies } = moviesSlice.actions
export default moviesSlice.reducer
