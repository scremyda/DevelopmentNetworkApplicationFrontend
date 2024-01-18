import {combineReducers, configureStore} from "@reduxjs/toolkit";
import autopartReducer from "./reducers/AutopartSlice.ts"
import assemblyReducer from "./reducers/AssemblySlice.ts"
import userReducer from "./reducers/UserSlice.ts"
import progressReducer from "./reducers/ProgressData.ts";

const rootReducer = combineReducers({
    autopartReducer,
    assemblyReducer,
    userReducer,
    progressReducer
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
