import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TokenState {
    token: string | null;
}

const initialState: TokenState = {
    token: null,
};

const tokenSlice = createSlice({
    name: 'token',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            localStorage.setItem('tokenTrade', action.payload); // Armazena no localStorage
        },
        clearToken: (state) => {
            state.token = null;
            localStorage.removeItem('tokenTrade'); // Remove do localStorage
        },
    },
});

export const { setToken, clearToken } = tokenSlice.actions;
export default tokenSlice.reducer;
