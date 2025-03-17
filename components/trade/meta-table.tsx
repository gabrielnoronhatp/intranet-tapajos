'use client';
import React, { useState, useEffect } from 'react';
import { Input } from '../ui/input';

interface Vendedor {
    metas: number[];
}

interface MetaTableProps {
    vendedores: Vendedor[];
    metaGeralRange: string[];
    metaVendedorRange: string[];
    metaGeralCampanha: number;
}

export const MetaTable: React.FC<MetaTableProps> = ({
    vendedores: initialVendedores,
    metaGeralRange: initialMetaGeralRange,
    metaVendedorRange: initialMetaVendedorRange,
    metaGeralCampanha,
}) => {
    const [metaGeralRange, setMetaGeralRange] = useState<string[]>(initialMetaGeralRange);
    const [metaVendedorRange, setMetaVendedorRange] = useState<string[]>(initialMetaVendedorRange);
    const [vendedores, setVendedores] = useState<Vendedor[]>(initialVendedores);

   
    useEffect(() => {
        if (metaGeralRange.length > 0 && vendedores.length > 0) {
            const updatedVendedores = vendedores.map(vendedor => {
                const updatedMetas = [...vendedor.metas];
                while (updatedMetas.length < metaGeralRange.length) {
                    updatedMetas.push(0);
                }
                return { ...vendedor, metas: updatedMetas };
            });
            setVendedores(updatedVendedores);
        }
    }, [metaGeralRange.length]);

    const validateRangeFormat = (value: string) => {
        const rangePattern = /^\d{2}-\d{2}$/;
        return rangePattern.test(value);
    };

    const adicionarRangeMetaGeral = () => {
        const novoRange = "00-00";
        const newMetaGeralRange = [...metaGeralRange, novoRange];
        setMetaGeralRange(newMetaGeralRange);

        const novosVendedores = vendedores.map(vendedor => {
            const novasMetas = [...vendedor.metas];
            novasMetas.push(0);
            return { ...vendedor, metas: novasMetas };
        });
        setVendedores(novosVendedores);
    };

    const adicionarRangeMetaVendedor = () => {
        const novoRange = "00-00";
        setMetaVendedorRange([...metaVendedorRange, novoRange]);
    };

    const handleMetaGeralRangeChange = (index: number, value: string) => {
        if (validateRangeFormat(value) || value === "") {
            const newMetaGeralRange = [...metaGeralRange];
            newMetaGeralRange[index] = value;
            setMetaGeralRange(newMetaGeralRange);
        }
    };

    const handleMetaVendedorRangeChange = (index: number, value: string) => {
        if (validateRangeFormat(value) || value === "") {
            const newMetaVendedorRange = [...metaVendedorRange];
            newMetaVendedorRange[index] = value;
            setMetaVendedorRange(newMetaVendedorRange);
        }
    };


    const handleMetaVendedorChange = (vendedorIndex: number, indexVendedor: number, value: string) => {
        const newVendedores = [...vendedores];
        newVendedores[vendedorIndex].metas[indexVendedor] = Number(value);
        setVendedores(newVendedores);
    };


    return (
        <div>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b-2 border-gray-200"></th>
                        {metaVendedorRange.map((range, index) => (
                            <th key={index} className="py-2 px-4 border-b-2 border-gray-200">
                                <input
                                    type="text"
                                    value={range}
                                    onChange={(e) => handleMetaVendedorRangeChange(index, e.target.value)}
                                    placeholder="00-00"
                                    maxLength={5}
                                    className="w-full text-center"
                                />
                            </th>
                        ))}
                        <th className="py-2 px-4 border-b-2 border-gray-200">
                            <button
                                onClick={adicionarRangeMetaVendedor}
                                className="bg-blue-500 text-white px-2 py-1 rounded"
                            >
                                +
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {metaGeralRange.map((rangeGeral, indexGeral) => (
                        <tr key={indexGeral}>
                            <td className="py-2 px-4 border-b border-gray-200">
                                <input
                                    type="text"
                                    value={rangeGeral}
                                    onChange={(e) => handleMetaGeralRangeChange(indexGeral, e.target.value)}
                                    placeholder="00-00"
                                    maxLength={5}
                                    className="w-full text-center"
                                />
                            </td>
                            {metaVendedorRange.map((rangeVendedor, indexVendedor) => (
                                <td key={indexVendedor} className="py-2 px-4 border-b border-gray-200 text-center">
                                    {vendedores.map((vendedor, vendedorIndex) => (
                                        <Input key={vendedorIndex} value={vendedor.metas[indexVendedor]} onChange={(e) => handleMetaVendedorChange(vendedorIndex, indexVendedor, e.target.value)} />    
                                    
                                    ))}
                                </td>
                            ))}
                        </tr>
                    ))}
                    <tr>
                        <td className="py-2 px-4 border-b border-gray-200">
                            <button
                                onClick={adicionarRangeMetaGeral}
                                className="bg-blue-500 text-white px-2 py-1 rounded"
                            >
                                +
                            </button>
                        </td>
                        {metaVendedorRange.length > 0 && (
                            <td colSpan={metaVendedorRange.length} className="py-2 px-4 border-b border-gray-200"></td>
                        )}
                    </tr>
                </tbody>
            </table>
            
          
        </div>
    );
};