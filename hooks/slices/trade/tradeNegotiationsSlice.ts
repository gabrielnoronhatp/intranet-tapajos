import { apiInstance } from '@/app/service/apiInstance';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { INegociacaoVarejo, INegociacaoVarejoItem, INegociacaoEmpresa, INegociacaoProduto, IFilial, IProduto } from '@/types/Trade/TradeNegotiations/ITradeNegotiations';

export type { INegociacaoVarejo as INegotiationCampaign };
export type { INegociacaoVarejoItem as INegotiationItem };

export interface INegotiationCampaignRequest {
  descricao: string;
  data_inicial: string;
  data_final: string;
  usuario: string;
}

export interface INegotiationState {
  campaigns: INegociacaoVarejo[];
  currentCampaign: INegociacaoVarejo | null;
  items: INegociacaoVarejoItem[];
  empresas: INegociacaoEmpresa[];
  produtos: INegociacaoProduto[];
  filiais: IFilial[];
  produtosCatalogo: IProduto[];
  loading: boolean;
  error: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: INegotiationState = {
  campaigns: [],
  currentCampaign: null,
  items: [],
  empresas: [],
  produtos: [],
  filiais: [],
  produtosCatalogo: [],
  loading: false,
  error: null,
  status: 'idle'
};

// Buscar negociações
export const fetchNegotiationCampaigns = createAsyncThunk(
  'tradeNegotiations/fetchCampaigns',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiInstance.get('varejo/NegociacaoVarejo/');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || error.message);
      }
      throw error;
    }
  }
);

// Buscar filiais
export const fetchFiliais = createAsyncThunk(
  'tradeNegotiations/fetchFiliais',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiInstance.get('filiais/');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || error.message);
      }
      throw error;
    }
  }
);

// Buscar produtos
export const fetchProdutos = createAsyncThunk(
  'tradeNegotiations/fetchProdutos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiInstance.get('produtos/');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || error.message);
      }
      throw error;
    }
  }
);

// Buscar itens de uma negociação
export const fetchNegotiationItems = createAsyncThunk(
  'tradeNegotiations/fetchItems',
  async (negociacaoId: number, { rejectWithValue }) => {
    try {
      const response = await apiInstance.get(`varejo/NegociacaoVarejoItem/?id_negociacao=${negociacaoId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || error.message);
      }
      throw error;
    }
  }
);

// Buscar empresas de um item
export const fetchNegotiationEmpresas = createAsyncThunk(
  'tradeNegotiations/fetchEmpresas',
  async ({ negociacaoId, itemId }: { negociacaoId: number, itemId: number }, { rejectWithValue }) => {
    try {
      const response = await apiInstance.get(`varejo/NegociacaoVarejoEmpresa/?id_negociacao=${negociacaoId}&id_item=${itemId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || error.message);
      }
      throw error;
    }
  }
);

// Buscar produtos de um item
export const fetchNegotiationProdutos = createAsyncThunk(
  'tradeNegotiations/fetchProdutosItem',
  async ({ negociacaoId, itemId }: { negociacaoId: number, itemId: number }, { rejectWithValue }) => {
    try {
      const response = await apiInstance.get(`varejo/NegociacaoVarejoProduto/?id_negociacao=${negociacaoId}&id_item=${itemId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || error.message);
      }
      throw error;
    }
  }
);

export const fetchNegotiationCampaignById = createAsyncThunk(
  'tradeNegotiations/fetchCampaignById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await apiInstance.get(`varejo/NegociacaoVarejo/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || error.message);
      }
      throw error;
    }
  }
);

// Criar negociação
export const createNegotiationCampaign = createAsyncThunk(
  'tradeNegotiations/createCampaign',
  async (campaignData: INegotiationCampaignRequest, { rejectWithValue }) => {
    try {
      const response = await apiInstance.post('varejo/NegociacaoVarejo/', campaignData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || error.message);
      }
      throw error;
    }
  }
);

// Criar item
export const createNegotiationItem = createAsyncThunk(
  'tradeNegotiations/createItem',
  async (itemData: { id_negociacao: number, descricao: string }, { rejectWithValue }) => {
    try {
      const response = await apiInstance.post('varejo/NegociacaoVarejoItem/', itemData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || error.message);
      }
      throw error;
    }
  }
);

// Criar empresa
export const createNegotiationEmpresa = createAsyncThunk(
  'tradeNegotiations/createEmpresa',
  async (empresaData: INegociacaoEmpresa, { rejectWithValue }) => {
    try {
      const response = await apiInstance.post('varejo/NegociacaoVarejoEmpresa/', empresaData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || error.message);
      }
      throw error;
    }
  }
);

// Criar produto
export const createNegotiationProduto = createAsyncThunk(
  'tradeNegotiations/createProduto',
  async (produtoData: INegociacaoProduto, { rejectWithValue }) => {
    try {
      const response = await apiInstance.post('varejo/NegociacaoVarejoProduto/', produtoData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || error.message);
      }
      throw error;
    }
  }
);

export const updateNegotiationCampaign = createAsyncThunk(
  'tradeNegotiations/updateCampaign',
  async ({ id, data }: { id: number; data: Partial<INegotiationCampaignRequest> }, { rejectWithValue }) => {
    try {
      const response = await apiInstance.put(`varejo/NegociacaoVarejo/${id}`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || error.message);
      }
      throw error;
    }
  }
);

