import { apiInstance } from '@/app/service/apiInstance';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import {
    INegociacaoVarejo,
    INegociacaoVarejoItem,
    INegociacaoEmpresa,
    INegociacaoProduto,
    IFilial,
    IProduto,
    
} from '@/types/Trade/TradeNegotiations/ITradeNegotiations';
import { api } from '@/app/service/api';

export type { INegociacaoVarejo as INegotiationCampaign };
export type { INegociacaoVarejoItem as INegotiationItem };

export interface INegotiationCampaignRequest {
    descricao: string;
    data_inicial: string;
    data_final: string;
    usuario: string;
}

export interface ICadastroItensObjetoRequest {
    descricao: string;
    sigla: string;
    usuario: string;
}

export interface ICadastroItensObjeto {
    id: number;
    descricao: string;
    sigla: string;
    usuario: string;
}

export interface INegotiationItemRequest {
    id_negociacao: number;
    id_objeto: number;
    descricao: string;
}

export interface INegociacaoContato {
    id?: number;
    id_negociacao: number;
    nome: string;
    email: string;
    telefone: string;
}

export interface INegotiationState {
    campaigns: INegociacaoVarejo[];
    currentCampaign: INegociacaoVarejo | null;
    items: INegociacaoVarejoItem[];
    empresas: INegociacaoEmpresa[];
    produtos: INegociacaoProduto[];
    contatos: INegociacaoContato[];
    filiais: IFilial[];
    produtosCatalogo: IProduto[];
    itensObjeto: ICadastroItensObjeto[];
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
    contatos: [],
    filiais: [],
    produtosCatalogo: [],
    itensObjeto: [],
    loading: false,
    error: null,
    status: 'idle',
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
            const response = await api.get(`todaslojasgrupo/`);
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
    async (busca: string, { rejectWithValue }) => {
        try {
            const response = await apiInstance.post('busca_produtos', {
                busca,
            });
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
            console.log(
                'Chamando fetchNegotiationItems para o ID:',
                negociacaoId
            );
            const response = await apiInstance.get(
                `varejo/NegociacaoVarejoItem/${negociacaoId}`
            );
            console.log('Resposta de fetchNegotiationItems:', response.data);

            // Garantir que retornamos sempre um array, mesmo se a API retornar um único objeto
            const data = response.data;
            return Array.isArray(data) ? data : data ? [data] : [];
        } catch (error) {
            console.error('Erro em fetchNegotiationItems:', error);
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
    async (
        negociacaoId: number,
        { rejectWithValue }
    ) => {
        try {
            console.log(
                'Chamando fetchNegotiationEmpresas para negociação:',
                negociacaoId
            );
            const response = await apiInstance.get(
                `varejo/NegociacaoVarejoEmpresa/${negociacaoId}`
            );
            console.log('Resposta de fetchNegotiationEmpresas:', response.data);

            // Garantir que retornamos sempre um array, mesmo se a API retornar um único objeto
            const data = response.data;
            return Array.isArray(data) ? data : data ? [data] : [];
        } catch (error) {
            console.error('Erro em fetchNegotiationEmpresas:', error);
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data || error.message);
            }
            throw error;
        }
    }
);

export const fetchNegotiationProdutos = createAsyncThunk(
    'tradeNegotiations/fetchProdutosItem',
    async (
        negociacaoId: number,
        { rejectWithValue }
    ) => {
        try {
            console.log(
                'Chamando fetchNegotiationProdutos para negociação:',
                negociacaoId
            );
            const response = await apiInstance.get(
                `varejo/NegociacaoVarejoProduto/${negociacaoId}`
            );
            console.log('Resposta de fetchNegotiationProdutos:', response.data);

            // Garantir que retornamos sempre um array, mesmo se a API retornar um único objeto
            const data = response.data;
            return Array.isArray(data) ? data : data ? [data] : [];
        } catch (error) {
            console.error('Erro em fetchNegotiationProdutos:', error);
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
            console.log('Chamando fetchNegotiationCampaignById para o ID:', id);
            const response = await apiInstance.get(
                `varejo/NegociacaoVarejo/${id}`
            );
            console.log(
                'Resposta de fetchNegotiationCampaignById:',
                response.data
            );
            return response.data;
        } catch (error) {
            console.error('Erro em fetchNegotiationCampaignById:', error);
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
            const response = await apiInstance.post(
                'varejo/NegociacaoVarejo/',
                campaignData
            );
            setTimeout(() => {
                window.location.href = '/tradeNegotiations/list';
            }, 1000);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data || error.message);
            }
            throw error;
        }
    }
);

