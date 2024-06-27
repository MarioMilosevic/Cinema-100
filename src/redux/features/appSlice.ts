import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState, NewUserType } from '../../utils/types'

const initialState: AppState = {
  hasAccount: true,
  globalUser: {
    name: '',
    lastName: '',
    email: '',
    password: '',
  },
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
  },
})

export const { toggleHasAccount, setGlobalUser } = appSlice.actions
export default appSlice.reducer
