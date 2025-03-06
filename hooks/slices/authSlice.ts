import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    isAuthenticated: boolean;
    user: null | {
        nome: string;
        email: string;
        username: string;
        profilePicture: any;
        accessToken: string;
    };
    accessToken: string | null;
    profilePicture: any;
    tokenTrade: string | null;
}

const loadInitialState = (): AuthState => {
    if (typeof window !== 'undefined') {
        const savedAuth = localStorage.getItem('auth');
        if (savedAuth) {
            return JSON.parse(savedAuth);
        }
    }
    return {
        isAuthenticated: false,
        user: null,
        accessToken: null,
        profilePicture: null,
        tokenTrade: null,
    };
};

const initialState: AuthState = loadInitialState();

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(
            state,
            action: PayloadAction<{
                nome: string;
                email: string;
                username: string;
                accessToken: string;
                profilePicture: any;
            }>
        ) {
            state.isAuthenticated = true;
            state.user = {
                nome: action.payload.nome,
                email: action.payload.email,
                username: action.payload.username,
                profilePicture: action.payload.profilePicture,
                accessToken: action.payload.accessToken,
            };
            state.accessToken = action.payload.accessToken;
            state.profilePicture = action.payload.profilePicture;

            if (typeof window !== 'undefined') {
                localStorage.setItem('auth', JSON.stringify(state));
            }
        },
        logout(state) {
            state.isAuthenticated = false;
            state.user = null;
            state.accessToken = null;
            state.profilePicture = null;
            console.log('logout');
            localStorage.removeItem('auth');

            if (typeof window !== 'undefined') {
                localStorage.removeItem('auth');
            }
        },
        setAuthenticated(state, action: PayloadAction<boolean>) {
            state.isAuthenticated = action.payload;
            if (!action.payload) {
                state.user = null;
                state.accessToken = null;
                state.profilePicture = null;
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('auth');
                }
            }
        },
        setUser(
            state,
            action: PayloadAction<{
                nome: string;
                email: string;
                username: string;
                profilePicture: any;
                accessToken: string;
            }>
        ) {
            state.user = action.payload;
            if (typeof window !== 'undefined') {
                localStorage.setItem('auth', JSON.stringify(state));
            }
        },
        setToken(state, action: PayloadAction<string>) {
            state.tokenTrade = action.payload;
        },
    },
});

export const { login, logout, setAuthenticated, setUser, setToken } = authSlice.actions;
export default authSlice.reducer;