export const createNegotiationItem = createAsyncThunk(
    'tradeNegotiations/createItem',
    async (itemData: INegotiationItemRequest, { rejectWithValue }) => {
        try {
            const response = await apiInstance.post(
                'varejo/NegociacaoVarejoItem/',
                itemData
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data || error.message);
            }
            throw error;
        }
    }
);

export const createNegotiationEmpresa = createAsyncThunk(
    'tradeNegotiations/createEmpresa',
    async (empresaData: INegociacaoEmpresa, { rejectWithValue }) => {
        try {
            const response = await apiInstance.post(
                'varejo/NegociacaoVarejoEmpresa/',
                empresaData
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data || error.message);
            }
            throw error;
        }
    }
);

export const createNegotiationProduto = createAsyncThunk(
    'tradeNegotiations/createProduto',
    async (produtoData: INegociacaoProduto, { rejectWithValue }) => {
        try {
            const response = await apiInstance.post(
                'varejo/NegociacaoVarejoProduto/',
                produtoData
            );
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
    async (
        {
            id,
            data,
        }: { id: number; data: Partial<INegotiationCampaignRequest> },
        { rejectWithValue }
    ) => {
        try {
            const response = await apiInstance.put(
                `varejo/NegociacaoVarejo/${id}`,
                data
            );
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
    async (
        searchParams: {
            descricao?: string;
            data_inicial?: string;
            data_final?: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await apiInstance.post(
                'varejo/NegociacaoVarejo/search',
                searchParams
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data || error.message);
            }
            throw error;
        }
    }
);

export const fetchItensObjeto = createAsyncThunk(
    'tradeNegotiations/fetchItensObjeto',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiInstance.get(
                'varejo/NegociacaoVarejoObjeto/'
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data || error.message);
            }
            throw error;
        }
    }
);

export const createItemObjeto = createAsyncThunk(
    'tradeNegotiations/createItemObjeto',
    async (itemData: ICadastroItensObjetoRequest, { rejectWithValue }) => {
        try {
            const response = await apiInstance.post(
                'varejo/NegociacaoVarejoObjeto/',
                itemData
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data || error.message);
            }
            throw error;
        }
    }
);

export const createNegotiationContato = createAsyncThunk(
    'tradeNegotiations/createContato',
    async (contatoData: INegociacaoContato, { rejectWithValue }) => {
        try {
            const response = await apiInstance.post(
                'varejo/NegociacaoVarejoContato/',
                contatoData
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data || error.message);
            }
            throw error;
        }
    }
);

export const fetchNegotiationContatos = createAsyncThunk(
    'tradeNegotiations/fetchContatos',
    async (negociacaoId: number, { rejectWithValue }) => {
        try {
            console.log(
                'Chamando fetchNegotiationContatos para o ID:',
                negociacaoId
            );
            const response = await apiInstance.get(
                `varejo/NegociacaoVarejoContato/?id_negociacao=${negociacaoId}`
            );
            console.log('Resposta de fetchNegotiationContatos:', response.data);

            // Garantir que retornamos sempre um array, mesmo se a API retornar um único objeto
            const data = response.data;
            return Array.isArray(data) ? data : data ? [data] : [];
        } catch (error) {
            console.error('Erro em fetchNegotiationContatos:', error);
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data || error.message);
            }
            throw error;
        }
    }
);

export const fetchNegotiationObjetoById = createAsyncThunk(
    'tradeNegotiations/fetchObjetoById',
    async (negociacaoId: number, { rejectWithValue }) => {
        try {
            const response = await apiInstance.get(
                `varejo/NegociacaoVarejoObjeto/${negociacaoId}`
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data || error.message);
            }
            throw error;
        }
    }
);

