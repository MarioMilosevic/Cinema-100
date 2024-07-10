import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SingleMovieType } from '../../utils/types'

type MoviesInitialState = {
  movies: SingleMovieType[]
}

const initialState: MoviesInitialState = {
  movies: [],
}

export const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    addMovies: (state, action: PayloadAction<SingleMovieType[]>) => {
      state.movies = action.payload
    },
  },
})

export const { addMovies } = moviesSlice.actions
export default moviesSlice.reducer
