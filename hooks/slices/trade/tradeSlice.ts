import { apiInstance } from '@/app/service/apiInstance';
import { ICampaign, IEscala } from '@/types/Trade/ITrade';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

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
        { id, data }: { id: string; data: any },
        { dispatch, rejectWithValue }
    ) => {
        try {
            const currentCampaignResponse = await apiInstance.get(
                `/campanhas/${id}`
            );
            const currentCampaign = currentCampaignResponse.data;

            const campaignDataOnly = {
                nome: data.nome,
                filial: data.filial,
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
            console.log('Campanha atualizada com sucesso:', response.data);

            if (data.escala) {
                try {
                    const escalaWithCampaignId = data.escala.map(
                        (item: any) => ({
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
                    console.log('Escala atualizada com sucesso');
                } catch (error) {
                    console.error('Erro ao atualizar escala:', error);
                }
            }

            if (data.participantes && data.participantes.length > 0) {
                const newParticipants = data.participantes
                    .filter(
                        (p: any) =>
                            !currentCampaign.participantes.some(
                                (cp: any) =>
                                    cp.idparticipante === p.idparticipante
                            )
                    )
                    .map((participant: any) => {
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
                        console.log('Participantes adicionados com sucesso');
                    } catch (error) {
                        console.error(
                            'Erro ao adicionar participantes:',
                            error
                        );
                    }
                }
            }

            if (data.itens && data.itens.length > 0) {
                const newItems = data.itens
                    .filter(
                        (i: any) =>
                            !currentCampaign.itens.some(
                                (ci: any) => ci.iditem === i.iditem
                            )
                    )
                    .map((item: any) => {
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
                        console.log('Itens adicionados com sucesso');
                    } catch (error) {
                        console.error('Erro ao adicionar itens:', error);
                    }
                }
            }

            return response.data;
        } catch (error: any) {
            console.error('Erro ao atualizar campanha:', error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createCampaignParticipants = createAsyncThunk(
    'trade/createCampaignParticipants',
    async (
        {
            campaignId,
            participants,
        }: { campaignId: string; participants: any[] },
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

                console.log(
                    `Enviando participante para a campanha ${campaignId}:`,
                    participantWithCampaignId
                );

                const response = await apiInstance.post(
                    '/participantes',
                    participantWithCampaignId
                );
                results.push(response.data);
            }

            return results;
        } catch (error: any) {
            console.error('Erro ao criar participantes:', error);
            return rejectWithValue(error.response?.data || error.message);
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

            // Para cada item, fazer uma requisição separada
            for (const item of items) {
                const itemWithCampaignId = {
                    ...item,
                    idcampanha_distribuicao: parseInt(campaignId),
                    metrica: item.metrica || 'marca',
                };

                console.log(
                    `Enviando item para a campanha ${campaignId}:`,
                    itemWithCampaignId
                );

                const response = await apiInstance.post(
                    '/itens',
                    itemWithCampaignId
                );
                results.push(response.data);
            }

            return results;
        } catch (error: any) {
            console.error('Erro ao criar itens:', error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createCampaign = createAsyncThunk(
    'trade/createCampaign',
    async (data: any, { dispatch, rejectWithValue }) => {
        try {
            // Separar os dados da escala do resto dos dados da campanha
            const { escala, ...campaignData } = data;

            // Criar a campanha
            const response = await apiInstance.post(`campanhas`, campaignData);
            const campaignId = response.data.id;

            console.log('Campanha criada com ID:', campaignId);

            // Se houver participantes, cadastre-os
            if (data.participantes && data.participantes.length > 0) {
                try {
                    await dispatch(
                        createCampaignParticipants({
                            campaignId,
                            participants: data.participantes,
                        })
                    ).unwrap();
                    console.log('Participantes cadastrados com sucesso');
                } catch (error) {
                    console.error('Erro ao cadastrar participantes:', error);
                }
            }

            // Se houver itens, cadastre-os
            if (data.itens && data.itens.length > 0) {
                try {
                    await dispatch(
                        createCampaignItems({
                            campaignId,
                            items: data.itens,
                        })
                    ).unwrap();
                    console.log('Itens cadastrados com sucesso');
                } catch (error) {
                    console.error('Erro ao cadastrar itens:', error);
                }
            }

            // Se houver dados de escala, envie-os
            if (escala && escala.length > 0) {
                try {
                    // Não adicionar o campo idcampanha_distribuicao
                    const escalaWithCampaignId = escala.map((item: any) => ({
                        ...item,
                        id: parseInt(campaignId), // Usar apenas o campo id
                    }));

                    await dispatch(
                        sendMetaTable({
                            formattedMetas: escalaWithCampaignId,
                            isEditing: false,
                        })
                    ).unwrap();
                    console.log('Escala cadastrada com sucesso');
                } catch (error) {
                    console.error('Erro ao cadastrar escala:', error);
                }
            }

            setTimeout(() => {
                window.location.href = '/trade/list';
            }, 1000);

            return response.data;
        } catch (error: any) {
            console.error('Erro ao criar campanha:', error);
            return rejectWithValue(error.response?.data || error.message);
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

export const fetchProducts = createAsyncThunk(
    'trade/fetchProducts',
    async ({ productName, type }: { productName?: any; type: any }) => {
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
        } catch (error: any) {
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

export const fetchFiliais = createAsyncThunk(
    'trade/fetchFiliais',
    async (filter: string) => {
        try {
            const response = await apiInstance.get(`/filiais`);
            console.log(response);
            const data =
                typeof response.data === 'string'
                    ? JSON.parse(response.data)
                    : response.data;
            return data;
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                return console.error(
                    'Campanha não encontrada:',
                    error.response.data
                );
            }
            throw error;
        }
    }
);

export const deactivateCampaign = createAsyncThunk(
    'trade/deactivateCampaign',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await apiInstance.delete(`/campanhas/${id}`);
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                console.error('Campanha não encontrada:', error.response.data);
                return rejectWithValue(error.response.data);
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
            const data =
                typeof response.data === 'string'
                    ? JSON.parse(response.data)
                    : response.data;
            console.log('Dados recebidos:', data);

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
        } catch (error: any) {
            console.error('Error searching campaigns:', error);
            throw error;
        }
    }
);

export const sendMetaTable = createAsyncThunk(
    'trade/sendMetaTable',
    async (
        metaData: {
            formattedMetas: any[];
            campaignId?: string;
            isEditing?: boolean;
        },
        { rejectWithValue }
    ) => {
        try {
            const formattedData = metaData.formattedMetas;

            console.log('Enviando dados de meta formatados:', formattedData);

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
        } catch (error: any) {
            console.error('Error sending meta table:', error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteParticipant = createAsyncThunk(
    'trade/deleteParticipant',
    async (participantId: number, { rejectWithValue }) => {
        try {
            console.log(`Removendo participante com ID: ${participantId}`);
            const response = await apiInstance.delete(
                `/participantes/${participantId}`
            );
            console.log(
                'Resposta do servidor (remoção de participante):',
                response.data
            );
            return participantId;
        } catch (error: any) {
            console.error('Erro ao remover participante:', error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteItem = createAsyncThunk(
    'trade/deleteItem',
    async (itemId: number, { rejectWithValue }) => {
        try {
            console.log(`Removendo item com ID: ${itemId}`);
            const response = await apiInstance.delete(`/itens/${itemId}`);
            console.log(
                'Resposta do servidor (remoção de item):',
                response.data
            );
            return itemId;
        } catch (error: any) {
            console.error('Erro ao remover item:', error);
            return rejectWithValue(error.response?.data || error.message);
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
            console.log(
                `Removendo participante com ID: ${participantId} da campanha ${campaignId}`
            );
            const response = await apiInstance.delete(
                `participantes/${campaignId}/${participantId}`
            );
            console.log(
                'Resposta do servidor (remoção de participante):',
                response.data
            );

            return { campaignId, participantId };
        } catch (error: any) {
            console.error('Erro ao remover participante:', error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteItemFromCampaign = createAsyncThunk(
    'trade/deleteItemFromCampaign',
    async (
        { campaignId, itemId }: { campaignId: string; itemId: number },
        { rejectWithValue }
    ) => {
        try {
            console.log(
                `Removendo item com ID: ${itemId} da campanha ${campaignId}`
            );
            const response = await apiInstance.delete(
                `itens/${campaignId}/${itemId}`
            );
            console.log(
                'Resposta do servidor (remoção de item):',
                response.data
            );
            return { campaignId, itemId };
        } catch (error: any) {
            console.error('Erro ao remover item:', error);
            return rejectWithValue(error.response?.data || error.message);
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
    escala: [] as IEscala[],
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
            })
            .addCase(fetchProductsByType.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.products = action.payload;
                console.log('Produtos atualizados:', state.products); // Adicione este log
            })
            .addCase(searchCampaigns.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(searchCampaigns.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.campaigns = action.payload;
            })
            .addCase(searchCampaigns.rejected, (state: any, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(sendMetaTable.fulfilled, (state, action) => {
                console.log('Meta table sent successfully:', action.payload);
            })
            .addCase(sendMetaTable.rejected, (state: any, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(deleteParticipant.fulfilled, (state, action) => {
                // Se estivermos editando uma campanha, atualize a lista de participantes
                if (state.currentCampaign.participantes) {
                    state.currentCampaign.participantes =
                        state.currentCampaign.participantes.filter(
                            (p: any) => p.id !== action.payload
                        );
                }
            })
            .addCase(deleteParticipant.rejected, (state: any, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(deleteItem.fulfilled, (state, action) => {
                if (state.currentCampaign.itens) {
                    state.currentCampaign.itens =
                        state.currentCampaign.itens.filter(
                            (i: any) => i.id !== action.payload
                        );
                }
            })
            .addCase(deleteItem.rejected, (state: any, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(
                deleteParticipantFromCampaign.fulfilled,
                (state, action) => {
                    const { campaignId, participantId } = action.payload;
                    if (state.currentCampaign.id === campaignId) {
                        state.currentCampaign.participantes =
                            state.currentCampaign.participantes.filter(
                                (p: any) => p.id !== participantId
                            );
                    }
                }
            )
            .addCase(deleteItemFromCampaign.fulfilled, (state, action) => {
                const { campaignId, itemId } = action.payload;
                if (state.currentCampaign.id === campaignId) {
                    state.currentCampaign.itens =
                        state.currentCampaign.itens.filter(
                            (i: any) => i.id !== itemId
                        );
                }
            });
    },
});

export const { updateField, setUserLanc, setCurrentCampaign } =
    tradeSlice.actions;
export default tradeSlice.reducer;
