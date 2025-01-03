import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ErrorState {
  [key: string]: string;
}

const initialState: ErrorState = {};

const errorSlice = createSlice({
  name: 'errors',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<{ field: string; message: string }>) => {
      state[action.payload.field] = action.payload.message;
    },
    clearError: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    clearAllErrors: () => initialState,
  },
});

export const { setError, clearError, clearAllErrors } = errorSlice.actions;
export default errorSlice.reducer; 