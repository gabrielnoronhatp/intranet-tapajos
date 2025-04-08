import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Vacancy, CreateVacancyPayload } from '@/types/vacancy/IVacancy';

// Interfaces para candidatos
interface Candidate {
    id: string;
    cpf: string;
    nome_completo: string;
    email: string;
    telefone: string;
    is_primeiraexperiencia: boolean;
    is_disponivel: string;
    file_perfil: string;
    file_cv?: string;
    is_analizado: boolean;
}

interface CandidateAnalysis {
    score: string;
    cv_resumo: string;
}

export interface CandidateWithAnalysis {
    candidate: Candidate;
    analise: CandidateAnalysis;
}

interface VacancyState {
    vacancies: Vacancy[];
    loading: boolean;
    error: string | null;
    currentVacancy: Vacancy | null;
    candidates: CandidateWithAnalysis[];
    candidatesLoading: boolean;
    departments: string[];
    departmentsLoading: boolean;
    positions: string[];
    positionsLoading: boolean;
}

const initialState: VacancyState = {
    vacancies: [],
    loading: false,
    error: null,
    currentVacancy: null,
    candidates: [],
    candidatesLoading: false,
    departments: [],
    departmentsLoading: false,
    positions: [],
    positionsLoading: false,
};

const API_URL = 'https://api.rh.grupotapajos.com.br';

export const fetchVacancies = createAsyncThunk(
    'vacancy/fetchVacancies',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState() as {
                auth: { accessToken: string | null };
            };

            if (!auth.accessToken) {
                return rejectWithValue('Token de autenticação não encontrado');
            }

            const response = await axios.get(`${API_URL}/vagas`, {
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`,
                },
            });

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const fetchVacancyById = createAsyncThunk(
    'vacancy/fetchVacancyById',
    async (id: string, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState() as {
                auth: { accessToken: string | null };
            };

            if (!auth.accessToken) {
                return rejectWithValue('Token de autenticação não encontrado');
            }

            const response = await axios.get(`${API_URL}/vagas/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`,
                },
            });

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const createVacancy = createAsyncThunk(
    'vacancy/createVacancy',
    async (
        vacancyData: CreateVacancyPayload,
        { getState, rejectWithValue }
    ) => {
        try {
            const { auth } = getState() as {
                auth: {
                    accessToken: string | null;
                    user: {
                        nome: string;
                        username: string;
                    } | null;
                };
            };

            if (!auth.accessToken) {
                return rejectWithValue('Token de autenticação não encontrado');
            }

            const dataWithCreator = {
                ...vacancyData,
                criado_por: auth.user?.username || 'Usuário não identificado',
                departamento_vaga: vacancyData.departamento_vaga || '',
                requisitos: vacancyData.requisitos || '',
                diferencial: vacancyData.diferencial || '',
                nome_vaga: vacancyData.nome_vaga || '',
                limit_candidatos: vacancyData.limit_candidatos || 1,
                data_inicial:
                    vacancyData.data_inicial ||
                    new Date().toISOString().split('T')[0],
                isInternalSelection:
                    vacancyData.isInternalSelection !== undefined
                        ? vacancyData.isInternalSelection
                        : false,
            };

            if (dataWithCreator.imagem_capa) {
                const formData = new FormData();

                Object.entries(dataWithCreator).forEach(([key, value]) => {
                    if (key === 'imagem_capa' && value instanceof File) {
                        formData.append('imagem_capa', value);
                    } else if (value !== undefined && value !== null) {
                        formData.append(key, String(value));
                    }
                });

                const requiredFields = [
                    'departamento_vaga',
                    'requisitos',
                    'nome_vaga',
                    'diferencial',
                    'limit_candidatos',
                    'data_inicial',
                    'isInternalSelection',
                ];
                requiredFields.forEach((field) => {
                    if (!formData.has(field)) {
                        formData.append(
                            field,
                            String(
                                dataWithCreator[
                                    field as keyof typeof dataWithCreator
                                ] || ''
                            )
                        );
                    }
                });

                const response = await axios.post(
                    `${API_URL}/vagas`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${auth.accessToken}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );

                return response.data;
            } else {
                const response = await axios.post(
                    `${API_URL}/vagas`,
                    dataWithCreator,
                    {
                        headers: {
                            Authorization: `Bearer ${auth.accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                return response.data;
            }
        } catch (error: any) {
            console.error(
                'Erro ao criar vaga:',
                error.response?.data || error.message
            );
            return rejectWithValue(
                error.response?.data?.detail ||
                    error.response?.data?.message ||
                    'Erro ao criar vaga'
            );
        }
    }
);

