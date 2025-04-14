import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ErrorState {
    formErrors: {
        ramo?: string;
        tipoLancamento?: string;
        selectedFilial?: string;
        selectedFornecedor?: string;
        notaFiscal?: string;
        serie?: string;
        dataEmissao?: string;
    };
    hasErrors: boolean;
}

const initialState: ErrorState = {
    formErrors: {},
    hasErrors: false,
};

const errorSlice = createSlice({
    name: 'error',
    initialState,
    reducers: {
        setFieldError: (
            state,
            action
        ) => {
            state.formErrors[action.payload.field] = action.payload.message;
            state.hasErrors = true;
        },
        // remove this any
        clearFieldError: (state: ErrorState, action: PayloadAction<string>) => {
            delete state.formErrors[action.payload];
            state.hasErrors = Object.keys(state.formErrors).length > 0;
        },
        clearAllErrors: (state: ErrorState) => {
            state.formErrors = {};
            state.hasErrors = false;
        },
    },
});

export const { setFieldError, clearFieldError, clearAllErrors } =
    errorSlice.actions;
export default errorSlice.reducer;
