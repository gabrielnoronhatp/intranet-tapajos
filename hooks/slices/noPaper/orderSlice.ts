import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/app/service/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { OrderData } from '@/types/noPaper/Order/OrderTypes';
import { CentroCusto } from '@/types/noPaper/Order/CentroCustoType';
import { Item } from '@/types/noPaper/Order/CentroCustoItem';

const initialState = {
    dtlanc: '',
    ramoOP: null,
    notaOP: '',
    qtparcelasOP: null,
    contagerencialOP: null,
    fornecedorOP: '',
    lojaOP: '',
    serieOP: '',
    metodoOP: null,
    qtitensOP: 0,
    valorimpostoOP: 0,
    dtavistaOP: null,
    dataVencimentoOP: '',
    bancoOP: null,
    agenciaOP: null,
    contaOP: null,
    dtdepositoOP: '',
    parcelasOP: [
        {
            parcela: null,
            banco: '',
            agencia: '',
            conta: '',
            tipopix: '',
            chavepix: '',
        },
    ],
    produtosOP: [
        {
            produto: '',
            valor: 0,
            centroCusto: [],
        },
    ],
    observacaoOP: null,
    tipopixOP: null,
    chavepixOP: null,
    datapixOP: null,
    opcaoLancOP: null,
    ccustoOP: [
        {
            centrocusto: 0,
            valor: 0,
        },
    ],
    userOP: null,
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
        } catch (error: any) {
            toast.error('Error: ' + error.response.data.message);
            return rejectWithValue(error.response.data);
        }
    }
);

export const cancelOrder = createAsyncThunk(
    'order/cancelOrder',
    async (orderId: number, { rejectWithValue }) => {
        try {
            const response = await api.put(`/cancelar-ordem/${orderId}`);
            if (response.status === 200) {
                toast.success('Ordem de pagamento cancelada com sucesso!');
                return response.data;
            }
        } catch (error: any) {
            toast.error('Erro ao cancelar ordem de pagamento.');
            return rejectWithValue(error.response.data);
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
            const produtosOP = itens.map((item: Item) => {
                const centroCustoFormatado = centrosCusto.map(
                    (cc: CentroCusto) => ({
                        centrocusto: cc.centroCusto,
                        valor: cc.valor,
                    })
                );

                return {
                    produto: item.produto,
                    valor: item.valor,
                    centroCusto: centroCustoFormatado,
                };
            });

            state = {
                dtlanc: format(rest.dtlanc, 'yyyy-MM-dd'),
                ramoOP: rest.ramo || null,
                notaOP: rest.notaFiscal || null,
                qtparcelasOP: rest.installments || null,
                contagerencialOP: rest.contaOP || null,
                fornecedorOP: rest.fornecedorOP || null,
                lojaOP: rest.lojaOP || null,
                serieOP: rest.serie || null,
                metodoOP: rest.formaPagamento || null,
                qtitensOP: rest.quantidadeProdutos || null,
                valorimpostoOP: valorImposto || 0,
                dtavistaOP: rest.dtavista || null,
                bancoOP: rest.banco || null,
                agenciaOP: rest.agencia || null,
                contaOP: rest.conta || null,
                dtdepositoOP: rest.dtdeposito || null,
                parcelasOP:
                    rest.parcelasOP?.length > 0
                        ? rest.parcelasOP.map((parcela: any) => ({
                              parcela: parcela.parcela || null,
                              banco: parcela.banco || '',
                              agencia: parcela.agencia || '',
                              conta: parcela.conta || '',
                              tipopixOP: parcela.tipopixOP || '',
                              chavepixOP: parcela.chavepixOP || '',
                          }))
                        : [],
                produtosOP: produtosOP,
                observacaoOP: rest.observacao || null,
                tipopixOP: rest.tipopixOP || null,
                chavepixOP: rest.chavepixOP || null,
                datapixOP: rest.datapixOP || null,
                opcaoLancOP: rest.tipoLancamento || null,
                ccustoOP: centrosCusto.map((centro: CentroCusto) => ({
                    centrocusto: centro.centroCusto,
                    valor: centro.valor,
                })),
                userOP: rest.user || null,
                dataVencimentoOP: rest.dataVencimentoOP || null,
            };
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
        builder.addCase(cancelOrder.fulfilled, (state, action) => {
            // Atualize o estado conforme necessário
        });
    }
});

export const { prepareOrderData, setOrderState } = orderSlice.actions;
export default orderSlice.reducer;
