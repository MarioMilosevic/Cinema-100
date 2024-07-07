import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState, GlobalUserType } from '../../utils/types'
import { initialGlobalUserState } from '../../utils/constants'

const initialState: AppState = {
  hasAccount: true,
  globalUser: initialGlobalUserState,
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleHasAccount: (state) => {
      state.hasAccount = !state.hasAccount
    },
    setGlobalUser: (state, action: PayloadAction<GlobalUserType>) => {
      state.globalUser = action.payload
    },
    logOutUser: (state) => {
      state.globalUser = initialGlobalUserState
    },
    // addMovie: (state, action: PayloadAction<SingleMovieType>) => {
    //   state.globalUser.bookmarkedMovies.push(action.payload)
    // },
    // removeMovie: (state, action: PayloadAction<string>) => {
    //   state.globalUser.bookmarkedMovies =
    //     state.globalUser.bookmarkedMovies.filter(
    //       (movie) => movie !== action.payload,
    //     )
    // },
  },
})

export const {
  toggleHasAccount,
  setGlobalUser,
  logOutUser,
  // addMovie,
  // removeMovie,
} = appSlice.actions
export default appSlice.reducer
