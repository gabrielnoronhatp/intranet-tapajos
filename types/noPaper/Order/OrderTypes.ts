import { CentroCusto } from './CentroCustoType';

export interface OrderData {
    dtlanc: string;
    ramoOP: string | null;
    notaOP: string | null;
    qtparcelasOP: number | null;
    contagerencialOP: string | null;
    fornecedorOP: string | null;
    lojaOP: string | null;
    serieOP: string | null;
    metodoOP: string | null;
    qtitensOP: number | null;
    valorimpostoOP: number;
    dtavistaOP: string | null;
    bancoOP?: string | null;
    agenciaOP?: string | null;
    contaOP?: string | null;
    dtdepositoOP: string | null;
    parcelasOP: { parcela: string }[] | null;
    produtosOP: Item[];
    observacaoOP: string | null;
    tipopixOP: string | null;
    chavepixOP: string | null;
    datapixOP: string | null;
    opcaoLancOP: string | null;
    ccustoOP: CentroCusto[];
    userOP: string | null;
}

export interface OrderState {
    dataEmissao: Date;
    fornecedorOP: string | null;
    loading: boolean;
    error: string | null;
    success: boolean;
    orderData: OrderData | null;
    isSidebarOpen: boolean;
    ramo: string;
    tipoLancamento: string;
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

export interface File {
    name: string;
    size: number;
    type: string;
    lastModified: number;
}

export interface Item {
    produto: string;
    quantidade: number;
    valorUnitario: number;
    valorTotal: number;
}
