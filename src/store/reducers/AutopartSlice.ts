import {IAutopart} from "../../models/models.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface AutopartState {
    autoparts: IAutopart[];
    autopart: IAutopart | null,
    isLoading: boolean;
    error: string;
    success: string;
    count: number;
    draftID: number;
}

const initialState: AutopartState = {
    autoparts: [],
    autopart: null,
    isLoading: false,
    error: '',
    success: '',
    count: 0.0,
    draftID: 0
}

export const autopartSlice = createSlice({
    name: 'autopart',
    initialState,
    reducers: {
        autopartsFetching(state) {
            state.isLoading = true
            state.error = ''
            state.success = ''
        },
        autopartsFetched(state, action: PayloadAction<[IAutopart[], number]>) {
            state.isLoading = false
            state.autoparts = action.payload[0]
            state.draftID = action.payload[1]
        },
        autopartsFetchedError(state, action: PayloadAction<string>) {
            state.isLoading = false
            state.error = action.payload
            state.success = ''
        },
        setDraft(state, action: PayloadAction<number>) {
            state.draftID = action.payload
        },
        autopartAddedIntoAssembly(state, action: PayloadAction<string[]>) {
            state.isLoading = false
            state.error = action.payload[0]
            state.success = action.payload[1]
        },
        autopartFetching(state) {
            state.isLoading = true
            state.error = ''
            state.success = ''
        },
        autopartFetched(state, action: PayloadAction<IAutopart>) {
            state.isLoading = false
            state.error = ''
            state.autopart = action.payload
        },
        autopartFetchedError(state, action: PayloadAction<string>) {
            state.isLoading = false
            state.error = action.payload
            state.autoparts = []
            state.autopart = null
        },
    },
})

export default autopartSlice.reducer;
