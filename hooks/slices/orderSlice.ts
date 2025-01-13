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
  ramo: "",
  tipoLancamento: "",
  formaPagamento: "",
  open: false,
  selectedFornecedor: null,
  quantidadeProdutos: 1,
  centrosCusto: [],
  installments: 1,
  installmentDates: [],
  valorTotal: 0,
  itens: [{ produto: null, valor: 0, centroCusto: [] }],
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
     
      const { itens, centrosCusto, valorImposto, ...rest } = action.payload;    
      const produtosOP = itens.map((item: Item) => {
    
        const centroCustoFormatado = centrosCusto.map((cc: CentroCusto) => ({
          centrocusto: cc.centroCusto,
          valor: cc.valor,
        }));
        
          
        return {
          produto: item.produto,
          valor: item.valor,
          centroCusto: centroCustoFormatado,
        };
      });

      state.orderData = {
        dtlanc: new Date().toISOString(),
        ramoOP: rest.ramo || null,
        notaOP: rest.notaFiscal || null,
        qtparcelasOP: rest.installments || null,
        contagerencialOP: rest.contaOP || null,
        fornecedorOP: rest.selectedFornecedor?.fornecedor || null,
        lojaOP: rest.selectedFilial?.loja || null,
        serieOP: rest.serie || null,
        metodoOP: rest.formaPagamento || null,
        qtitensOP: rest.quantidadeProdutos || null,
        valorimpostoOP: valorImposto || 0,
        dtavistaOP: rest.dtavista || null,
        bancoOP: rest.banco || null,
        agenciaOP: rest.agencia || null,
        contaOP: rest.conta || null,
        dtdepositoOP: rest.dtdeposito || null,
        parcelasOP: rest.installmentDates?.length > 0 
          ? rest.installmentDates.map((date: string) => ({ parcela: date })) 
          : null,
        produtosOP: produtosOP,
        observacaoOP: rest.observacao || null,
        tipopixOP: rest.tipopix || null,
        chavepixOP: rest.chavepix || null,
        datapixOP: rest.datapix || null,
        opcaoLancOP: rest.tipoLancamento || null,
        ccustoOP: centrosCusto.map((centro: CentroCusto) => ({
          centrocusto: centro.centroCusto,
          valor: centro.valor
        })),
        userOP: rest.user || null,
      };
    },
    setOrderState: (state, action: PayloadAction<Partial<OrderState>>) => {
      const { itens, ...otherFields } = action.payload;

      if (itens) {
        state.itens = itens.map((item, index) => ({
          ...state.itens[index],
          ...item,
        }));
      }

      Object.assign(state, otherFields);

      state.valorTotal = state.itens.reduce((sum, item) => sum + (item.valor || 0), 0);
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