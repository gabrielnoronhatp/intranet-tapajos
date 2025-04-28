import { IFile } from './IFile';

export interface IContract {
    id: number;
    idtipo: string | number;
    idfilial: string;
    idfornecedor: string;
    nome: string;
    telefone1?: string;
    telefone2?: string;
    endereco1?: string;
    endereco2?: string;
    email1?: string;
    email2?: string;
    data_venc_contrato?: string | Date;
    indice?: string;
    forma_pag?: string | number;
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
    tipopix?: string;
    chavepix?: string;
    datapix?: string;
    opcao_lanc?: string;
    files?: IFile[];
    ccusto?: string;
    banco?: string;
}

export type ContractFormState = Partial<IContract>;
