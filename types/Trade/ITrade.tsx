export interface ICampaign {
    nome: string;
    datainicial: string;
    datafinal: string;
    valor_total: number;
    userlanc: string;
    datalanc: string;
    status: string;
    operators: IOperator[];
    campaigns: ICampaign[];
    products: IProduct[];
    currentCampaign?: any;
    filiais: any;
}

export interface IProduct {
    codprod: string;
    descricao: string;
}

export interface IOperator {
    codusur: string;
    matricula?: string;
    nome: string;
}

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
