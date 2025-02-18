export interface IContract {
    id?: number;
    idtipo: string;
    idfilial: string;
    idfornecedor: string;
    nome: string;
    telefone1?: string;
    telefone2?: string;
    endereco1?: string;
    endereco2?: string;
    email1?: string;
    email2?: string;
    data_venc_contrato?: string; 
    indice?: string;
    forma_pag?: string;
    agencia?: string;
    conta?: string;
    tipo_chave_pix?: string;
    chave_pix?: string;
    valor_multa?: number | null;
    percentual_multa?: number | null;
    obs1?: string;
    obs2?: string;
    datalanc?: string; // Date will be handled as string in frontend
    userlanc?: string;
    cancelado?: boolean;
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
