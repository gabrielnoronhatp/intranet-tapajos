import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: null | { name: any; email: string, profilePicture: any , accessToken: string};
  accessToken: string | null;
  profilePicture: any;
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
    profilePicture: null
  };
};

const initialState: AuthState = loadInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{ name: string; email: string; accessToken: string; profilePicture: any }>
    ) {
      state.isAuthenticated = true;
      state.user = { name: action.payload.name, email: action.payload.email, profilePicture: action.payload.profilePicture, accessToken: action.payload.accessToken };
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
    setUser(state, action: PayloadAction<{ name: string; email: string, profilePicture: any, accessToken: string   }>) {
      state.user = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth', JSON.stringify(state));
      }
    },
  },
});

export const { login, logout, setAuthenticated, setUser } = authSlice.actions;
export default authSlice.reducer;
