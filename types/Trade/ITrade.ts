export interface ICampaign {
    nome: string;
    datainicial: string;
    datafinal: string;
    valor_total: number;
    userlanc: string;
    datalanc: string;
    status: string;
    operators: Operador[];
    campaigns: ICampaign[];
    products: IProduct[];
    currentCampaign?: any;
    filiais: any;
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
    idcampanha_distribuicao: number;
    modelo: string;
    meta: string;
    idparticipante: number;
    meta_valor: number;
    meta_quantidade: number;
    premiacao: string;
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
