import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface ProgressState {
    searchValue: string
}

const initialState: ProgressState = {
    searchValue: ''
}

export const progressSlice = createSlice({
    name: 'progress',
    initialState,
    reducers: {
        setSearch(state, action: PayloadAction<string>) {
            state.searchValue = action.payload
        },
    },
})

export default progressSlice.reducer;
