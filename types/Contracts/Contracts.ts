export interface IContract {
    id: number;
    idtipo: any;
    idfilial: string;
    idfornecedor: string;
    nome: string;
    telefone1?: string;
    telefone2?: string;
    endereco1?: string;
    endereco2?: string;
    email1?: string;
    email2?: string;
    //todo remove this any
    data_venc_contrato?: any;
    indice?: string;
    forma_pag?: any; // TODO: find a way to handle this any
    agencia?: string;
    conta?: string;
    tipo_chave_pix?: string;
    chave_pix?: string;
    valor_multa?: number | null;
    percentual_multa?: number | null;
    valor_contrato?: number | null;
    obs1?: string;
    obs2?: string;
    datalanc?: string; // Date will be handled as string in frontend
    userlanc?: string;
    cancelado?: boolean;
    dtdeposito?: string;
    tipopix?: any; // TODO: find a way to handle this any
    chavepix?: string;
    datapix?: string;
    opcao_lanc?: string;
    files?: IFile[];
    ccusto?: string;
    banco?: string;
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

export interface IFile {
    filename: string;
    file_url: string;
    size: number;
    last_modified: string;
    contract_id: number;
}
