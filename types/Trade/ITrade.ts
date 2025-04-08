import { IFilial } from "../noPaper/Supplier/SupplierType";

export interface ICampaign {
    id: number;
    nome: string;
    datainicial: string;
    datafinal: string;
    idempresa: number;
    valor_total: number;
    userlanc: string;
    datalanc: string;
    status: string;
    operators: Operador[];
    campaigns: ICampaign[];
    products: IProduct[];
    currentCampaign?: ICampaign;
    filiais: IFilial[];
    escala: IEscala[];
}

export interface IEscala {
    metaGeralRange: [];
    metaVendedorRange: [];
    valoresMeta: IValorMeta[];
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
    
    tipo_meta: string;
}

export interface ICampaignItens {
    idcampanha_distribuicao: number;
    metrica: string;
    iditem: number;
}
export type Escala = {
    metaGeralRange: [];
    metaVendedorRange: [];
    valoresMeta: IValorMeta[];
};
