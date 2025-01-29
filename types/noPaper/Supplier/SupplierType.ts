export interface NoPaperState {
    fornecedores: any[];
    filiais: any[];
    searchQuery: string;
    contasGerenciais: any[];
    centrosCustoOptions: any[];
    loading: boolean;
    error: string | null;
    orderId: number | null;
  }