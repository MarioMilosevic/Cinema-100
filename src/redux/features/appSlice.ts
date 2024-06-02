import { createSlice } from "@reduxjs/toolkit";
// import { PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "../../utils/types";


const initialState: AppState = {
    hasAccount : true
}

export const appSlice = createSlice({
    name:"app",
    initialState,
    reducers:{
        toggleHasAccount:(state) => {
            state.hasAccount = !state.hasAccount
        }
    }
})

export const {toggleHasAccount} = appSlice.actions;
export default appSlice.reducer