import { apiCampaing } from '@/app/service/apiInstance';
import useTokenRefresh from '@/hooks/useTokenRefresh';
import { ICampaign } from '@/types/Trade/ITrade';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create a function to get API instance only when needed
const getApiInstance = async () => {
  if (typeof window !== 'undefined') {
    const { apiCampaing } = await import('@/app/service/apiInstance');
    return apiCampaing;
  }
  return null;
};

export const fetchCampaigns = createAsyncThunk(
    'trade/fetchCampaigns',
    async (_, { rejectWithValue }) => {
        try {
            const api = await getApiInstance();
            if (!api) return rejectWithValue('API not available');
            
            const response = await api.get(`/campanhas`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchCampaignById = createAsyncThunk(
    'trade/fetchCampaignById',
    async (id: string, { rejectWithValue }) => {
        try {
            const api = await getApiInstance();
            if (!api) return rejectWithValue('API not available');
            
            const response = await api.get(`/campanhas/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const updateCampaign = createAsyncThunk(
    'trade/updateCampaign',
    async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
        try {
            const api = await getApiInstance();
            if (!api) return rejectWithValue('API not available');
            
            const response = await api.put(`/campanhas/${id}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const createCampaign = createAsyncThunk(
    'trade/createCampaign',
    async (data: any, { rejectWithValue }) => {
        try {
            const api = await getApiInstance();
            if (!api) return rejectWithValue('API not available');
            
            const response = await api.post(`campanhas`, data);
            
            if (typeof window !== 'undefined') {
                setTimeout(() => {
                    window.location.href = '/trade/list';
                }, 1000);
            }
            
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.status === 422) {
                console.error('Erro de validação:', error.response.data);
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error);
        }
    }
);

export const deleteCampaign = createAsyncThunk(
    'trade/deleteCampaign',
    async (id: string, { rejectWithValue }) => {
        try {
            const api = await getApiInstance();
            if (!api) return rejectWithValue('API not available');
            
            await api.delete(`/campanhas/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchProducts = createAsyncThunk(
    'trade/fetchProducts',
    async ({ productName, type }: { productName?: string; type: string }, { rejectWithValue }) => {
        try {
            const api = await getApiInstance();
            if (!api) return rejectWithValue('API not available');
            
            const url = productName
                ? `/produtos?busca=${encodeURIComponent(productName)}&tipo=${type}`
                : '/produtos';
                
            const response = await api.get(url);
            return response.data;
        } catch (error: any) {
            console.error('Error fetching products:', error);
            return rejectWithValue(error);
        }
    }
);

export const fetchOperators = createAsyncThunk(
    'trade/fetchOperators',
    async ({ productName, type }: { productName?: string; type: string }) => {
        const url = productName
            ? `/api/operators?name=${encodeURIComponent(productName)}&type=${type}`
            : '/api/operators';
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch operators');
        }
        const data = await response.json();
        return data;
    }
);

export const fetchFiliais = createAsyncThunk(
    'trade/fetchFiliais',
    async (filter: string) => {
        const response = await axios.get(`/api/filiais?filter=${filter}`);
        return response.data;
    }
);

export const deactivateCampaign = createAsyncThunk(
    'trade/deactivateCampaign',
    async (id: string, { rejectWithValue }) => {
        try {
            const api = await getApiInstance();
            if (!api) return rejectWithValue('API not available');
            
            const response = await api.delete(`/campanhas/${id}`);
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                console.error('Campanha não encontrada:', error.response.data);
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error);
        }
    }
);

const initialState: ICampaign = {
    nome: '',
    datainicial: '',
    datafinal: '',
    valor_total: 0,
    userlanc: '',
    datalanc: '',
    status: '',
    products: [],
    operators: [],
    campaigns: [],
    currentCampaign: {} as ICampaign,
    filiais: [] as any,
};

const tradeSlice = createSlice({
    name: 'trade',
    initialState,
    reducers: {
        updateField: (state: any, action: any) => {
            const { field, value } = action.payload;
            state[field] = value;
        },
        setUserLanc: (state, action) => {
            state.userlanc = action.payload;
        },
        setCurrentCampaign: (state, action) => {
            state.currentCampaign = {
                ...state.currentCampaign,
                ...action.payload,
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCampaigns.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCampaigns.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.campaigns = action.payload;
            })
            .addCase(fetchCampaigns.rejected, (state: any, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateCampaign.fulfilled, (state, action) => {
                state.campaigns = state.campaigns.map((campaign: any) =>
                    campaign.id === action.payload.id
                        ? action.payload
                        : campaign
                );
            })
            .addCase(createCampaign.fulfilled, (state: any, action) => {
                state.campaigns.push(action.payload);
            })
            .addCase(deleteCampaign.fulfilled, (state: any, action) => {
                state.campaigns = state.campaigns.filter(
                    (campaign: any) => campaign.id !== action.payload
                );
            })
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state: any, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchOperators.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOperators.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.operators = action.payload;
            })
            .addCase(fetchOperators.rejected, (state: any, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchFiliais.fulfilled, (state, action) => {
                state.filiais = action.payload;
            })
            .addCase(deactivateCampaign.fulfilled, (state, action) => {
                const index = state.campaigns.findIndex(
                    (campaign: any) => campaign.id === action.payload.id
                );
                if (index !== -1) {
                    state.campaigns[index].status = 'desativado';
                }
            })
            .addCase(deactivateCampaign.rejected, (state: any, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchCampaignById.fulfilled, (state, action) => {
                state.currentCampaign = action.payload;
            });
    },
});

export const { updateField, setUserLanc, setCurrentCampaign } =
    tradeSlice.actions;
export default tradeSlice.reducer;
