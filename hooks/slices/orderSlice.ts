import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/app/service/api';
import { OrderData, Item, CentroCusto, OrderState } from '@/types/Order/OrderTypes';
import toast from 'react-hot-toast';


const initialState: OrderState = {
  loading: false,
  error: null,
  success: false,
  orderData: null,
  isSidebarOpen: true,
  ramo: "distribuicao",
  tipoLancamento: "servico",
  formaPagamento: "avista",
  open: false,
  selectedFornecedor: null,
  quantidadeProdutos: 1,
  centrosCusto: [],
  installments: 1,
  installmentDates: [],
  valorTotal: 0,
  itens: [{ descricao: '', valor: 0, centroCusto: [] }],
  isViewOpen: false,
  selectedFilial: null,
  filialOpen: false,
  notaFiscal: "",
  serie: "",
  valorImposto: 0,
  observacao: "",
  user: "",
  dtavista: "",
  banco: "",
  agencia: "",
  conta: "",
  dtdeposito: "",
  tipopix: "",
  chavepix: "",
  datapix: "",
  contaOP: "",
};

export const submitOrder = createAsyncThunk(
  'order/submitOrder',
  async (orderData: OrderData, { rejectWithValue }) => {
    try {
      const response = await api.post('cadastrar-ordem', orderData);

      if (response.status === 200 || response.status === 201) {
        toast.success('Pedido enviado com sucesso!');
         window.location.href = '/noPaper/list';
        return response.data;
      } else {
        toast.error('Erro ao enviar o pedido.');
        return rejectWithValue('Erro ao enviar o pedido.');
      }
    } catch (error: any) {
     
      return rejectWithValue(error.response.data);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrderState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.orderData = null;
    },
    prepareOrderData: (state, action) => {
      const { itens, centrosCusto, valorImposto, ramo, notaFiscal, installments, contaOP, selectedFornecedor, selectedFilial, serie, formaPagamento, quantidadeProdutos, dtavista, banco, agencia, conta, dtdeposito, installmentDates, observacao, tipopix, chavepix, datapix, tipoLancamento, user } = action.payload;

      const produtosOP = itens.map((item: Item) => {
        const centroCusto = item.centroCusto;

        const centroCustoFormatado = typeof centroCusto === 'string'
          ? [{ centrocusto: centroCusto, valor: item.valor || 0 }]
          : centroCusto;

        return {
          produto: item.descricao,
          valor: item.valor,
          centroCusto: centroCustoFormatado,
        };
      });

      const totalProdutos = produtosOP.reduce((acc: number, produto: Item) => acc + produto.valor, 0);
      const totalCentrosCusto = centrosCusto.reduce((acc: number, ccusto: CentroCusto) => acc + ccusto.valor, 0);

      const valorItensMenosImposto = totalProdutos - valorImposto;

      if (valorItensMenosImposto !== totalCentrosCusto) {
        const diferenca = valorItensMenosImposto - totalCentrosCusto;

        produtosOP.forEach((produto: Item) => {
          const updatedProduto = {
            ...produto,
            valor: produto.valor - diferenca / produtosOP.length,
          };
          Object.assign(produto, updatedProduto);
        });

        centrosCusto.forEach((ccusto: CentroCusto) => {
          ccusto.valor += diferenca / centrosCusto.length;
        });
      }

      state.orderData = {
        dtlanc: new Date().toISOString(),
        ramoOP: ramo || null,
        notaOP: notaFiscal || null,
        qtparcelasOP: installments || null,
        contagerencialOP: contaOP || null,
        fornecedorOP: selectedFornecedor?.fornecedor || null,
        lojaOP: selectedFilial?.loja || null,
        serieOP: serie || null,
        metodoOP: formaPagamento || null,
        qtitensOP: quantidadeProdutos || null,
        valorimpostoOP: valorImposto || 0,
        dtavistaOP: dtavista || null,
        bancoOP: banco || null,
        agenciaOP: agencia || null,
        contaOP: conta || null,
        dtdepositoOP: dtdeposito || null,
        parcelasOP: installmentDates.length > 0 ? installmentDates.map((date: string) => ({ parcela: date })) : null,
        produtosOP: produtosOP,
        observacaoOP: observacao || null,
        tipopixOP: tipopix || null,
        chavepixOP: chavepix || null,
        datapixOP: datapix || null,
        opcaoLancOP: tipoLancamento || null,
        ccustoOP: centrosCusto.map((centro: CentroCusto) => ({
          centrocusto: centro.centroCusto,
          valor: centro.valor
        })),
        userOP: user || null,
      };
    },
    setOrderState: (state, action: PayloadAction<Partial<OrderState>>) => {
      return { ...state, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitOrder.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
       
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
       
      });
  },
});

export const { resetOrderState, prepareOrderData, setOrderState } = orderSlice.actions;
export default orderSlice.reducer; 