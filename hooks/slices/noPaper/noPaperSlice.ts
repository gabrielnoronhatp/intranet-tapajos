import api from '@/app/service/api';
import { NoPaperState } from '@/types/noPaper/Supplier/SupplierType';
import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';

const initialState: NoPaperState = {
    fornecedores: [],
    orderId: null,
    signatureNumber: null,
    filiais: [],
    searchQuery: '',
    contasGerenciais: [],
    centrosCustoOptions: [],
    loading: false,
    error: null,
};

export const fetchFornecedores = createAsyncThunk(
    'noPaper/fetchFornecedores',
    async (query: string = '') => {
        const sanitizedQuery = query.trim();

        const response = await api.get(`fornec_dist?q=${sanitizedQuery}`);
        return response.data;
    }
);

export const uploadFiles = createAsyncThunk(
    'noPaper/uploadFiles',
    async ({ opId, files }: { opId: string; files: File[] }) => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });

        const response = await api.post(`/upload/${opId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    }
);

export const fetchFiliais = createAsyncThunk(
    'noPaper/fetchFiliais',
    async ({ query, ramo }: { query: string; ramo: string }) => {
        const response = await api.get(`lojasgrupo?q=${query}&ramo=${ramo}`);
        return response.data;
    }
);

export const fetchContasGerenciais = createAsyncThunk(
    'noPaper/fetchContasGerenciais',
    async (query: string = '') => {
        const sanitizedQuery = query.trim();
        const response = await api.get(`dadoscontager`);
        return response.data;
    }
);

export const fetchCentrosCusto = createAsyncThunk(
    'noPaper/fetchCentrosCusto',
    async (query: string = '') => {
        const sanitizedQuery = query.trim();
        const response = await api.get(`dadosccusto?q=${sanitizedQuery}`);
        return response.data;
    }
);

export const setOrderId = createAction<number>('noPaper/setOrderId');
export const setSignatureNumber = createAction<number>(
    'noPaper/setSignatureNumber'
);

const noPaperSlice = createSlice({
    name: 'noPaper',
    initialState,
    reducers: {
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFornecedores.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchFornecedores.fulfilled, (state, action) => {
                state.loading = false;
                state.fornecedores = action.payload;
            })
            .addCase(fetchFornecedores.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.error.message || 'Failed to fetch fornecedores';
            })
            .addCase(fetchFiliais.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchFiliais.fulfilled, (state, action) => {
                state.loading = false;
                state.filiais = action.payload;
            })
            .addCase(fetchFiliais.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch filiais';
            })
            .addCase(fetchContasGerenciais.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchContasGerenciais.fulfilled, (state, action) => {
                state.loading = false;
                state.contasGerenciais = action.payload;
            })
            .addCase(fetchContasGerenciais.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.error.message || 'Failed to fetch contas gerenciais';
            })
            .addCase(fetchCentrosCusto.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCentrosCusto.fulfilled, (state, action) => {
                state.loading = false;
                state.centrosCustoOptions = action.payload;
            })
            .addCase(fetchCentrosCusto.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.error.message || 'Failed to fetch centros de custo';
            })
            .addCase(setOrderId, (state, action) => {
                state.orderId = action.payload;
            })
            .addCase(setSignatureNumber, (state, action) => {
                state.signatureNumber = action.payload;
            });
    },
});

export const { setSearchQuery } = noPaperSlice.actions;
export default noPaperSlice.reducer;