export const fetchNegotiationEmpresasById = createAsyncThunk(
    'tradeNegotiations/fetchEmpresasById',
    async (negociacaoId: number, { rejectWithValue }) => {
        try {
            const response = await apiInstance.get(
                `varejo/NegociacaoVarejoEmpresa/${negociacaoId}`
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data || error.message);
            }
            throw error;
        }
    }
);

export const fetchNegotiationItemsById = createAsyncThunk(
    'tradeNegotiations/fetchItemsById',
    async (negociacaoId: number, { rejectWithValue }) => {
        try {
            const response = await apiInstance.get(
                `varejo/NegociacaoVarejoItem/${negociacaoId}`
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data || error.message);
            }
            throw error;
        }
    }
);

export const fetchNegotiationProdutosById = createAsyncThunk(
    'tradeNegotiations/fetchProdutosById',
    async (negociacaoId: number, { rejectWithValue }) => {
        try {
            const response = await apiInstance.get(
                `varejo/NegociacaoVarejo/${negociacaoId}`
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data || error.message);
            }
            throw error;
        }
    }
);

export const fetchNegotiationById = createAsyncThunk(
    'tradeNegotiations/fetchNegotiationById',
    async (negociacaoId: number, { rejectWithValue }) => {
        try {
            const response = await apiInstance.get(
                `varejo/NegociacaoVarejo/${negociacaoId}`
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data || error.message);
            }
            throw error;
        }
    }
);

// Adicionar thunks para deleção
export const deleteNegotiationEmpresa = createAsyncThunk(
    'tradeNegotiations/deleteEmpresa',
    async (id: number, { rejectWithValue }) => {
        try {
            await apiInstance.delete(`varejo/NegociacaoVarejoEmpresa/${id}`);
            return id;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data || error.message);
            }
            throw error;
        }
    }
);

export const deleteNegotiationProduto = createAsyncThunk(
    'tradeNegotiations/deleteProduto',
    async (id: number, { rejectWithValue }) => {
        try {
            await apiInstance.delete(`varejo/NegociacaoVarejoProduto/${id}`);
            return id;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data || error.message);
            }
            throw error;
        }
    }
);

export const deleteNegotiationContato = createAsyncThunk(
    'tradeNegotiations/deleteContato',
    async (id: number, { rejectWithValue }) => {
        try {
            await apiInstance.delete(`varejo/NegociacaoVarejoContato/${id}`);
            return id;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data || error.message);
            }
            throw error;
        }
    }
);

