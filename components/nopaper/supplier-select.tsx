'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFornecedores } from '@/hooks/slices/noPaper/noPaperSlice';
import { Select } from 'antd';
import { AppDispatch, RootState } from '@/hooks/store';

import { Label } from '@/components/ui/label';

interface FornecedorSelectProps {
    fieldValue: string;
    handleSelectChange: (value: string) => void;
}

export const FornecedorSelect = ({
    fieldValue,
    handleSelectChange,
}: FornecedorSelectProps) => {
    const dispatch = useDispatch<AppDispatch>();

    const searchQuery = useSelector(
        (state: RootState) => state.noPaper.searchQuery || ''
    );
    const { fornecedores } = useSelector((state: RootState) => state.noPaper);
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

    const [error] = useState('');

    useEffect(() => {
        dispatch(fetchFornecedores(localSearchQuery));
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
