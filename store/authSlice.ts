import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface User {
    id: string
    fullName: string
    email: string
    role: string
    category: string
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ user: User; token: string}>) => {
            state.user = action.payload.user
            state.isAuthenticated = true
            state.token = action.payload.token
        },
        logout: (state) => {
            state.user = null
            state.isAuthenticated = false
            state.token = null
        }
    }
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer