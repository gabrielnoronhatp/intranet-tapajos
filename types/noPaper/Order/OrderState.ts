import { CentroCusto } from './CentroCustoType';
import { Item } from './ItemOrder';
import { OrderData } from './OrderData';
import { Parcela } from './Parcela';



export interface OrderState {
    dtlanc: string;
    id: number;
    qtparcelasOP: number ;
    contagerencialOP: string ;
    fornecedorOP: string ;
    lojaOP: string ;
    serieOP: string ;
    metodoOP: string ;
    produtosOP: Item[];
    tipopixOP: string ;
    chavepixOP: string ;
    datapixOP: string ;
    opcaoLancOP: string ;
    ccustoOP: CentroCusto[];
    userOP: string;
    files?: File[];
    dataVencimentoOP: string ;
    observacaoOP: string ;
    qtitensOP: number ;
    valorimpostoOP: number;
    ramoOP: string ;
    notaOP: string ; 
    idtipo: string;
    dataEmissao: Date;
    dtavistaOP: string ;
    bancoOP: string ;
    agenciaOP: string ;
    parcelasOP: Parcela[]; 
    dtdepositoOP: string ;
    loading: boolean;
    canceled: boolean;
    error: string ;
    success: boolean;
    orderData: OrderData ;
    isSidebarOpen: boolean;
    ramo: string;
    tipoLancamento: string;
    assinatura1: string;
    assinatura2: string;
    assinatura3: string;    
    formaPagamento: string;
    open: boolean;
    selectedFornecedor: string;
    quantidadeProdutos: number;
    centrosCusto: CentroCusto[];
    installments: number;
    installmentDates: string[];
    valorTotal: number;
    itens: Item[];
    isViewOpen: boolean;
    selectedFilial: string;
    filialOpen: boolean;
    notaFiscal: string;
    serie: string;
    valorImposto: number;
    observacao: string;
    user: string;
    dtavista: string;
    banco: string;
    agencia: string;
    conta: string;
    dtdeposito: string;
    tipopix: string;
    chavepix: string;
    datapix: string;
    contaOP: string;
}

export interface UploadParams {
    orderId: string;
    files: File[];
}

