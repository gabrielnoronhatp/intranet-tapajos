'use client';
import React from 'react';
import { Label } from '@/components/ui/label';
import { fetchFiliais } from '@/hooks/slices/noPaper/noPaperSlice';

import { AppDispatch, RootState } from '@/hooks/store';
import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentContract } from '@/hooks/slices/contracts/contractSlice';

interface FilialSelectProps {
    fieldValue: string;
    handleSelectChange: (value: string) => void;
    ramo: string;
}

export const FilialSelect = ({
    fieldValue,
    handleSelectChange,
    ramo,
}: FilialSelectProps) => {
    const { filiais } = useSelector((state: RootState) => state.noPaper);
    const { currentContract } = useSelector(
        (state: RootState) => state.contracts
    );
    const dispatch = useDispatch<AppDispatch>();
    const [error] = useState('');
    const searchQuery = useSelector(
        (state: RootState) => state.noPaper.searchQuery || ''
    );
    const [localSearchQuery, setLocalSearchQuery] =
        useState<string>(searchQuery);

    useEffect(() => {
        dispatch(fetchFiliais({ query: localSearchQuery, ramo }));
    }, [dispatch, localSearchQuery, ramo]);

    const handleChange = (value: string) => {
        handleSelectChange(value);
        dispatch(
            setCurrentContract({
                ...currentContract,
                idfilial: value,
            })
        );
    };

    return (
        <div>
            <Label className="text-xs font-semibold text-primary uppercase">
                Selecione a Filial que Pagará
            </Label>
            <Select
                showSearch
                className="w-full"
                value={fieldValue || currentContract.idfilial}
                onChange={handleChange}
                onSearch={(value) => setLocalSearchQuery(value)}
                placeholder="Selecione uma filial..."
                filterOption={(input: string, option: any) =>
                    (option?.children ?? '')
                        .toLowerCase()
                        .includes(input.toLowerCase())
                }
            >
                {filiais.map((filial) => (
                    <Select.Option key={filial.loja} value={filial.loja}>
                        {filial.loja}
                    </Select.Option>
                ))}
            </Select>
            {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>
    );
};
