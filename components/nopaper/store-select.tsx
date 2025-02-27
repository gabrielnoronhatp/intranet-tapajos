'use client';
import React from 'react';
import { Label } from '@/components/ui/label';
import { fetchFiliais, fetchLojas } from '@/hooks/slices/noPaper/noPaperSlice';
import { setOrderState } from '@/hooks/slices/noPaper/orderSlice';
import { RootState } from '@/hooks/store';
import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentContract } from '@/hooks/slices/contracts/contractSlice';

interface FilialSelectProps {
    handleSetState: (key: string, value: any) => void;
    validate: boolean;
    fieldValue: string;
    handleSelectChange: (value: string) => void;
    ramo: string;
}

export const FilialSelect = ({
    handleSetState,
    validate,
    fieldValue,
    handleSelectChange,
    ramo,
}: FilialSelectProps) => {
    const { filiais } = useSelector((state: RootState) => state.noPaper);
    const { currentContract } = useSelector((state: RootState) => state.contracts);
    const dispatch = useDispatch();
    const [error, setError] = useState('');
    const searchQuery = useSelector(
        (state: any) => state.noPaper.searchQuery || ''
    )
    const [localSearchQuery, setLocalSearchQuery] = useState<string>(searchQuery);
     

    useEffect(() => {
        dispatch(
            fetchFiliais({ query: localSearchQuery, ramo }) as any
        );
    }, [dispatch, localSearchQuery, ramo]);

    const handleChange = (value: string) => {
        handleSelectChange(value);
        dispatch(setCurrentContract({
            ...currentContract,
            idfilial: value
        }));
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
