import { configureStore } from '@reduxjs/toolkit';
import noPaperReducer from './slices/noPaperSlice';
import orderReducer from './slices/orderSlice';

const store = configureStore({
  reducer: {
    noPaper: noPaperReducer,
    order: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store; 