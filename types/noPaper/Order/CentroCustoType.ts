import { OrderData } from './OrderData';
import { OrderState } from './OrderState';

export interface CentroCusto {
    centrocusto: string;
    valor: number;
}

export interface CenterOfCoustProps {
    data: OrderData;
    onChange: (
        field: keyof OrderState,
        value: string | number | CentroCusto[]
    ) => void;
}
