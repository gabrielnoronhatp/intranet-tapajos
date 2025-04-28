import { apiInstance } from '@/app/service/apiInstance';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';


export interface INegotiationCampaign {
  id: number;
  descricao: string;
  data_inicial: string;
  data_final: string;
  usuario: string;
  last_update: string;
}

export interface INegotiationCampaignRequest {
  descricao: string;
  data_inicial: string;
  data_final: string;
  usuario: string;
}

export interface INegotiationState {
  campaigns: INegotiationCampaign[];
  currentCampaign: INegotiationCampaign | null;
  loading: boolean;
  error: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: INegotiationState = {
  campaigns: [],
  currentCampaign: null,
  loading: false,
  error: null,
  status: 'idle'
};

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
    setCurrentCampaign: (state, action: PayloadAction<INegotiationCampaign | null>) => {
      state.currentCampaign = action.payload;
    },
    clearErrors: (state) => {
      state.error = null;
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
      })
      .addCase(createNegotiationCampaign.rejected, (state, action) => {
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

export const { setCurrentCampaign, clearErrors } = negotiationsSlice.actions;
export default negotiationsSlice.reducer;
