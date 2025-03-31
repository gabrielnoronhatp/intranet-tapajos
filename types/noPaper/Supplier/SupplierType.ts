export interface IFornecedor {
    id: number;
    nome: string;
    cnpj: string;
    email: string;
    telefone: string;
    fornecedor: string;
}

export interface IFilial {
    loja: string;
    fantasia: string;
    id: number;
    label: string;
}

export interface IContaGerencial {
    conta: string;
}

export interface ICentroCusto {
    centrocusto: string;
}
export interface NoPaperState {
    lojas: IFilial[];
    fornecedores: IFornecedor[];
    filiais: IFilial[];
    searchQuery: string;
    contasGerenciais: IContaGerencial[];
    centrosCustoOptions: ICentroCusto[];
    loading: boolean;
    error: string | null;
    orderId: number | null;
    signatureNumber: number | null;
}
