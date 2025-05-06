'use client';

import React from 'react';
import { FormSection } from '../form-section';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCentrosCusto } from '@/hooks/slices/noPaper/noPaperSlice';
import { RootState } from '@/hooks/store';
import { NumericFormat } from 'react-number-format';
import { OrderState } from '@/types/noPaper/Order/OrderState';

import { OrderData } from '@/types/noPaper/Order/OrderData';
import { Item } from '@/types/noPaper/Order/ItemOrder';
interface TaxesDataProps {
    data: OrderData;
    onChange: (field: keyof OrderState, value: string | number) => void;
}

export default function TaxesData({ data, onChange }: TaxesDataProps) {
    const dispatch = useDispatch();

    const { qtitensOP, valorimpostoOP, produtosOP } = data;

    const { searchQuery } = useSelector((state: RootState) => state.noPaper);

    useEffect(() => {
        dispatch(fetchCentrosCusto('') as any);
    }, [dispatch, searchQuery]);

    const handleItensChange = (
        index: number,
        field: 'produto' | 'valor' | 'centroCusto',
        value: string | number
    ) => {
        const updatedItens = produtosOP?.map((item: Item, i: number) =>
            i === index ? { ...item, [field]: value } : item
        );
        onChange('produtosOP', updatedItens as any);
    };

    const handleQuantidadeProdutosChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const quantidade = parseInt(e.target.value, 10);
        onChange('qtitensOP', quantidade);

        const newItens: any = Array.from(
            { length: quantidade },
            (index: number) =>
                produtosOP?.[index] || { produto: '', valor: 0, centroCusto: [] }
        );
        onChange('produtosOP', newItens as any);
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
                {qtitensOP && qtitensOP < 1 && (
                    <p className="text-red-500 text-xs">
                        A quantidade de itens deve ser pelo menos 1.
                    </p>
                )}

                {produtosOP?.map((item: Item, index: number) => (
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
                {valorimpostoOP && valorimpostoOP < 0 && (
                    <p className="text-red-500 text-xs">
                        Valor do imposto não pode ser negativo.
                    </p>
                )}
            </div>
        </FormSection>
    );
}