const negotiationsSlice = createSlice({
    name: 'tradeNegotiations',
    initialState,
    reducers: {
        setCurrentCampaign: (
            state,
            action: PayloadAction<INegociacaoVarejo | null>
        ) => {
            state.currentCampaign = action.payload;
        },
        clearErrors: (state) => {
            state.error = null;
        },
        addEmpresaLocal: (state, action: PayloadAction<INegociacaoEmpresa>) => {
            // Verifica se já existe uma empresa com o mesmo id_empresa para o mesmo id_item
            const existe = state.empresas.some(
                (empresa) =>
                    empresa.id_item === action.payload.id_item &&
                    empresa.id_empresa === action.payload.id_empresa
            );
            if (!existe) {
                console.log('Adicionando empresa local:', action.payload);
                const newEmpresa = {
                    ...action.payload,
                    id: action.payload.id || Math.floor(Math.random() * -10000), // ID negativo temporário
                };
                state.empresas.push(newEmpresa);
            } else {
                console.log('Empresa já existe localmente para este item:', action.payload);
            }
        },
        removeEmpresaLocal: (state, action: PayloadAction<number>) => {
            state.empresas = state.empresas.filter(
                (empresa) => empresa.id !== action.payload
            );
        },
        addProdutoLocal: (state, action: PayloadAction<INegociacaoProduto>) => {
            // Verifica se já existe um produto com o mesmo id_produto para o mesmo id_item
            const existe = state.produtos.some(
                (produto) =>
                    produto.id_item === action.payload.id_item &&
                    produto.id_produto === action.payload.id_produto
            );
            if (!existe) {
                console.log('Adicionando produto local:', action.payload);
                const newProduto = {
                    ...action.payload,
                    id: action.payload.id || Math.floor(Math.random() * -10000), // ID negativo temporário
                };
                state.produtos.push(newProduto);
            } else {
                console.log('Produto já existe localmente para este item:', action.payload);
            }
        },
        removeProdutoLocal: (state, action: PayloadAction<number>) => {
            state.produtos = state.produtos.filter(
                (produto) => produto.id !== action.payload
            );
        },
        addContatoLocal: (state, action: PayloadAction<INegociacaoContato>) => {
            state.contatos.push(action.payload);
        },
        removeContatoLocal: (state, action: PayloadAction<number>) => {
            state.contatos = state.contatos.filter(
                (_, index) => index !== action.payload
            );
        },
        resetLocalData: (state) => {
            state.empresas = [];
            state.produtos = [];
            state.contatos = [];
        },
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
            .addCase(
                fetchNegotiationCampaignById.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.currentCampaign = action.payload;
                }
            )
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
                const index = state.campaigns.findIndex(
                    (campaign) => campaign.id === action.payload.id
                );
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
                state.campaigns = state.campaigns.filter(
                    (campaign) => campaign.id !== action.payload
                );
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
            })

            // fetchItensObjeto
            .addCase(fetchItensObjeto.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchItensObjeto.fulfilled, (state, action) => {
                state.loading = false;
                state.itensObjeto = action.payload;
            })
            .addCase(fetchItensObjeto.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // createItemObjeto
            .addCase(createItemObjeto.pending, (state) => {
                state.loading = true;
            })
            .addCase(createItemObjeto.fulfilled, (state, action) => {
                state.loading = false;
                state.itensObjeto.push(action.payload);
            })
            .addCase(createItemObjeto.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // createNegotiationContato
            .addCase(createNegotiationContato.pending, (state) => {
                state.loading = true;
            })
            .addCase(createNegotiationContato.fulfilled, (state, action) => {
                state.loading = false;
                state.contatos.push(action.payload);
            })
            .addCase(createNegotiationContato.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // fetchNegotiationContatos
            .addCase(fetchNegotiationContatos.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNegotiationContatos.fulfilled, (state, action) => {
                state.loading = false;
                state.contatos = action.payload;
            })
            .addCase(fetchNegotiationContatos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // fetchNegotiationObjetoById
            .addCase(fetchNegotiationObjetoById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNegotiationObjetoById.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(fetchNegotiationObjetoById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchNegotiationEmpresasById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNegotiationEmpresasById.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(fetchNegotiationEmpresasById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchNegotiationItemsById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNegotiationItemsById.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(fetchNegotiationItemsById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchNegotiationProdutosById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNegotiationProdutosById.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(fetchNegotiationProdutosById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchNegotiationById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNegotiationById.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(fetchNegotiationById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Adicionar casos para novas funções de deleção
            .addCase(deleteNegotiationEmpresa.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteNegotiationEmpresa.fulfilled, (state, action) => {
                state.loading = false;
                state.empresas = state.empresas.filter(
                    (empresa) => empresa.id !== action.payload
                );
            })
            .addCase(deleteNegotiationEmpresa.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(deleteNegotiationProduto.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteNegotiationProduto.fulfilled, (state, action) => {
                state.loading = false;
                state.produtos = state.produtos.filter(
                    (produto) => produto.id !== action.payload
                );
            })
            .addCase(deleteNegotiationProduto.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(deleteNegotiationContato.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteNegotiationContato.fulfilled, (state, action) => {
                state.loading = false;
                state.contatos = state.contatos.filter(
                    (contato) => contato.id !== action.payload
                );
            })
            .addCase(deleteNegotiationContato.rejected, (state, action) => {
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
    addContatoLocal,
    removeContatoLocal,
    resetLocalData,
} = negotiationsSlice.actions;

export default negotiationsSlice.reducer;
