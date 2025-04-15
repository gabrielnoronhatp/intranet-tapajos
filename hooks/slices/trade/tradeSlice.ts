import { apiInstance } from '@/app/service/apiInstance';
import { IFilial } from '@/types/noPaper/Supplier/SupplierType';
import { IEscala } from '@/types/Trade/IEscala';
import { IProduct } from '@/types/Trade/IProduct';
import { IParticipants } from '@/types/Trade/IParticipants';
import { ICampaign } from '@/types/Trade/ICampaign';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCampaigns = createAsyncThunk(
    'trade/fetchCampaigns',
    async () => {
        const response = await apiInstance.get(`/campanhas`);
        return response.data;
    }
);

export const fetchCampaignById = createAsyncThunk(
    'trade/fetchCampaignById',
    async (id: string) => {
        const response = await apiInstance.get(`/campanhas/${id}`);
        return response.data;
    }
);

export const updateCampaign = createAsyncThunk(
    'trade/updateCampaign',
    async (
        { id, data }: { id: string; data: ICampaign },
        { dispatch, rejectWithValue }
    ) => {
        try {
            const currentCampaignResponse = await apiInstance.get(
                `/campanhas/${id}`
            );
            const currentCampaign = currentCampaignResponse.data;

            const campaignDataOnly = {
                nome: data.nome,
                idempresa: data.idempresa,
                datalanc: data.datalanc,
                userlanc: data.userlanc,
                datainicial: data.datainicial,
                datafinal: data.datafinal,
                valor_total: data.valor_total,
                status: data.status,
            };

            const response = await apiInstance.put(
                `/campanhas/${id}`,
                campaignDataOnly
            );

            if (data.escala) {
                try {
                    const escalaWithCampaignId = data.escala.map(
                        (item: IEscala) => ({
                            ...item,
                            id: parseInt(id),
                        })
                    );

                    await dispatch(
                        sendMetaTable({
                            formattedMetas: escalaWithCampaignId,
                            isEditing: true,
                        })
                    ).unwrap();
                } catch (error) {
                    console.error('Erro ao atualizar escala:', error);
                }
            }

            if (data.participantes && data.participantes.length > 0) {
                const newParticipants = data.participantes
                    .filter(
                        (p: IParticipants) =>
                            !currentCampaign.participantes.some(
                                (cp: IParticipants) =>
                                    cp.idparticipante === p.idparticipante
                            )
                    )
                    .map((participant: IParticipants) => {
                        return {
                            ...participant,
                            nome: participant.nome,
                            meta: participant.meta || 'VALOR',
                            meta_valor: participant.meta_valor,
                            meta_quantidade: participant.meta_quantidade,
                            idparticipante: participant.idparticipante,
                            premiacao: String(participant.premiacao),
                        };
                    });

                if (newParticipants.length > 0) {
                    try {
                        await dispatch(
                            createCampaignParticipants({
                                campaignId: id,
                                participants: newParticipants,
                            })
                        ).unwrap();
                    } catch (error) {
                        console.error(
                            'Erro ao adicionar participantes:',
                            error
                        );
                    }
                }
            }

            if (data.itens && data.itens.length > 0) {
                const newItems:any = data.itens
                    .filter(
                        (i: IProduct) =>
                            !currentCampaign.itens.some(
                                (ci: IProduct) => ci.iditem === i.iditem
                            )
                    )
                    .map((item: IProduct) => {
                        return {
                            ...item,
                            iditem: item.iditem,
                            nome: item.nome,
                            metrica: item.metrica || 'marca',
                        };
                    });

                if (newItems.length > 0) {
                    try {
                        await dispatch(
                            createCampaignItems({
                                campaignId: id,
                                items: newItems,
                            })
                        ).unwrap();
                    } catch (error) {
                        console.error('Erro ao adicionar itens:', error);
                    }
                }
            }
            setTimeout(() => {
                window.location.href = '/trade/list';
            }, 1000);

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data || error.message);
            }
        }
    }
);

