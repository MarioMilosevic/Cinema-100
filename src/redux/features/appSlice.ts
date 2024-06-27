import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState, NewUserType, SingleMovieType } from '../../utils/types'
import { initialNewUserState } from '../../utils/constants'

const initialState: AppState = {
  hasAccount: true,
  globalUser: initialNewUserState,
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleHasAccount: (state) => {
      state.hasAccount = !state.hasAccount
    },
    setGlobalUser: (state, action: PayloadAction<NewUserType>) => {
      state.globalUser = action.payload
    },
    logOutUser: (state) => {
      state.globalUser = initialNewUserState
    },
    addMovie: (state, action: PayloadAction<SingleMovieType>) => {
      state.globalUser.bookmarkedMovies.push(action.payload)
    },
    removeMovie: (state, action: PayloadAction<string>) => {
      state.globalUser.bookmarkedMovies =
        state.globalUser.bookmarkedMovies.filter(
          (movie) => movie.id !== action.payload,
        )
    },
  },
})

export const {
  toggleHasAccount,
  setGlobalUser,
  logOutUser,
  addMovie,
  removeMovie,
} = appSlice.actions
export default appSlice.reducer
