import { IFilial } from '../noPaper/Supplier/SupplierType';

export interface ICampaign {
    id: number;
    idcampanha_distribuicao: number; 
    idempresa: number;
    nome: string;
    datainicial: string;
    datafinal: string;
    valor_total: number;
    meta_valor: number;
    userlanc: string;
    tipo_meta: string;
    datalanc: string;
    status: string;
    operators: Operador[];
    campaigns: ICampaign[];
    products: IProduct[];
    currentCampaign?: ICampaign;
    campanha: ICampaign;
    filiais: IFilial[];
    participantes: IParticipants[];
    escala: IEscala[];
    itens: IProduct[] ;
}

export interface IEscala {
    linha?: string;
    metaGeralRange?: string[];
    metaVendedorRange?: string[];
    valoresMeta?: IValorMeta[];
    [key: string]: any; // This allows any string key to be used
}

export interface IValorMeta {
    idMetaGeral: number;
    idMetaVendedor: number;
    celValordaMeta: number;
}

export interface IProduct {
    id: number;
    label: string;
    value: string;
    codprod: string;
    descricao: string;
    codmarca: string;
    marca: string;
    metrica: string;
    nome: string;
}

export type Operador = {
    modelo: string;
    nome: string;
    tipo: string;
    matricula: string;
    codusur: string;
    idparticipante: string;
    meta_valor: number;
    meta_quantidade: number;
    premiacao: number | string;
    tipo_meta: string;
};

export interface IParticipants {
    id: number;
    label: string;
    idcampanha_distribuicao: number;
    modelo: string;
    meta: string;
    metrica: string;
    idparticipante: number;
    meta_valor: number;
    meta_quantidade: number;
    premiacao: string;
    nome: string;
    tipo: string;
    matricula: string;
    codusur: string;

    tipo_meta: string | null;
}

export interface ICampaignItens {
    idcampanha_distribuicao: number;
    metrica: string;
    nome: string;
    iditem: number;
}
export type Escala = {
    metaGeralRange: [];
    metaVendedorRange: [];
    valoresMeta: IValorMeta[];
};
