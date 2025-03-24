'use client';
import React, { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { useDispatch } from 'react-redux';
import { sendMetaTable } from '@/hooks/slices/trade/tradeSlice';

interface Vendedor {
    metas: number[];
}

interface MetaTableProps {
    metaGeralRange: string[];
    metaVendedorRange: string[];
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
    };
    onEscalaChange: (formattedMetas: any[]) => void;
}

export const MetaTable: React.FC<MetaTableProps> = ({
    metaGeralRange: initialMetaGeralRange,
    metaVendedorRange: initialMetaVendedorRange,
    isEditing = false,
    campaignId,
    escala,
    onEscalaChange,
}) => {
    const [metaGeralRange, setMetaGeralRange] = useState<string[]>(
        escala?.metaGeralRange || initialMetaGeralRange
    );
    const [metaVendedorRange, setMetaVendedorRange] = useState<string[]>(
        escala?.metaVendedorRange || initialMetaVendedorRange
    );
    const [vendedores, setVendedores] = useState<Vendedor[]>([
        {
            metas: [],
        },
    ]);

    const [metas, setMetas] = useState<number[][]>([[]]);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if (escala?.valoresMeta && escala.valoresMeta.length > 0) {
            const maxMetaGeral = Math.max(...escala.valoresMeta.map(v => v.idMetaGeral));
            const maxMetaVendedor = Math.max(...escala.valoresMeta.map(v => v.idMetaVendedor));
            
            const newMetas = Array(maxMetaGeral)
                .fill(null)
                .map(() => Array(maxMetaVendedor).fill(0));
            
            escala.valoresMeta.forEach(meta => {
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
                .map((_, i) => Array(metaVendedorRange.length).fill(0));
            setMetas(newMetas);
        }
    }, [escala, metaGeralRange.length, metaVendedorRange.length]);

    // useEffect(() => {
    //     if (onEscalaChange) {
    //         const formattedMetas = metaGeralRange.map((rangeGeral, rowIndex) => ({
    //             id: rowIndex + 1,
    //             linha: rangeGeral,
    //             ...metaVendedorRange.reduce<Record<string, number>>((acc, rangeVendedor, colIndex) => {
    //                 acc[`col${colIndex + 1}`] = metas[rowIndex][colIndex];
    //                 return acc;
    //             }, {}),            }));

    //         onEscalaChange(formattedMetas);
    //     }
    // }, [metaGeralRange, metaVendedorRange, metas, onEscalaChange]);

    const validateRangeFormat = (value: string) => {
        const rangePattern = /^\d{2}-\d{2}$/;
        return rangePattern.test(value);
    };

    const adicionarRangeMetaGeral = () => {
        const novoRange = '00-00';

        if (metaGeralRange.length < 3) {
            const newMetaGeralRange = [...metaGeralRange, novoRange];
            setMetaGeralRange(newMetaGeralRange);
        }
        const novosVendedores = vendedores.map((vendedor) => {
            const novasMetas = [...vendedor.metas];
            novasMetas.push(0);
            return { ...vendedor, metas: novasMetas };
        });
        setVendedores(novosVendedores);
    };

    const adicionarRangeMetaVendedor = () => {
        const novoRange = '00-00';
       
        if (metaVendedorRange.length < 3) {
            setMetaVendedorRange([...metaVendedorRange, novoRange]);
        }
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
        const newMetas = metas.map((row, r) => {
            if (r === rowIndex) {
                return row.map((cell, c) =>
                    c === colIndex ? Number(value) : cell
                );
            }
            return row;
        });
        setMetas(newMetas);
    };

    const enviarTabelaParaBackend = () => {
        // Criar o array de dados formatados
        const formattedMetas = [];
        
        // Primeira linha: id da campanha, linha vazia, e colunas com os ranges dos vendedores
        formattedMetas.push({
            id: campaignId ? parseInt(campaignId) : 1, // Usa o ID da campanha se disponível
            linha: "", // Primeira linha tem linha vazia
            ...metaVendedorRange.reduce((acc, range, index) => {
                acc[`col${index + 1}`] = range;
                return acc;
            }, {})
        });
        
        // Linhas seguintes: id sequencial, linha com range geral, e colunas com valores numéricos
        metaGeralRange.forEach((rangeGeral, index) => {
            formattedMetas.push({
                id: index + 2, // +2 porque a primeira linha já é id=1
                linha: rangeGeral,
                ...metaVendedorRange.reduce((acc, _, colIndex) => {
                    acc[`col${colIndex + 1}`] = metas[index]?.[colIndex] || 0;
                    return acc;
                }, {})
            });
        });

        // Enviar os dados formatados para o backend
        dispatch(sendMetaTable({
            formattedMetas,
            campaignId: isEditing ? campaignId : undefined
        }) as any);
        
        // Se a função onEscalaChange foi fornecida, chame-a com os dados formatados
        if (onEscalaChange) {
            onEscalaChange(formattedMetas);
        }
    };

    if (isLoading) {
        return <div className="text-center py-4">Carregando tabela de metas...</div>;
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
                                        type="number"
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
            <button
                onClick={enviarTabelaParaBackend}
                className="bg-green-500 text-white px-4 py-2 rounded mt-4"
            >
                Enviar Tabela
            </button>
        </div>
    );
};
