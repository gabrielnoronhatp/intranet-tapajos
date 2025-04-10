'use client';
import React, { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Escala, IEscala } from '@/types/Trade/ITrade';

interface MetaTableProps {
    isEditing?: boolean;
    campaignId?: string;
    escala?: {
        metaGeralRange: string[];
        metaVendedorRange: string[];
        valoresMeta: {
            idMetaGeral: number;
            idMetaVendedor: number;
            celValordaMeta: number;
        }[];
    } | null;
    onEscalaSubmit: (formattedMetas: IEscala[] | Escala[]) => void;
}

export const MetaTable: React.FC<MetaTableProps> = ({
    campaignId,
    escala,
    onEscalaSubmit,
}) => {
    const defaultMetaGeralRange = ['90-99', '100-129', '130-139'];
    const defaultMetaVendedorRange = ['90-99', '100-129', '130-139'];
    const [metaGeralRange, setMetaGeralRange] = useState<string[]>(
        escala?.metaGeralRange || defaultMetaGeralRange
    );
    const [metaVendedorRange, setMetaVendedorRange] = useState<string[]>(
        escala?.metaVendedorRange || defaultMetaVendedorRange
    );
  

    const [metas, setMetas] = useState<number[][]>([[]]);
    const [isLoading] = useState(false);

  

    useEffect(() => {
        if (escala?.valoresMeta && escala.valoresMeta.length > 0) {
            const maxMetaGeral = Math.max(
                ...escala.valoresMeta.map((v) => v.idMetaGeral)
            );
            const maxMetaVendedor = Math.max(
                ...escala.valoresMeta.map((v) => v.idMetaVendedor)
            );

            const newMetas = Array(maxMetaGeral)
                .fill(null)
                .map(() => Array(maxMetaVendedor).fill(0));

            escala.valoresMeta.forEach((meta) => {
                const rowIndex = meta.idMetaGeral - 1;
                const colIndex = meta.idMetaVendedor - 1;
                if (rowIndex >= 0 && colIndex >= 0) {
                    newMetas[rowIndex][colIndex] = meta.celValordaMeta;
                }
            });

            setMetas(newMetas);
        } else if (metaGeralRange.length > 0 && metaVendedorRange.length > 0) {
            const newMetas = Array(metaGeralRange.length)
                .fill(null)
                .map(() => Array(metaVendedorRange.length).fill(0));
            setMetas(newMetas);
        }
    }, [escala, metaGeralRange.length, metaVendedorRange.length]);

    const validateRangeFormat = (value: string) => {
        const rangePattern = /^\d{2}-\d{2}$/;
        return rangePattern.test(value);
    };

    const handleMetaGeralRangeChange = (index: number, value: string) => {
        if (validateRangeFormat(value) || value === '') {
            const newMetaGeralRange = [...metaGeralRange];
            newMetaGeralRange[index] = value;
            setMetaGeralRange(newMetaGeralRange);
        }
    };

    const handleMetaVendedorRangeChange = (index: number, value: string) => {
        if (validateRangeFormat(value) || value === '') {
            const newMetaVendedorRange = [...metaVendedorRange];
            newMetaVendedorRange[index] = value;
            setMetaVendedorRange(newMetaVendedorRange);
        }
    };

    const handleMetaVendedorChange = (
        rowIndex: number,
        colIndex: number,
        value: string
    ) => {
        const newMetas: number[][] = metas.map((row, r) => {
            if (r === rowIndex) {
                return row.map((cell, c) => (c === colIndex ? value : cell));
            }
            return row;
        });
        setMetas(newMetas);
    };

    const prepareFormattedMetas = () => {
        const formattedMetas = [];

        const campaignIdNumber = campaignId ? parseInt(campaignId) : 1;

        formattedMetas.push({
            id: campaignIdNumber,
            linha: '',
            ...metaVendedorRange.reduce(
                    (acc: { [key: string]: string }, range: string, index: number) => {
                    acc[`coluna${index + 1}`] = range;
                    return acc;
                },
                {}
            ),
        });

        metaGeralRange.forEach((rangeGeral: string, index: number) => {
            formattedMetas.push({
                id: campaignIdNumber,
                linha: rangeGeral,
                ...metaVendedorRange.reduce((acc: { [key: string]: number }, _, colIndex: number) => {
                    acc[`coluna${colIndex + 1}`] =
                        metas[index]?.[colIndex] || 0;
                    return acc;
                }, {}),
            });
        });

        return formattedMetas;
    };

    useEffect(() => {
        if (onEscalaSubmit) {
            const formattedMetas = prepareFormattedMetas();
            onEscalaSubmit(formattedMetas);
        }
    }, [metaGeralRange, metaVendedorRange, metas, campaignId]);

    if (isLoading) {
        return (
            <div className="text-center py-4">
                Carregando tabela de metas...
            </div>
        );
    }

    return (
        <div>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b-2 border-gray-200"></th>
                        {metaVendedorRange.map((range, index) => (
                            <th
                                key={index}
                                className="py-2 px-4 border-b-2 border-gray-200"
                            >
                                <input
                                    type="text"
                                    value={range}
                                    onChange={(e) =>
                                        handleMetaVendedorRangeChange(
                                            index,
                                            e.target.value
                                        )
                                    }
                                    placeholder="00-00"
                                    maxLength={5}
                                    className="w-full text-center"
                                />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {metaGeralRange.map((rangeGeral, rowIndex) => (
                        <tr key={rowIndex}>
                            <td className="py-2 px-4 border-b border-gray-200">
                                <input
                                    value={rangeGeral}
                                    onChange={(e) =>
                                        handleMetaGeralRangeChange(
                                            rowIndex,
                                            e.target.value
                                        )
                                    }
                                    className="w-20 text-center"
                                />
                            </td>
                            {metaVendedorRange.map((_, colIndex) => (
                                <td
                                    key={colIndex}
                                    className="py-2 px-4 border-b border-gray-200 text-center"
                                >
                                    <Input
                                        type="string"
                                        value={metas[rowIndex]?.[colIndex] || 0}
                                        onChange={(e) =>
                                            handleMetaVendedorChange(
                                                rowIndex,
                                                colIndex,
                                                e.target.value
                                            )
                                        }
                                        className="w-20 text-center"
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
