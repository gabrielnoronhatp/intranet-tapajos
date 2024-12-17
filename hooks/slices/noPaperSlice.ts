import api from '@/app/service/api';
import { NoPaperState } from '@/types/Supplier/SupplierType';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';




const initialState: NoPaperState = {
  fornecedores: [],
  filiais: [],
  contasGerenciais: [],
  centrosCustoOptions: [],
  loading: false,
  error: null,
};


export const fetchFornecedores = createAsyncThunk('noPaper/fetchFornecedores', async () => {
  const response = await api.get('fornec_dist?q=1');
  return response.data;
});

export const fetchFiliais = createAsyncThunk('noPaper/fetchFiliais', async () => {
  const response = await api.get('dadoslojas');
  return response.data;
});

export const fetchContasGerenciais = createAsyncThunk('noPaper/fetchContasGerenciais', async () => {
  const response = await api.get('dadoscontager');
  return response.data;
});

export const fetchCentrosCusto = createAsyncThunk('noPaper/fetchCentrosCusto', async () => {
  const response = await api.get('dadosccusto');
  return response.data;
});


const noPaperSlice = createSlice({
  name: 'noPaper',
  initialState,
  reducers: {},
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
        state.error = action.error.message || 'Failed to fetch fornecedores';
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
        state.error = action.error.message || 'Failed to fetch contas gerenciais';
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
        state.error = action.error.message || 'Failed to fetch centros de custo';
      });
  },
});

export default noPaperSlice.reducer; 