'use client';
import React from 'react';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFornecedores } from '@/hooks/slices/noPaper/noPaperSlice';
import { Select } from 'antd';
import { RootState } from '@/hooks/store';
import { setOrderState } from '@/hooks/slices/noPaper/orderSlice';
import { setCurrentContract } from '@/hooks/slices/contracts/contractSlice';

interface FornecedorSelectProps {
    handleSetState: (key: string, value: any) => void;
    fieldValue: string;
    handleSelectChange: (value: string) => void;
}

export const FornecedorSelect = ({
    handleSetState,
    fieldValue,
    handleSelectChange,
}: FornecedorSelectProps) => {
    const dispatch = useDispatch();

    const searchQuery = useSelector(
        (state: any) => state.noPaper.searchQuery || ''
    );
    const { fornecedores } = useSelector((state: RootState) => state.noPaper);
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

    const [error, setError] = useState('');

    useEffect(() => {
        dispatch(fetchFornecedores(localSearchQuery) as any);
    }, [dispatch, localSearchQuery]);

    const options = fornecedores.map((fornecedor) => ({
        value: fornecedor.fornecedor,
        label: fornecedor.fornecedor,
    }));

    return (
        <div>
            <Label className="text-xs font-semibold text-primary uppercase">
                Selecione o Fornecedor
            </Label>
            <Select
                showSearch
                placeholder="Pesquisar fornecedor..."
                optionFilterProp="children"
                value={fieldValue}
                onChange={handleSelectChange}
                onSearch={(value) => setLocalSearchQuery(value.toUpperCase())}
                filterOption={(input, option) =>
                    (option?.label ?? '')
                        .toLowerCase()
                        .includes(input.toLowerCase())
                }
                options={options}
                style={{ width: '100%' }}
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>
    );
};
