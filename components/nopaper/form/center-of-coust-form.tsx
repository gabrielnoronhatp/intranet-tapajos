'use client';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FormSection } from '../form-section';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RootState } from '@/hooks/store';
import { Select } from 'antd';
import { NumericFormat } from 'react-number-format';
import { OrderState } from '@/types/noPaper/Order/OrderState';
import { Item } from '@/types/noPaper/Order/ItemOrder';
import { OrderData } from '@/types/noPaper/Order/OrderData';

interface CenterOfCoustProps {
    data: OrderData;
    onChange: (
        field: keyof OrderState,
        value: OrderState[keyof OrderState]
    ) => void;
}

export default function CenterOfCoust({ data, onChange }: CenterOfCoustProps) {
    const { ccustoOP, produtosOP, valorimpostoOP } = data;
    const { centrosCustoOptions } = useSelector(
        (state: RootState) => state.noPaper
    );

    const [numCenters, setNumCenters] = useState(() => {
        return Array.isArray(ccustoOP) && ccustoOP.length > 0
            ? ccustoOP.length
            : 1;
    });

    const calculateTotalValue = () => {
        const totalProdutos = produtosOP?.reduce(
            (sum: number, product: Item) => sum + (Number(product.valor) || 0),
            0
        ) || 0;
        return totalProdutos - (Number(valorimpostoOP) || 0);
    };

    const distributeValues = () => {
        const totalValue = calculateTotalValue();
        const valorPorCenter = Number((totalValue / numCenters).toFixed(2));

        const newCenters = Array.from(
            { length: numCenters },
            (_, index): { centrocusto: string; valor: number } => {
                const centroExistente = ccustoOP && 
                    index < ccustoOP.length ? ccustoOP[index] : null;

                if (index === numCenters - 1) {
                    const somaAnteriores = valorPorCenter * (numCenters - 1);
                    const valorUltimo = Number(
                        (totalValue - somaAnteriores).toFixed(2)
                    );
                    return {
                        centrocusto: centroExistente?.centrocusto || '',
                        valor: valorUltimo,
                    };
                }

                return {
                    centrocusto: centroExistente?.centrocusto || '',
                    valor: valorPorCenter,
                };
            }
        );

        onChange('ccustoOP', newCenters);
    };

    const handleNumCentersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newNumCenters = Math.max(1, parseInt(e.target.value) || 1);

        setNumCenters(newNumCenters);
    };

    const handleCenterChange = (
        index: number,
        field: 'centrocusto' | 'valor',
        value: string | number
    ) => {
        const updatedCenters = Array.isArray(ccustoOP) ? [...ccustoOP] : [];

        while (updatedCenters.length < numCenters) {
            updatedCenters.push({ centrocusto: '', valor: 0 });
        }

        if (field === 'valor') {
            const novoValor = Number(value);
            const totalValue = calculateTotalValue();

            if (numCenters === 1) {
                updatedCenters[0] = {
                    ...updatedCenters[0],
                    valor: totalValue,
                };
                onChange('ccustoOP', updatedCenters);
                return;
            }

            const valorRestante = totalValue - novoValor;
            const valorPorOutro = Number(
                (valorRestante / (numCenters - 1)).toFixed(2)
            );

            const newCenters = updatedCenters.map((centro, i) => {
                if (i === index) {
                    return { ...centro, valor: novoValor };
                }

                if (i === numCenters - 1 && i !== index) {
                    const somaOutros = updatedCenters
                        .filter(
                            (_, idx) => idx !== index && idx !== numCenters - 1
                        )
                        .reduce((sum) => sum + valorPorOutro, 0);
                    return {
                        ...centro,
                        valor: Number(
                            (totalValue - novoValor - somaOutros).toFixed(2)
                        ),
                    };
                }

                return { ...centro, valor: valorPorOutro };
            });

            onChange('ccustoOP', newCenters);
        } else {
            updatedCenters[index] = {
                ...updatedCenters[index],
                centrocusto: String(value),
            };
            onChange('ccustoOP', updatedCenters);
        }
    };

    useEffect(() => {
        distributeValues();
    }, [numCenters]);

    useEffect(() => {
        if (produtosOP && produtosOP.length > 0) {
            distributeValues();
        }
    }, [produtosOP, valorimpostoOP]);

    useEffect(() => {
        if (
            Array.isArray(ccustoOP) &&
            ccustoOP.length > 0 &&
            ccustoOP.length !== numCenters
        ) {
            setNumCenters(ccustoOP.length);
        }
    }, [data]);

    return (
        <FormSection title="Centro de Custo">
            <div className="space-y-4">
                <div>
                    <Label className="text-xs font-semibold text-primary uppercase">
                        Número de Centros de Custo
                    </Label>
                    <Input
                        type="number"
                        value={numCenters}
                        onChange={handleNumCentersChange}
                        min={1}
                        className="form-control"
                    />
                </div>

                {Array.from({ length: numCenters }).map((_, index) => (
                    <div key={index} className="space-y-2">
                        <Label className="text-xs font-semibold text-primary uppercase">
                            Centro de Custo {index + 1}
                        </Label>
                        <Select
                            showSearch
                            className={`w-full ${!ccustoOP?.[index]?.centrocusto ? 'border-red-500' : ''}`}
                            value={ccustoOP?.[index]?.centrocusto || ''}
                            onChange={(value) =>
                                handleCenterChange(index, 'centrocusto', value)
                            }
                            options={centrosCustoOptions.map((option) => ({
                                value: option.centrocusto,
                                label: option.centrocusto,
                            }))}
                        />

                        <Input
                            type="number"
                            value={ccustoOP?.[index]?.valor || 0}
                            onChange={(e) =>
                                handleCenterChange(
                                    index,
                                    'valor',
                                    e.target.value
                                )
                            }
                            className="form-control w-full p-2 border rounded"
                            prefix="R$ "
                        />
                        {ccustoOP?.[index]?.valor && ccustoOP?.[index]?.valor < 0 && (
                            <p className="text-red-500 text-xs">
                                Valor não pode ser negativo.
                            </p>
                        )}
                    </div>
                ))}
            </div>

            <div>
                <Label className="text-xs font-semibold text-primary uppercase">
                    Valor Total
                </Label>
                <NumericFormat
                    customInput={Input}
                    value={calculateTotalValue()}
                    disabled
                    className="form-control w-full p-2 border rounded bg-gray-100"
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="R$ "
                    decimalScale={2}
                    fixedDecimalScale
                />
            </div>
        </FormSection>
    );
}
