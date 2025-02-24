import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { IContract } from '@/types/Contracts/Contracts';
import { api, apiDev } from '@/app/service/api';
import toast from 'react-hot-toast';

interface ContractState {
    contracts: IContract[];
    loading: boolean;
    error: string | null;
    currentContract: IContract ;
    serviceTypes: { [key: number]: string };
}

const initialState: ContractState = {
    contracts: [],
    loading: false,
    error: null,
    currentContract: {} as IContract,
    serviceTypes: {},
};

export const fetchContracts = createAsyncThunk(
    'contracts/fetchContracts',
    async (searchParams?: Record<string, string>) => {
        try {
            const query = searchParams
                ? new URLSearchParams(searchParams).toString()
                : '';
            const response = await apiDev.get(`contracts${query}/`);
            return response.data;
        } catch (error: any) {
            toast.error('Erro ao buscar contratos: ' + error.message);
            throw error;
        }
    }
);

export const createContract = createAsyncThunk(
    'contracts/createContract',
    async (contractData: Partial<IContract>) => {
        try {
            const response = await apiDev.post('contracts/', contractData);
            toast.success('Contrato cadastrado com sucesso!');
            setTimeout(() => {
                window.location.href = '/contracts/list';
            }, 1000);
            return response.data;
            
        } catch (error: any) {
            toast.error('Erro ao cadastrar contrato: ' + error.message);
            throw error;
        }
    }
);

export const fetchServiceTypes = createAsyncThunk(
    'contracts/fetchServiceTypes',
    async () => {
        try {
            const response = await apiDev.get('service-types/');
            const serviceTypes = response.data.reduce(
                (acc: { [key: number]: string }, type: any) => {
                    acc[type.id] = type.descricao;
                    return acc;
                },
                {}
            );
            return serviceTypes;
        } catch (error: any) {
            toast.error('Erro ao buscar tipos de serviço: ' + error.message);
            throw error;
        }
    }
);

export const uploadContractFile = createAsyncThunk(
    'contracts/uploadContractFile',
    async ({ contractId, file }: { contractId: number; file: File }) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await apiDev.post(`contracts/${contractId}/files`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Arquivo enviado com sucesso!');
            return response.data;
        } catch (error: any) {
            toast.error('Erro ao enviar arquivo: ' + error.message);
            throw error;
        }
    }
);

export const fetchContractFiles = createAsyncThunk(
    'contracts/fetchContractFiles',
    async (contractId: number) => {
        try {
            const response = await apiDev.get(`contracts/${contractId}/files`);
            return { contractId, files: response.data };
        } catch (error: any) {
            toast.error('Erro ao buscar arquivos do contrato: ' + error.message);
            throw error;
        }
    }
);

const contractSlice = createSlice({
    name: 'contracts',
    initialState,
    reducers: {
        setCurrentContract: (state, action) => {
            state.currentContract = {
                ...state.currentContract,
                ...action.payload
            };
        },
        clearCurrentContract: (state) => {
            state.currentContract = {} as IContract;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchContracts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchContracts.fulfilled, (state, action) => {
                state.loading = false;
                state.contracts = action.payload;
            })
            .addCase(fetchContracts.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.error.message || 'Erro ao buscar contratos';
            })
            .addCase(createContract.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createContract.fulfilled, (state, action) => {
                state.loading = false;
                state.contracts.push(action.payload);
            })
            .addCase(createContract.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Erro ao criar contrato';
            })
            .addCase(fetchServiceTypes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchServiceTypes.fulfilled, (state, action) => {
                state.loading = false;
                state.serviceTypes = action.payload;
            })
            .addCase(fetchServiceTypes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Erro ao buscar tipos de serviço';
            })
            .addCase(fetchContractFiles.fulfilled, (state, action) => {
                const { contractId, files } = action.payload;
                const contract = state.contracts.find(c => c.id === contractId);
                if (contract) {
                    contract.files = files;
                }
            });
    },
});

export const { setCurrentContract, clearCurrentContract } =
    contractSlice.actions;
export default contractSlice.reducer;
