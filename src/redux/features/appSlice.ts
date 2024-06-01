import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";


const initialState = {
    hasAccount : false
}

export const appSlice = createSlice({
    name:"app",
    initialState,
    reducers:{
        toggleHasAccount:(state, action:PayloadAction<boolean>) => {
            state.hasAccount = action.payload
        }
    }
})

export const {toggleHasAccount} = appSlice.actions;
export default appSlice.reducer