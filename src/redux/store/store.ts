import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../features/userSlice'
import moviesReducer from '../features/moviesSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    movies: moviesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
