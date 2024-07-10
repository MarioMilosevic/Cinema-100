import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserState, GlobalUserType, SingleMovieType } from '../../utils/types'
import { initialGlobalUserState } from '../../utils/constants'

const initialState: UserState = {
  hasAccount: true,
  globalUser: initialGlobalUserState,
}

export const userSlice = createSlice({
  name: 'user',
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

export const { toggleHasAccount, setGlobalUser, logOutUser, addMovie, removeMovie } = userSlice.actions
export default userSlice.reducer
