import api from '@/app/service/api';
import { NoPaperState } from '@/types/noPaper/Supplier/SupplierType';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';



const initialState: NoPaperState = {
  fornecedores: [],
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
    files.forEach(file => {
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




export const fetchFiliais = createAsyncThunk('noPaper/fetchFiliais', async () => {
  const response = await api.get('dadoslojas');
  return response.data;
});

export const fetchContasGerenciais = createAsyncThunk(
  'noPaper/fetchContasGerenciais',
  async (query: string = '') => {
    const sanitizedQuery = query.trim();
    const response = await api.get(`dadoscontager?q=${sanitizedQuery}`);
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


const noPaperSlice = createSlice({
  name: 'noPaper',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    }
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
      })
    
  },
});

export const { setSearchQuery } = noPaperSlice.actions;
export default noPaperSlice.reducer; 