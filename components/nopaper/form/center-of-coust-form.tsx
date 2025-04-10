'use client';
import React from 'react';
import {  useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { FormSection } from '../form-section';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RootState } from '@/hooks/store';
import { Select } from 'antd';
import { NumericFormat } from 'react-number-format';
import { Item, OrderData, OrderState } from '@/types/noPaper/Order/OrderTypes';
import { CentroCusto } from '@/types/noPaper/Order/CentroCustoType';
interface CenterOfCoustProps {
    data: OrderData;
    onChange: (field: keyof OrderState, value: string | number) => void;
}

export default function CenterOfCoust({ data, onChange }: CenterOfCoustProps) {
    
    const { ccustoOP, produtosOP, valorimpostoOP } = data;
    const { centrosCustoOptions } = useSelector(
        (state: RootState) => state.noPaper
    );

    const [numCenters, setNumCenters] = useState(ccustoOP.length || 1);

    const calculateTotalValue = () => {
        const totalProdutos = produtosOP.reduce(
            (sum: number, product: Item) => sum + (Number(product.valor) || 0),
            0
        );
        return totalProdutos - (Number(valorimpostoOP) || 0);
    };

    const updateCenterValues = () => {
        const totalValue = calculateTotalValue();
        const valuePerCenter = totalValue / numCenters;

        const updatedCenters = Array.from(
            { length: numCenters },
            (_, index) => ({
                centrocusto: ccustoOP[index]?.centrocusto || '',
                valor: valuePerCenter,
            })
        );

        onChange('ccustoOP', updatedCenters);
    };

    useEffect(() => {
        updateCenterValues();
    }, [numCenters, produtosOP, valorimpostoOP]);

    const handleNumCentersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newNumCenters = Math.max(1, parseInt(e.target.value) || 1);
        setNumCenters(newNumCenters);
    };

    const handleCenterChange = (
        index: number,
        field: 'centrocusto' | 'valor',
        value: string | number
    ) => {
        let updatedCenters = [...ccustoOP];

        if (field === 'valor') {
            const totalValue = calculateTotalValue();
            const remaining = totalValue - Number(value);
            const otherCenters = numCenters - 1;

            if (otherCenters > 0) {
                const valueForOthers = remaining / otherCenters;

                updatedCenters = updatedCenters.map(
                    (center: CentroCusto, i: number) => {
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
                    }
                );
            }
        } else {
            updatedCenters = updatedCenters.map((center: CentroCusto, i: number) =>
                i === index ? { ...center, [field]: value } : center
            );
        }

        onChange('ccustoOP', updatedCenters);
    };

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
                            className={`w-full ${!ccustoOP[index]?.centrocusto ? 'border-red-500' : ''}`}
                            value={ccustoOP[index]?.centrocusto || undefined}
                            onChange={(value) =>
                                handleCenterChange(index, 'centrocusto', value)
                            }
                            options={centrosCustoOptions.map((option: CentroCusto) => ({
                                value: option.centrocusto,
                                label: option.centrocusto,
                            }))}
                        />

                        <Input
                            type="number"
                            value={ccustoOP[index]?.valor || 0}
                            onChange={(e) => {
                                handleCenterChange(
                                    index,
                                    'valor',
                                    e.target.value
                                );
                            }}
                            className="form-control w-full p-2 border rounded"
                            prefix="R$ "
                        />
                        {ccustoOP[index]?.valor < 0 && (
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
