import {IDeleteAutopartAssembly, IAssembly, IRequest} from "../../models/models.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface AssemblyState {
    assembly: IRequest | null;
    singleAssembly: IAssembly | null,
    isLoading: boolean;
    error: string;
    success: string;
}

const initialState: AssemblyState = {
    assembly: null,
    singleAssembly: null,
    isLoading: false,
    error: '',
    success: ''
}

export const assemblySlice = createSlice({
    name: 'assembly',
    initialState,
    reducers: {
        assembliesFetching(state) {
            state.isLoading = true
        },
        assembliesFetched(state, action: PayloadAction<IRequest>) {
            state.isLoading = false
            state.error = ''
            state.assembly = action.payload
        },
        assemblyFetched(state, action: PayloadAction<IAssembly>) {
            state.isLoading = false
            state.error = ''
            state.singleAssembly = action.payload
        },
        assembliesDeleteSuccess(state, action: PayloadAction<IDeleteAutopartAssembly>) {
            state.isLoading = false
            const text = action.payload.description ?? ""
            state.error = text
            state.success = "Компания успешно удалён из заявки"
        },
        assembliesUpdated(state, action: PayloadAction<string[]>) {
            state.isLoading = false
            state.error = action.payload[0]
            state.success = action.payload[1]
        },
        assembliesDeleteError(state, action: PayloadAction<string>) {
            state.isLoading = false
            state.error = action.payload
        },
        assembliesFetchedError(state, action: PayloadAction<string>) {
            state.isLoading = false
            state.error = action.payload
        },
    },
})

export default assemblySlice.reducer;
