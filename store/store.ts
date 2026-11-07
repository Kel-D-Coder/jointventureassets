import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { persistReducer } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

/** localStorage in the browser; nothing on the server, where pages render signed out. */
const storage =
    typeof window === "undefined"
        ? { getItem: async () => null, setItem: async () => undefined, removeItem: async () => undefined }
        : createWebStorage("local");

const rootReducer = combineReducers({
    auth: authReducer
})

const persistConfig = {
    key: "root",
    storage,  
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const makestore = () => {
    return configureStore({
        reducer: persistedReducer,
        middleware: (getdefaultMiddleware) => getdefaultMiddleware({
            serializableCheck: false,
        })
    })
}

export type AppStore = ReturnType<typeof makestore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]