export const updateVacancy = createAsyncThunk(
    'vacancy/updateVacancy',
    async (
        { id, data }: { id: string; data: Partial<CreateVacancyPayload> },
        { getState, rejectWithValue }
    ) => {
        try {
            const { auth } = getState() as {
                auth: { accessToken: string | null };
            };

            if (!auth.accessToken) {
                return rejectWithValue('Token de autenticação não encontrado');
            }

            const formData = new FormData();

            Object.entries(data).forEach(([key, value]) => {
                if (key === 'imagem_capa' && value instanceof File) {
                    formData.append('imagem_capa', value);
                } else if (value !== undefined && value !== null) {
                    formData.append(key, String(value));
                }
            });

            if (data.departamento_vaga === '')
                formData.set('departamento_vaga', ' ');
            if (data.requisitos === '') formData.set('requisitos', ' ');
            if (data.diferencial === '') formData.set('diferencial', ' ');
            if (data.nome_vaga === '') formData.set('nome_vaga', ' ');

            console.log(
                'Enviando dados para atualização:',
                Object.fromEntries(formData.entries())
            );

            const response = await axios.put(
                `${API_URL}/vagas/${id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${auth.accessToken}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            return response.data;
        } catch (error: any) {
            console.error(
                'Erro ao atualizar vaga:',
                error.response?.data || error.message
            );
            return rejectWithValue(
                error.response?.data?.detail ||
                    error.response?.data?.message ||
                    'Erro ao atualizar vaga'
            );
        }
    }
);

export const deleteVacancy = createAsyncThunk(
    'vacancy/deleteVacancy',
    async (id: string, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState() as {
                auth: { accessToken: string | null };
            };

            if (!auth.accessToken) {
                return rejectWithValue('Token de autenticação não encontrado');
            }

            await axios.delete(`${API_URL}/vagas/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`,
                },
            });

            return id;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Erro ao excluir vaga'
            );
        }
    }
);

// Thunk para buscar candidatos de uma vaga específica
export const fetchVacancyCandidates = createAsyncThunk(
    'vacancy/fetchVacancyCandidates',
    async (vacancyId: string, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState() as {
                auth: { accessToken: string | null };
            };

            if (!auth.accessToken) {
                return rejectWithValue('Token de autenticação não encontrado');
            }

            const response = await axios.get(
                `${API_URL}/candidatos/${vacancyId}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.accessToken}`,
                    },
                }
            );

            return response.data;
        } catch (error: any ) {
            console.error(
                'Erro ao buscar candidatos:',
                error.response?.data || error.message
            );
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const fetchDepartments = createAsyncThunk(
    'vacancy/fetchDepartments',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState() as {
                auth: { accessToken: string | null };
            };

            if (!auth.accessToken) {
                return rejectWithValue('Token de autenticação não encontrado');
            }

            const response = await axios.get(`${API_URL}/cargos`, {
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`,
                },
            });

            // Aqui estamos assumindo que a API retorna uma lista de strings (cargos)
            // Vamos usar uma lista de departamentos padrão, já que a API não fornece departamentos
            const defaultDepartments = [
                'TI',
                'RH',
                'Financeiro',
                'Comercial',
                'Marketing',
                'Logística',
                'Jurídico',
            ];

            // Armazenar os cargos para uso futuro
            const positions = response.data;

            return {
                departments: defaultDepartments,
                positions: positions,
            };
        } catch (error) {
            console.error(
                'Erro ao buscar departamentos e cargos:',
                error.response?.data || error.message
            );
            return rejectWithValue(
                error.response?.data?.message ||
                    'Erro ao buscar departamentos e cargos'
            );
        }
    }
);

const vacancySlice = createSlice({
    name: 'vacancy',
    initialState,
    reducers: {
        clearCurrentVacancy(state) {
            state.currentVacancy = null;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchVacancies.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchVacancies.fulfilled, (state, action) => {
            state.loading = false;
            state.vacancies = action.payload;
        });
        builder.addCase(fetchVacancies.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        builder.addCase(fetchVacancyById.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchVacancyById.fulfilled, (state, action) => {
            state.loading = false;
            state.currentVacancy = action.payload;
        });
        builder.addCase(fetchVacancyById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        builder.addCase(createVacancy.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(createVacancy.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload) {
                state.vacancies = [...state.vacancies, action.payload];
            }
        });
        builder.addCase(createVacancy.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        builder.addCase(updateVacancy.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateVacancy.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload) {
                const index = state.vacancies.findIndex(
                    (v) => v.id === action.payload.id
                );
                if (index !== -1) {
                    const updatedVacancies = [...state.vacancies];
                    updatedVacancies[index] = action.payload;
                    state.vacancies = updatedVacancies;
                }

                if (state.currentVacancy?.id === action.payload.id) {
                    state.currentVacancy = action.payload;
                }
            }
        });
        builder.addCase(updateVacancy.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        builder.addCase(deleteVacancy.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(deleteVacancy.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload) {
                state.vacancies = state.vacancies.filter(
                    (v) => v.id !== action.payload
                );

                if (state.currentVacancy?.id === action.payload) {
                    state.currentVacancy = null;
                }
            }
        });
        builder.addCase(deleteVacancy.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Fetch vacancy candidates
        builder.addCase(fetchVacancyCandidates.pending, (state) => {
            state.candidatesLoading = true;
            state.error = null;
        });
        builder.addCase(fetchVacancyCandidates.fulfilled, (state, action) => {
            state.candidatesLoading = false;
            state.candidates = action.payload;
        });
        builder.addCase(fetchVacancyCandidates.rejected, (state, action) => {
            state.candidatesLoading = false;
            state.error = action.payload as string;
        });

        builder.addCase(fetchDepartments.pending, (state) => {
            state.departmentsLoading = true;
            state.positionsLoading = true;
            state.error = null;
        });
        builder.addCase(fetchDepartments.fulfilled, (state, action) => {
            state.departmentsLoading = false;
            state.positionsLoading = false;
            state.departments = action.payload.departments;
            state.positions = action.payload.positions;
        });
        builder.addCase(fetchDepartments.rejected, (state, action) => {
            state.departmentsLoading = false;
            state.positionsLoading = false;
            state.error = action.payload as string;
        });
    },
});

export const { clearCurrentVacancy, setError } = vacancySlice.actions;
export default vacancySlice.reducer;
