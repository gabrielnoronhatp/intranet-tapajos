import { CentroCusto } from './CentroCustoType';
import { Item } from './ItemOrder';

export interface OrderData {
    id?: string | number;
    dtlanc?: string;
    dtavista?: string;
    ramoOP?: string;
    notaOP?: string;
    qtparcelasOP?: number;
    contagerencialOP?: string;
    fornecedorOP?: string;
    lojaOP?: string;
    serieOP?: string;
    metodoOP?: string;
    qtitensOP?: number;
    valorimpostoOP?: number;
    dtavistaOP?: string;
    bancoOP?: string;
    agenciaOP?: string;
    contaOP?: string;
    dtdepositoOP?: string;
    parcelasOP?: {
        banco?: string;
        agencia?: string;
        conta?: string;
        tipopix?: string;
        chavepix?: string;
        parcela?: string;
    }[];
    produtosOP?: Item[];
    observacaoOP?: string;
    tipopixOP?: string;
    chavepixOP?: string;
    datapixOP?: string;
    opcaoLancOP?: string;
    ccustoOP?: CentroCusto[];
    userOP?: string;
    canceled?: boolean;
    files?: File[];
    dataVencimentoOP?: string;
}
