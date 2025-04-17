'use client';
import React, { useState, useEffect } from 'react';
import { Escala, IEscala } from '@/types/Trade/IEscala';

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
    isEditing,
}) => {
    const defaultMetaGeralRange = ['90-99', '100-129', '130-139'];
    const defaultMetaVendedorRange = ['90-99', '100-129', '130-139'];
    const [metaGeralRange, setMetaGeralRange] = useState<string[]>(
        escala?.metaGeralRange || defaultMetaGeralRange
    );
    const [metaVendedorRange, setMetaVendedorRange] = useState<string[]>(
        escala?.metaVendedorRange || defaultMetaVendedorRange
    );
    const [metas, setMetas] = useState<string[][]>([[]]);
    const [isLoading] = useState(false);

    const [lastLoadedId, setLastLoadedId] = useState<string | undefined>(
        undefined
    );

    useEffect(() => {
        if (
            campaignId &&
            campaignId !== lastLoadedId &&
            escala?.valoresMeta &&
            escala.valoresMeta.length > 0
        ) {
            const maxMetaGeral = Math.max(
                ...escala.valoresMeta.map((v) => v.idMetaGeral)
            );
            const maxMetaVendedor = Math.max(
                ...escala.valoresMeta.map((v) => v.idMetaVendedor)
            );
            const newMetas = Array(maxMetaGeral)
                .fill(null)
                .map(() => Array(maxMetaVendedor).fill(''));
            
            // Preencher a matriz com os valores originais
            escala.valoresMeta.forEach((meta) => {
                const rowIndex = meta.idMetaGeral - 1;
                const colIndex = meta.idMetaVendedor - 1;
                if (rowIndex >= 0 && colIndex >= 0) {
                    newMetas[rowIndex][colIndex] =
                        meta.celValordaMeta.toString();
                }
            });
            
            setMetas(newMetas);
            setLastLoadedId(campaignId);
        } else if (
            campaignId &&
            campaignId !== lastLoadedId &&
            escala &&
            (!escala.valoresMeta || escala.valoresMeta.length === 0) &&
            metaGeralRange.length > 0 &&
            metaVendedorRange.length > 0
        ) {
            // Caso não haja valores de meta, inicializar uma matriz vazia
            const newMetas = Array(metaGeralRange.length)
                .fill(null)
                .map(() => Array(metaVendedorRange.length).fill(''));
            setMetas(newMetas);
            setLastLoadedId(campaignId);
        }
    }, [campaignId, escala, lastLoadedId, metaGeralRange.length, metaVendedorRange.length]);
    const validateRangeFormat = (value: string) => {
        const rangePattern = /^\d{2}-\d{2}$/;
        return rangePattern.test(value);
    };

    const handleMetaGeralRangeChange = (index: number, value: string) => {
        if (validateRangeFormat(value) || value === '') {
            const newMetaGeralRange = [...metaGeralRange];
            newMetaGeralRange[index] = value;
            setMetaGeralRange(newMetaGeralRange);

            // Atualizar o componente pai
            updateParent(metas, newMetaGeralRange, metaVendedorRange);
        }
    };

    const handleMetaVendedorRangeChange = (index: number, value: string) => {
        if (validateRangeFormat(value) || value === '') {
            const newMetaVendedorRange = [...metaVendedorRange];
            newMetaVendedorRange[index] = value;
            setMetaVendedorRange(newMetaVendedorRange);

            // Atualizar o componente pai
            updateParent(metas, metaGeralRange, newMetaVendedorRange);
        }
    };

    const handleMetaVendedorChange = (
        rowIndex: number,
        colIndex: number,
        value: string
    ) => {
        const newMetas = [...metas];

        if (!newMetas[rowIndex]) {
            newMetas[rowIndex] = [];
        }

        newMetas[rowIndex][colIndex] = value || '';

        setMetas(newMetas);

        // Atualizar o componente pai
        updateParent(newMetas, metaGeralRange, metaVendedorRange);
    };

    // Função para atualizar o componente pai
    const updateParent = (
        currentMetas: string[][],
        currentMetaGeralRange: string[],
        currentMetaVendedorRange: string[]
    ) => {
        const formattedMetas = prepareFormattedMetas(
            currentMetas,
            currentMetaGeralRange,
            currentMetaVendedorRange
        );

        onEscalaSubmit(formattedMetas);
    };

    const prepareFormattedMetas = (
        currentMetas: string[][],
        currentMetaGeralRange: string[],
        currentMetaVendedorRange: string[]
    ) => {
        const formattedMetas = [];
        const campaignIdNumber = campaignId ? parseInt(campaignId) : 1;

        // Primeira linha com os ranges do vendedor
        formattedMetas.push({
            id: campaignIdNumber,
            linha: '',
            ...currentMetaVendedorRange.reduce(
                (
                    acc: { [key: string]: string },
                    range: string,
                    index: number
                ) => {
                    acc[`coluna${index + 1}`] = range;
                    return acc;
                },
                {}
            ),
        });

        // Obter os valores originais do escala para usar quando não houver alterações
        const originalValues: Record<string, number> = {};
        if (escala?.valoresMeta && escala.valoresMeta.length > 0) {
            escala.valoresMeta.forEach(meta => {
                const key = `${meta.idMetaGeral}_${meta.idMetaVendedor}`;
                originalValues[key] = meta.celValordaMeta;
            });
        }

        // Linhas seguintes com os valores
        currentMetaGeralRange.forEach(
            (rangeGeral: string, rowIndex: number) => {
                const row = {
                    id: campaignIdNumber,
                    linha: rangeGeral,
                } as Record<string, string | number>;

                currentMetaVendedorRange.forEach((_, colIndex) => {
                    // Obter o valor da célula atual
                    const cellValue = currentMetas[rowIndex]?.[colIndex] || '';
                    
                    // Chave para buscar o valor original
                    const originalKey = `${rowIndex + 1}_${colIndex + 1}`;
                    
                    if (cellValue !== '') {
                        // Se há um valor na célula, converte para número
                        const normalizedValue = cellValue.replace(',', '.');
                        const numValue = parseFloat(normalizedValue);
                        
                        if (!isNaN(numValue)) {
                            row[`coluna${colIndex + 1}`] = numValue;
                        } else {
                            // Se não for um número válido, usa o valor original ou 0
                            row[`coluna${colIndex + 1}`] = originalValues[originalKey] || 0;
                        }
                    } else {
                        // Se a célula estiver vazia, usa o valor original ou 0
                        row[`coluna${colIndex + 1}`] = originalValues[originalKey] || 0;
                    }
                });

                formattedMetas.push(row);
            }
        );

        console.log('Enviando formattedMetas:', formattedMetas);
        return formattedMetas;
    };

    // Inicializar o componente pai com os dados quando o componente montar
    useEffect(() => {
        if (metas.length > 0) {
            updateParent(metas, metaGeralRange, metaVendedorRange);
        }
    }, []);

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
                                    <input
                                        type="text"
                                        value={
                                            metas[rowIndex]?.[colIndex] || ''
                                        }
                                        onChange={(e) =>
                                            handleMetaVendedorChange(
                                                rowIndex,
                                                colIndex,
                                                e.target.value
                                            )
                                        }
                                        className="w-20 text-center border border-gray-300 rounded-md p-1"
                                        disabled={!isEditing}
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
