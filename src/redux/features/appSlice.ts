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
  },
})

export const { toggleHasAccount, setGlobalUser, logOutUser } = appSlice.actions
export default appSlice.reducer
