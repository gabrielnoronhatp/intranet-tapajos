import { configureStore } from '@reduxjs/toolkit';
import noPaperReducer from './slices/noPaperSlice';
import orderReducer from './slices/orderSlice';
import authReducer from './slices/authSlice'
import errorReducer from './slices/errorSlice'
const store = configureStore({
  reducer: {
    noPaper: noPaperReducer,
    order: orderReducer,
    auth:authReducer,
    error: errorReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store; 