import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/app/service/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { CentroCusto } from '@/types/noPaper/Order/CentroCustoType';
import { OrderData } from '@/types/noPaper/Order/OrderData';
import { Item } from '@/types/noPaper/Order/ItemOrder';
import { Parcela } from '@/types/noPaper/Order/Parcela';
import { OrderState } from '@/types/noPaper/Order/OrderState';

const initialState: OrderState = {
    id: '',
    dtlanc: null as string | null,
    ramoOP: '',
    notaOP: '',
    qtparcelasOP: 0,
    contagerencialOP: '',
    fornecedorOP: '',
    lojaOP: '',
    serieOP: '',
    metodoOP: '',
    qtitensOP: 0,
    valorimpostoOP: 0,
    dtavistaOP: null,
    dataVencimentoOP: null,
    bancoOP: '',
    agenciaOP: '',
    contaOP: '',
    dtdepositoOP: null,
    parcelasOP: [
        {
            parcela: null,
            banco: '',
            agencia: '',
            conta: '',
            tipopix: null,
            chavepix: null,
        },
    ],
    produtosOP: [
        {
            produto: '',
            quantidade: 0,
            valorUnitario: 0,
            valorTotal: 0,
            valor: 0,
            centrocusto: [],
        },
    ],
    observacaoOP: null,
    tipopixOP: null,
    chavepixOP: null,
    datapixOP: null,
    opcaoLancOP: '',
    ccustoOP: [
        {
            centrocusto: '',
            valor: 0,
        },
    ],
    userOP: '',
    canceled: false,
    files: [],
};

export const submitOrder = createAsyncThunk(
    'order/submitOrder',
    async (orderData: OrderData, { rejectWithValue }) => {
        try {
            const response = await api.post('cadastrar-ordem', orderData);
            if (response.status === 200 || response.status === 201) {
                toast.success('Pedido enviado com sucesso!');
                setTimeout(() => {
                    window.location.href = '/noPaper/list';
                }, 1000);
                return response.data;
            } else if (response.status === 500) {
                toast.error('Erro ao enviar o pedido' + response.data.message);
                return rejectWithValue('Erro ao enviar o pedido.');
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error('Error: ' + error.message);
                return rejectWithValue(error.message);
            } else {
                toast.error('Error: ' + String(error));
                return rejectWithValue(String(error));
            }
        }
    }
);

export const cancelOrder = createAsyncThunk(
    'order/cancelOrder',
    async (orderId: number, { rejectWithValue }) => {
        try {
            const response = await api.put(`cancelar-ordem/${orderId}`);
            if (response.status === 200) {
                toast.success('Ordem de pagamento cancelada com sucesso!');
                return response.data;
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error('Erro ao cancelar ordem de pagamento.');
                return rejectWithValue(error.message);
            } else {
                toast.error('Erro ao cancelar ordem de pagamento.');
                return rejectWithValue(String(error));
            }
        }
    }
);

export const duplicateOrder = createAsyncThunk(
    'order/duplicateOrder',
    async (orderId: number, { rejectWithValue }) => {
        try {
            const response = await api.post(`duplicar-ordem/${orderId}`);
            if (response.status === 200) {
                toast.success('Ordem duplicada com sucesso! Lembre-se de atualizar o número da nota fiscal. ');
                return response.data;
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error('Erro ao duplicar ordem de pagamento.');
                return rejectWithValue(error.message);
            } else {
                toast.error('Erro ao duplicar ordem de pagamento.');
                return rejectWithValue(String(error));
            }
        }
    }
);

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        prepareOrderData: (state, action) => {
            const { itens, centrosCusto, valorImposto, ...rest } =
                action.payload;
            const produtosOP = itens.map((item: Item) => ({
                produto: item.produto,
                valor: item.valor,
                centroCusto: centrosCusto.map((cc: CentroCusto) => ({
                    centrocusto: cc.centrocusto,
                    valor: cc.valor,
                })),
            }));

            state.id = '';
            state.dtlanc = rest.dtlanc
                ? format(rest.dtlanc, 'yyyy-MM-dd')
                : null;
            state.ramoOP = rest.ramo || null;
            state.notaOP = rest.notaFiscal || null;
            state.qtparcelasOP = rest.installments || null;
            state.contagerencialOP = rest.contaOP || null;
            state.fornecedorOP = rest.fornecedorOP || null;
            state.lojaOP = rest.lojaOP || null;
            state.serieOP = rest.serie || null;
            state.metodoOP = rest.formaPagamento || null;
            state.qtitensOP = rest.quantidadeProdutos || null;
            state.valorimpostoOP = valorImposto || 0;
            state.dtavistaOP = rest.dtavista || null;
            state.bancoOP = rest.banco || null;
            state.agenciaOP = rest.agencia || null;
            state.contaOP = rest.conta || null;
            state.dtdepositoOP = rest.dtdeposito || null;
            state.parcelasOP =
                rest.parcelasOP?.length > 0
                    ? rest.parcelasOP.map((parcela: Parcela) => ({
                          parcela: parcela.parcela || null,
                          banco: parcela.banco || null,
                          agencia: parcela.agencia || null,
                          conta: parcela.conta || null,
                          tipopix: parcela.tipopix || null,
                          chavepix: parcela.chavepix || null,
                      }))
                    : [];
            state.produtosOP = produtosOP;
            state.observacaoOP = rest.observacao || null;
            state.tipopixOP = rest.tipopix || null;
            state.chavepixOP = rest.chavepix || null;
            state.datapixOP = rest.datapix || null;
            state.opcaoLancOP = rest.tipoLancamento || null;
            state.ccustoOP = centrosCusto.map((centro: CentroCusto) => ({
                centrocusto: centro.centrocusto,
                valor: centro.valor,
            }));
            state.userOP = rest.user || null;
            state.dataVencimentoOP = rest.dataVencimentoOP || null;
            state.canceled = false;
            state.files = rest.files || [];
        },
        setOrderState: (state, action) => {
            const { ccustoOP, produtosOP, ...otherFields } = action.payload;

            Object.assign(state, otherFields);

            if (ccustoOP) {
                state.ccustoOP = ccustoOP;
            }
            if (produtosOP) {
                state.produtosOP = produtosOP;
            }
        },
    },
     
    extraReducers: (builder) => {
        builder.addCase(cancelOrder.fulfilled, (state) => {
            state.canceled = true;
        });
    },
});

export const { prepareOrderData, setOrderState } = orderSlice.actions;
export default orderSlice.reducer;
