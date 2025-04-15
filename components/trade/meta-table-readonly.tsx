'use client';
import React, { useState, useEffect } from 'react';

interface MetaTableReadOnlyProps {
    metaGeralRange: string[];
    metaVendedorRange: string[];
    escala?: {
        metaGeralRange: string[];
        metaVendedorRange: string[];
        valoresMeta: {
            idMetaGeral: number;
            idMetaVendedor: number;
            celValordaMeta: number;
        }[];
    };
}

export const MetaTableReadOnly: React.FC<MetaTableReadOnlyProps> = ({
    metaGeralRange,
    metaVendedorRange,
    escala,
}) => {
    const [metas, setMetas] = useState<number[][]>([[]]);

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

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b-2 border-gray-200"></th>
                        {metaVendedorRange.map((range, index) => (
                            <th
                                key={index}
                                className="py-2 px-4 border-b-2 border-gray-200 text-center"
                            >
                                {range}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {metaGeralRange.map((rangeGeral, rowIndex) => (
                        <tr key={rowIndex}>
                            <td className="py-2 px-4 border-b border-gray-200 font-medium">
                                {rangeGeral}
                            </td>
                            {metaVendedorRange.map((_, colIndex) => (
                                <td
                                    key={colIndex}
                                    className="py-2 px-4 border-b border-gray-200 text-center"
                                >
                                    {metas[rowIndex]?.[colIndex] || 0}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
