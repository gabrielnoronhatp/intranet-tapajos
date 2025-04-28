import { CentroCusto } from './CentroCustoType';

export interface Item {
    produto: string;
    quantidade: number;
    valor: number;
    valorUnitario: number;
    valorTotal: number;
    centrocusto: CentroCusto[];
}
