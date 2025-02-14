export interface IContract {
    tipoServico: string;
    filial: string;
    fornecedor: string;
    contatoNome: string;
    contatoTelefone: string;
    contatoEmail: string;
    contatoEndereco: string;
    periodo: string; 
    indice: 'PCE' | 'IGP-M';
    ccustoOP: Array<{
        centrocusto: string;
        valor: number;
    }>;
    produtosOP: Array<{
        valor: number;
        [key: string]: any; 
    }>;
    valorimpostoOP: number;
    multa: string;
    vencimento: string;
    valor: number;
    observacoes: string;
    upload: Array<{
        uid: string;
        name: string;
        status: 'done' | 'uploading' | 'error';
        url?: string;
        [key: string]: any;
    }>;
}

export type ContractFormState = Partial<IContract>;
export enum TipoServico {
    SERVICO1 = 'servico1',
    SERVICO2 = 'servico2',
}


export enum IndiceType {
    PCE = 'PCE',
    IGPM = 'IGP-M',
}
