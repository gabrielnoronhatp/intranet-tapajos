'use client';

import React from 'react';
import { setOrderState } from '@/hooks/slices/noPaper/orderSlice';
import { FormSection } from '../form-section';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCentrosCusto } from '@/hooks/slices/noPaper/noPaperSlice';
import { RootState } from '@/hooks/store';
import CurrencyInput from 'react-currency-input-field';
import { extractNumericValue, formatCurrency } from '@/lib/utils';
import { NumericFormat } from 'react-number-format';

export default function TaxesData() {
    const dispatch = useDispatch();

    const handleSetState = (field: keyof any, value: any) => {
        dispatch(setOrderState({ [field]: value }));
    };

    const { qtitensOP, valorimpostoOP, produtosOP, ccustoOP } = useSelector(
        (state: RootState) => state.order
    );

    const { searchQuery } = useSelector((state: RootState) => state.noPaper);

    useEffect(() => {
        dispatch(fetchCentrosCusto('') as any);
    }, [dispatch, searchQuery]);

    const handleItensChange = (
        index: number,
        field: 'produto' | 'valor' | 'centroCusto',
        value: string | number
    ) => {
        const updatedItens = produtosOP.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        dispatch(setOrderState({ produtosOP: updatedItens }));
    };

    const handleQuantidadeProdutosChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const quantidade = parseInt(e.target.value, 10);
        handleSetState('qtitensOP', quantidade);

        const newItens = Array.from(
            { length: quantidade },
            (_, index) =>
                produtosOP[index] || { produto: '', valor: 0, centroCusto: [] }
        );
        dispatch(setOrderState({ produtosOP: newItens }));
    };

    const handleCCustoChange = (
        index: number,
        field: 'centrocusto' | 'valor',
        value: string | number
    ) => {
        const updatedCCusto = ccustoOP.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        dispatch(setOrderState({ ccustoOP: updatedCCusto }));
    };

    return (
        <FormSection title="Dados de Itens e Impostos">
            <div className="space-y-2">
                <Label className="text-xs font-semibold text-primary uppercase">
                    Quantidade de Itens
                </Label>
                <Input
                    type="number"
                    value={qtitensOP}
                    onChange={handleQuantidadeProdutosChange}
                    min={1}
                    className="form-control"
                />

                {produtosOP.map((item, index) => (
                    <div key={index} className="space-y-1">
                        <Label className="text-xs font-semibold text-primary uppercase">
                            Item {index + 1}: Descrição e Valor
                        </Label>
                        <Input
                            type="text"
                            value={item.produto}
                            onChange={(e) =>
                                handleItensChange(
                                    index,
                                    'produto',
                                    e.target.value
                                )
                            }
                            placeholder="Descrição do Produto"
                            className="form-control"
                            required
                        />

                        <NumericFormat
                            customInput={Input}
                            value={item.valor}
                            onValueChange={(values) => {
                                const { floatValue } = values;
                                handleItensChange(
                                    index,
                                    'valor',
                                    floatValue || 0
                                );
                            }}
                            decimalSeparator=","
                            allowNegative={false}
                            className="form-control"
                        />
                    </div>
                ))}

                <Label className="text-xs font-semibold text-primary uppercase">
                    Valor do Imposto
                </Label>
                <NumericFormat
                    customInput={Input}
                    value={valorimpostoOP}
                    onValueChange={(values) => {
                        const { floatValue } = values;
                        handleSetState('valorimpostoOP', floatValue || 0);
                    }}
                    decimalSeparator=","
                    allowNegative={false}
                    className="form-control"
                />
            </div>
        </FormSection>
    );
}
