import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { api } from '@/app/service/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

import { CentroCusto } from '@/types/noPaper/Order/CentroCustoType';
import { OrderData } from '@/types/noPaper/Order/OrderData';
import { Item } from '@/types/noPaper/Order/ItemOrder';
import { Parcela } from '@/types/noPaper/Order/Parcela';


const initialState: any  = {
    id: '',
    dtlanc: null,
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
            centrocusto: [] ,
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
                        centrocusto: cc.centrocusto,
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
                id: '',
                dtlanc: rest.dtlanc ? format(rest.dtlanc, 'yyyy-MM-dd') : null,
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
                        ? rest.parcelasOP.map((parcela: Parcela) => ({
                              parcela: parcela.parcela || null,
                              banco: parcela.banco || null,
                              agencia: parcela.agencia || null,
                              conta: parcela.conta || null,
                              tipopix: parcela.tipopix || null,
                              chavepix: parcela.chavepix || null,
                          }))
                        : [],
                produtosOP: produtosOP,
                observacaoOP: rest.observacao || null,
                tipopixOP: rest.tipopix || null,
                chavepixOP: rest.chavepix || null,
                datapixOP: rest.datapix || null,
                opcaoLancOP: rest.tipoLancamento || null,
                ccustoOP: centrosCusto.map((centro: CentroCusto) => ({
                    centrocusto: centro.centrocusto,
                    valor: centro.valor,
                })),
                userOP: rest.user || null,
                dataVencimentoOP: rest.dataVencimentoOP || null,
                canceled: false,
                files: rest.files || [],
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
        builder.addCase(cancelOrder.fulfilled, (state) => {
            state.canceled = true;
        });
    },
});

export const { prepareOrderData, setOrderState } = orderSlice.actions;
export default orderSlice.reducer;
