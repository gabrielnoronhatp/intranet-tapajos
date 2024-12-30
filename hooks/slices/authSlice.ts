import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: null | { name: string; email: string }; // Garante que `name` e `email` sejam `string`
  accessToken: string | null;
  profilePicture:any;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  profilePicture:null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{ name: string; email: string; accessToken: string,profilePicture:any }>
    ) {
      state.isAuthenticated = true;
      state.user = { name: action.payload.name, email: action.payload.email };
      state.accessToken = action.payload.accessToken;
      state.profilePicture =  action.payload.profilePicture;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
    },
  },
});

// Exporta as ações de login e logout
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
