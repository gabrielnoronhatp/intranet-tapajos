import { configureStore } from '@reduxjs/toolkit';
import noPaperReducer from './slices/noPaper/noPaperSlice';
import orderReducer from './slices/noPaper/orderSlice';
import authReducer from './slices/authSlice';
import errorReducer from './slices/noPaper/errorSlice';
import contractReducer from './slices/contracts/contractSlice';
import tradeReducer from './slices/trade/tradeSlice';
import tokenReducer from './slices/token/tokenSlice';
const store = configureStore({
    reducer: {
        noPaper: noPaperReducer,
        order: orderReducer,
        auth: authReducer,
        error: errorReducer,
        contracts: contractReducer,
        trade: tradeReducer,
        token: tokenReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