export const createCampaignParticipants = createAsyncThunk(
    'trade/createCampaignParticipants',
    async (
        {
            campaignId,
            participants,
        }: { campaignId: string; participants: IParticipants[] },
        { rejectWithValue }
    ) => {
        try {
            const results = [];

            // Para cada participante, fazer uma requisição separada
            for (const participant of participants) {
                const participantWithCampaignId = {
                    ...participant,
                    idcampanha_distribuicao: parseInt(campaignId),
                    meta: participant.meta || 'VALOR',
                };

                const response = await apiInstance.post(
                    '/participantes',
                    participantWithCampaignId
                );
                results.push(response.data);
            }

            return results;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data || error.message);
            }
        }
    }
);

export const createCampaignItems = createAsyncThunk(
    'trade/createCampaignItems',
    async (
        { campaignId, items }: { campaignId: string; items: any[] },
        { rejectWithValue }
    ) => {
        try {
            const results = [];

            for (const item of items) {
                const itemWithCampaignId = {
                    ...item,
                    idcampanha_distribuicao: parseInt(campaignId),
                    metrica: item.metrica || 'marca',
                };

                const response = await apiInstance.post(
                    '/itens',
                    itemWithCampaignId
                );
                results.push(response.data);
            }

            return results;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data || error.message);
            }
        }
    }
);

export const createCampaign = createAsyncThunk(
    'trade/createCampaign',
    async (data: ICampaign, { dispatch, rejectWithValue }) => {
        try {
            const { escala, ...campaignData } = data;

            const response = await apiInstance.post(`campanhas`, campaignData);
            const campaignId = response.data.id;

            if (data.participantes && data.participantes.length > 0) {
                try {
                    await dispatch(
                        createCampaignParticipants({
                            campaignId,
                            participants: data.participantes,
                        })
                    ).unwrap();
                } catch (error) {
                    console.error('Erro ao cadastrar participantes:', error);
                }
            }

            if (data.itens && data.itens.length > 0) {
                try {
                    await dispatch(
                        createCampaignItems({
                            campaignId,
                            items: data.itens,
                        } as any)
                    ).unwrap();
                } catch (error) {
                    console.error('Erro ao cadastrar itens:', error);
                }
            }

            if (escala && escala.length > 0) {
                try {
                    const escalaWithCampaignId = escala.map(
                        (item: IEscala) => ({
                            ...item,
                            id: parseInt(campaignId),
                        })
                    );

                    await dispatch(
                        sendMetaTable({
                            formattedMetas: escalaWithCampaignId,
                            isEditing: false,
                        })
                    ).unwrap();
                } catch (error) {
                    console.error('Erro ao cadastrar escala:', error);
                }
            }

            setTimeout(() => {
                window.location.href = '/trade/list';
            }, 1000);

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data || error.message);
            }
        }
    }
);

export const deleteCampaign = createAsyncThunk(
    'trade/deleteCampaign',
    async (id: string) => {
        await apiInstance.delete(`/campanhas/${id}`);
        return id;
    }
);

type ProductName = string;
type Type = 'produto' | 'marca';

export const fetchProducts = createAsyncThunk(
    'trade/fetchProducts',
    async ({ productName, type }: { productName: ProductName; type: Type }) => {
        try {
            const url = productName
                ? `/api/products?name=${encodeURIComponent(productName)}&type=${type}`
                : '/api/products';
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            return data;
        } catch (error: unknown) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }
);

export const fetchOperators = createAsyncThunk(
    'trade/fetchOperators',
    async (
        { busca, type }: { busca: string; type: 'operador' | 'vendedor' },
        { rejectWithValue }
    ) => {
        try {
            const endpoint =
                type === 'operador' ? '/busca_operadores' : '/busca_vendedores';

            const response = await apiInstance.post(endpoint, { busca });
            const data =
                typeof response.data === 'string'
                    ? JSON.parse(response.data)
                    : response.data;
            return data;
        } catch (error) {
            console.error(`Error fetching ${type}s:`, error);
            return rejectWithValue(error);
        }
    }
);

export const fetchFiliais = createAsyncThunk('trade/fetchFiliais', async () => {
    try {
        const response = await apiInstance.get(`/filiais`);

        const data =
            typeof response.data === 'string'
                ? JSON.parse(response.data)
                : response.data;
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error;
        }
    }
});

