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
import { NumericFormat } from 'react-number-format';

interface TaxesDataProps {
    data: any;
    onChange: (field: keyof any, value: any) => void;
}

export default function TaxesData({ data, onChange }: TaxesDataProps) {
    const dispatch = useDispatch();

    const { qtitensOP, valorimpostoOP, produtosOP, ccustoOP } = data;

    const { searchQuery } = useSelector((state: RootState) => state.noPaper);

    useEffect(() => {
        dispatch(fetchCentrosCusto('') as any);
    }, [dispatch, searchQuery]);

    const handleItensChange = (
        index: number,
        field: 'produto' | 'valor' | 'centroCusto',
        value: string | number
    ) => {
        const updatedItens = produtosOP.map((item: any, i: number) =>
            i === index ? { ...item, [field]: value } : item
        );
        onChange('produtosOP', updatedItens);
    };

    const handleQuantidadeProdutosChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const quantidade = parseInt(e.target.value, 10);
        onChange('qtitensOP', quantidade);

        const newItens = Array.from(
            { length: quantidade },
            (_, index) =>
                produtosOP[index] || { produto: '', valor: 0, centroCusto: [] }
        );
        onChange('produtosOP', newItens);
    };

    const handleCCustoChange = (
        index: number,
        field: 'centrocusto' | 'valor',
        value: string | number
    ) => {
        let updatedCCusto = [...ccustoOP];

        if (field === 'valor') {
            const totalValue = calculateTotalValue();
            const remaining = totalValue - Number(value);
            const otherCenters = ccustoOP.length - 1;

            if (otherCenters > 0) {
                const valueForOthers = remaining / otherCenters;

                updatedCCusto = updatedCCusto.map((center: any, i: number) => {
                    if (i === index) {
                        return {
                            ...center,
                            valor: Number(value),
                        };
                    }
                    return {
                        ...center,
                        valor: valueForOthers,
                    };
                });
            }
        } else {
            updatedCCusto = updatedCCusto.map((center: any, i: number) =>
                i === index ? { ...center, [field]: value } : center
            );
        }

        onChange('ccustoOP', updatedCCusto);
    };

    const calculateTotalValue = () => {
        const totalProdutos = produtosOP.reduce(
            (sum: number, product: any) => sum + (Number(product.valor) || 0),
            0
        );
        return totalProdutos - (Number(valorimpostoOP) || 0);
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
                {qtitensOP < 1 && (
                    <p className="text-red-500 text-xs">
                        A quantidade de itens deve ser pelo menos 1.
                    </p>
                )}

                {produtosOP.map((item: any, index: number) => (
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
                        {item.produto.trim() === '' && (
                            <p className="text-red-500 text-xs">
                                Descrição do produto é obrigatória.
                            </p>
                        )}

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
                            prefix="R$ "
                        />
                        {item.valor < 0 && (
                            <p className="text-red-500 text-xs">
                                Valor não pode ser negativo.
                            </p>
                        )}
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
                        onChange('valorimpostoOP', floatValue || 0);
                    }}
                    decimalSeparator=","
                    allowNegative={false}
                    className="form-control"
                    prefix="R$ "
                />
                {valorimpostoOP < 0 && (
                    <p className="text-red-500 text-xs">
                        Valor do imposto não pode ser negativo.
                    </p>
                )}
            </div>
        </FormSection>
    );
}