export const deleteNegotiationCampaign = createAsyncThunk(
  'tradeNegotiations/deleteCampaign',
  async (id: number, { rejectWithValue }) => {
    try {
      await apiInstance.delete(`varejo/NegociacaoVarejo/${id}`);
      return id;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || error.message);
      }
      throw error;
    }
  }
);

export const searchNegotiationCampaigns = createAsyncThunk(
  'tradeNegotiations/searchCampaigns',
  async (searchParams: {
    descricao?: string;
    data_inicial?: string;
    data_final?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await apiInstance.post('varejo/NegociacaoVarejo/search', searchParams);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || error.message);
      }
      throw error;
    }
  }
);

// Slice
const negotiationsSlice = createSlice({
  name: 'tradeNegotiations',
  initialState,
  reducers: {
    setCurrentCampaign: (state, action: PayloadAction<INegociacaoVarejo | null>) => {
      state.currentCampaign = action.payload;
    },
    clearErrors: (state) => {
      state.error = null;
    },
    addEmpresaLocal: (state, action: PayloadAction<INegociacaoEmpresa>) => {
      state.empresas.push(action.payload);
    },
    removeEmpresaLocal: (state, action: PayloadAction<number>) => {
      state.empresas = state.empresas.filter(empresa => empresa.id !== action.payload);
    },
    addProdutoLocal: (state, action: PayloadAction<INegociacaoProduto>) => {
      state.produtos.push(action.payload);
    },
    removeProdutoLocal: (state, action: PayloadAction<number>) => {
      state.produtos = state.produtos.filter(produto => produto.id !== action.payload);
    },
    resetLocalData: (state) => {
      state.empresas = [];
      state.produtos = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchNegotiationCampaigns
      .addCase(fetchNegotiationCampaigns.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
      })
      .addCase(fetchNegotiationCampaigns.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.campaigns = action.payload;
      })
      .addCase(fetchNegotiationCampaigns.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // fetchFiliais
      .addCase(fetchFiliais.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFiliais.fulfilled, (state, action) => {
        state.loading = false;
        state.filiais = action.payload;
      })
      .addCase(fetchFiliais.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetchProdutos
      .addCase(fetchProdutos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProdutos.fulfilled, (state, action) => {
        state.loading = false;
        state.produtosCatalogo = action.payload;
      })
      .addCase(fetchProdutos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetchNegotiationItems
      .addCase(fetchNegotiationItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNegotiationItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchNegotiationItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetchNegotiationEmpresas
      .addCase(fetchNegotiationEmpresas.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNegotiationEmpresas.fulfilled, (state, action) => {
        state.loading = false;
        state.empresas = action.payload;
      })
      .addCase(fetchNegotiationEmpresas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetchNegotiationProdutos
      .addCase(fetchNegotiationProdutos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNegotiationProdutos.fulfilled, (state, action) => {
        state.loading = false;
        state.produtos = action.payload;
      })
      .addCase(fetchNegotiationProdutos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // fetchNegotiationCampaignById
      .addCase(fetchNegotiationCampaignById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNegotiationCampaignById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCampaign = action.payload;
      })
      .addCase(fetchNegotiationCampaignById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // createNegotiationCampaign
      .addCase(createNegotiationCampaign.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNegotiationCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns.push(action.payload);
        state.currentCampaign = action.payload;
      })
      .addCase(createNegotiationCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // createNegotiationItem
      .addCase(createNegotiationItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNegotiationItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createNegotiationItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // createNegotiationEmpresa
      .addCase(createNegotiationEmpresa.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNegotiationEmpresa.fulfilled, (state, action) => {
        state.loading = false;
        state.empresas.push(action.payload);
      })
      .addCase(createNegotiationEmpresa.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // createNegotiationProduto
      .addCase(createNegotiationProduto.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNegotiationProduto.fulfilled, (state, action) => {
        state.loading = false;
        state.produtos.push(action.payload);
      })
      .addCase(createNegotiationProduto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // updateNegotiationCampaign
      .addCase(updateNegotiationCampaign.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateNegotiationCampaign.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.campaigns.findIndex(campaign => campaign.id === action.payload.id);
        if (index !== -1) {
          state.campaigns[index] = action.payload;
        }
        if (state.currentCampaign?.id === action.payload.id) {
          state.currentCampaign = action.payload;
        }
      })
      .addCase(updateNegotiationCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // deleteNegotiationCampaign
      .addCase(deleteNegotiationCampaign.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteNegotiationCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = state.campaigns.filter(campaign => campaign.id !== action.payload);
        if (state.currentCampaign?.id === action.payload) {
          state.currentCampaign = null;
        }
      })
      .addCase(deleteNegotiationCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // searchNegotiationCampaigns
      .addCase(searchNegotiationCampaigns.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
      })
      .addCase(searchNegotiationCampaigns.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.campaigns = action.payload;
      })
      .addCase(searchNegotiationCampaigns.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  setCurrentCampaign, 
  clearErrors, 
  addEmpresaLocal, 
  removeEmpresaLocal, 
  addProdutoLocal, 
  removeProdutoLocal,
  resetLocalData
} = negotiationsSlice.actions;

export default negotiationsSlice.reducer;
