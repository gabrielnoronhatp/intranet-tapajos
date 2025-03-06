import { CentroCusto } from './CentroCustoType';

export interface Item {
    produto: any;
    valor: number;
    centroCusto: CentroCusto[];
}