export const deactivateCampaign = createAsyncThunk(
    'trade/deactivateCampaign',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await apiInstance.delete(`/campanhas/${id}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data || error.message);
            }

            throw error;
        }
    }
);

export const fetchProductsByType = createAsyncThunk(
    'trade/fetchProductsByType',
    async (
        { busca, type }: { busca: string; type: 'produto' | 'marca' },
        { rejectWithValue }
    ) => {
        try {
            const endpoint =
                type === 'produto' ? '/busca_produtos' : '/busca_marcas';
            const response = await apiInstance.post(endpoint, { busca });
            const data = JSON.parse(response.data);

            console.log('data produtos', data);
            return data;
        } catch (error) {
            console.error(`Error fetching ${type}s:`, error);
            return rejectWithValue(error);
        }
    }
);

export const searchCampaigns = createAsyncThunk(
    'trade/searchCampaigns',
    async (searchParams: {
        nome?: string;
        datainicial?: string;
        datafinal?: string;
    }) => {
        try {
            const response = await apiInstance.post(
                '/campanhas/pesquisa',
                searchParams
            );
            return response.data;
        } catch (error: unknown) {
            console.error('Error searching campaigns:', error);
            throw error;
        }
    }
);

export const sendMetaTable = createAsyncThunk(
    'trade/sendMetaTable',
    async (
        metaData: {
            formattedMetas: IEscala[];
            campaignId?: string;
            isEditing?: boolean;
        },
        { rejectWithValue }
    ) => {
        try {
            const formattedData = metaData.formattedMetas;

            let response;
            if (metaData.isEditing) {
                response = await apiInstance.put(
                    `/campanha_distribuicao_escala/${formattedData[0].id}`,
                    formattedData
                );
            } else {
                response = await apiInstance.post(
                    '/campanha_distribuicao_escala',
                    formattedData
                );
            }

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data || error.message);
            }
            throw error;
        }
    }
);

export const deleteParticipant = createAsyncThunk(
    'trade/deleteParticipant',
    async (participantId: number, { rejectWithValue }) => {
        try {
            await apiInstance.delete(`/participantes/${participantId}`);

            return participantId;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data || error.message);
            }
            throw error;
        }
    }
);

export const deleteItem = createAsyncThunk(
    'trade/deleteItem',
    async (itemId: number, { rejectWithValue }) => {
        try {
            const response = await apiInstance.delete(`/itens/${itemId}`);
            console.log('', response.data);
            return itemId;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data || error.message);
            }
            throw error;
        }
    }
);

export const deleteParticipantFromCampaign = createAsyncThunk(
    'trade/deleteParticipantFromCampaign',
    async (
        {
            campaignId,
            participantId,
        }: { campaignId: string; participantId: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await apiInstance.delete(
                `participantes/${campaignId}/${participantId}`
            );
            console.log('', response.data);

            return { campaignId, participantId };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data || error.message);
            }
            throw error;
        }
    }
);

export const deleteItemFromCampaign = createAsyncThunk(
    'trade/deleteItemFromCampaign',
    async (
        { campaignId, id }: { campaignId: string; id: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await apiInstance.delete(
                `itens/${campaignId}/${id}`
            );
            console.log('', response.data);
            return { campaignId, id };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data || error.message);
            }
            throw error;
        }
    }
);

export const cloneCampaign = createAsyncThunk(
    'trade/cloneCampaign',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await apiInstance.get(`/campanhas_clone/${id}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data || error.message);
            }
            throw error;
        }
    }
);

const initialState: any = {
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
    filiais: [] as IFilial[],
    escala: [] as IEscala[],
};

