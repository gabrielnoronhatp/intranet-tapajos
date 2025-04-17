import { configureStore } from '@reduxjs/toolkit';
import noPaperReducer from './slices/noPaper/noPaperSlice';
import orderReducer from './slices/noPaper/orderSlice';
import authReducer from './slices/authSlice';

import contractReducer from './slices/contracts/contractSlice';
import tradeReducer from './slices/trade/tradeSlice';
import tokenReducer from './slices/token/tokenSlice';
import vacancyReducer from './slices/vacancySlice';

const store = configureStore({
    reducer: {
        noPaper: noPaperReducer,
        order: orderReducer,
        auth: authReducer,
        contracts: contractReducer,
        trade: tradeReducer,
        token: tokenReducer,
        vacancy: vacancyReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['vacancy/createVacancy/pending', 'vacancy/updateVacancy/pending'],
                ignoredPaths: ['vacancy.fileUpload'],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
