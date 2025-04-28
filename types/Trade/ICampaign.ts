import { IFilial } from '../noPaper/Supplier/SupplierType';
import { IEscala } from './IEscala';
import { Operador } from './IOperator';
import { IParticipants } from './IParticipants';
import { IProduct } from './IProduct';

export interface ICampaign {
    id?: number | string | undefined;
    idcampanha_distribuicao?: number;
    idempresa?: number | string | undefined;
    nome?: string;
    datainicial?: string;
    datafinal?: string;
    valor_total?: number;
    meta_valor?: number;
    userlanc?: string;
    tipo_meta?: string;
    datalanc?: string;
    status?: string | boolean;
    operators?: Operador[];
    campaigns?: Array<ICampaign> | null;
    products?: IProduct[];
    currentCampaign?: ICampaign;
    campanha?: ICampaign;
    filiais?: IFilial[];
    participantes?: IParticipants[];
    escala?: IEscala[];
    itens?: IProduct[];
}

export interface IValorMeta {
    idMetaGeral: number;
    idMetaVendedor: number;
    celValordaMeta: number;
}

export interface ICampaignItens {
    idcampanha_distribuicao: number;
    metrica: string;
    nome: string;
    iditem: number;
}