const tradeSlice = createSlice({
    name: 'trade',
    initialState,
    reducers: {
        updateField: (
            state: ICampaign,
            action: PayloadAction<{
                field: keyof ICampaign;
                value: string | number;
            }>
        ) => {
            const { field, value } = action.payload;
            state[field] = value as never;
        },
        setUserLanc: (state: ICampaign, action: PayloadAction<string>) => {
            state.userlanc = action.payload;
        },
        setCurrentCampaign: (
            state: ICampaign,
            action: PayloadAction<Partial<ICampaign>>
        ) => {
            state.currentCampaign = {
                ...state.currentCampaign,
                ...action.payload,
            } as any    ;
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
            .addCase(fetchCampaigns.rejected, (state: ICampaign) => {
                state.status = 'failed';
            })
            .addCase(updateCampaign.fulfilled, (state, action) => {
                state.campaigns = state.campaigns.map((campaign: ICampaign) =>
                    campaign.id === action.payload.id
                        ? action.payload
                        : campaign
                );
            })
            .addCase(createCampaign.fulfilled, (state: ICampaign, action) => {
                state.campaigns.push(action.payload);
            })
            .addCase(deleteCampaign.fulfilled, (state: ICampaign, action) => {
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
            .addCase(fetchProducts.rejected, (state: ICampaign) => {
                state.status = 'failed';
            })
            .addCase(fetchOperators.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOperators.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.operators = action.payload;
            })
            .addCase(fetchOperators.rejected, (state: ICampaign) => {
                state.status = 'failed';
            })
            .addCase(fetchFiliais.fulfilled, (state, action) => {
                state.filiais = action.payload;
            })
            .addCase(deactivateCampaign.fulfilled, (state, action) => {
                const index = state.campaigns.findIndex(
                    (campaign: ICampaign) => campaign.id === action.payload.id
                );
                if (index !== -1) {
                    state.campaigns[index].status = 'desativado';
                }
            })
            .addCase(deactivateCampaign.rejected, (state: ICampaign) => {
                state.status = 'failed';
            })
            .addCase(fetchCampaignById.fulfilled, (state, action) => {
                state.currentCampaign = action.payload;
            })
            .addCase(fetchProductsByType.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.products = action.payload;
            })
            .addCase(searchCampaigns.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(searchCampaigns.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.campaigns = action.payload;
            })
            .addCase(searchCampaigns.rejected, (state: ICampaign) => {
                state.status = 'failed';
            })
            .addCase(sendMetaTable.fulfilled, () => {})
            .addCase(sendMetaTable.rejected, (state: ICampaign) => {
                state.status = 'failed';
            })
            .addCase(
                deleteParticipant.fulfilled,
                (state: any, action) => {
                    // Se estivermos editando uma campanha, atualize a lista de participantes
                    if (state.currentCampaign.participantes) {
                        state.currentCampaign.participantes =
                            state.currentCampaign.participantes.filter(
                                (p: IParticipants) => p.id !== action.payload
                            );
                    }
                }
            )
            .addCase(deleteParticipant.rejected, (state: ICampaign, action) => {
                state.status = 'failed';
            })
            .addCase(deleteItem.fulfilled, (state, action) => {
                if (state.currentCampaign.itens) {
                    state.currentCampaign.itens =
                        state.currentCampaign.itens.filter(
                            (i: IProduct) => i.id !== action.payload
                        );
                }
            })
            .addCase(deleteItem.rejected, (state: any, action) => {
                state.status = 'failed' as never;
            })
            .addCase(
                deleteParticipantFromCampaign.fulfilled,
                (state: any, action) => {
                    const { campaignId, participantId } = action.payload;
                    if (state.currentCampaign.id === campaignId) {
                        state.currentCampaign.participantes =
                            state.currentCampaign.participantes.filter(
                                (p: IParticipants) => p.id !== participantId
                            );
                    }
                }
            )
            .addCase(
                deleteItemFromCampaign.fulfilled,
                (state: any, action) => {
                    const { campaignId, id } = action.payload;
                    if (state.currentCampaign.id === campaignId) {
                        state.currentCampaign.itens =
                            state.currentCampaign.itens.filter(
                                (i: IProduct) => i.id !== id
                            );
                    }
                }
            )
            .addCase(cloneCampaign.fulfilled, (state: ICampaign, action) => {
                if (action.payload) {
                    state.campaigns = [...state.campaigns, action.payload];
                }
            });
    },
});

export const { updateField, setUserLanc, setCurrentCampaign } =
    tradeSlice.actions;
export default tradeSlice.reducer;
