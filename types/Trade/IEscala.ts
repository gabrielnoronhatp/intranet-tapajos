import { IValorMeta } from './ICampaign';

export interface IEscala {
    linha?: string;
    metaGeralRange?: string[];
    metaVendedorRange?: string[];
    valoresMeta?: IValorMeta[];
    [key: string]: any; // This allows any string key to be used
}

export type Escala = {
    metaGeralRange: [];
    metaVendedorRange: [];
    valoresMeta: IValorMeta[];
};
