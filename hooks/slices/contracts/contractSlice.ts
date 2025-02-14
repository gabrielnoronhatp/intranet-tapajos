import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { IContract } from '@/types/Contracts/Contracts';
import api from '@/app/service/api';
import toast from 'react-hot-toast';

interface ContractState {
    contracts: IContract[];
    loading: boolean;
    error: string | null;
    currentContract: IContract | null;
}

const initialState: ContractState = {
    contracts: [],
    loading: false,
    error: null,
    currentContract: null,
};

export const fetchContracts = createAsyncThunk(
    'contracts/fetchContracts',
    async (searchParams?: Record<string, string>) => {
        try {
            const query = searchParams ? new URLSearchParams(searchParams).toString() : '';
            const response = await api.get(`buscar-contratos?${query}`);
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
            const response = await api.post('cadastrar-contrato', contractData);
            toast.success('Contrato cadastrado com sucesso!');
            return response.data;
        } catch (error: any) {
            toast.error('Erro ao cadastrar contrato: ' + error.message);
            throw error;
        }
    }
);

const contractSlice = createSlice({
    name: 'contracts',
    initialState,
    reducers: {
        setCurrentContract: (state, action) => {
            state.currentContract = action.payload;
        },
        clearCurrentContract: (state) => {
            state.currentContract = null;
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
                state.error = action.error.message || 'Erro ao buscar contratos';
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
            });
    },
});

export const { setCurrentContract, clearCurrentContract } = contractSlice.actions;
export default contractSlice.reducer; 