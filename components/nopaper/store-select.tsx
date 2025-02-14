'use client';
import React from 'react';
import { Label } from '@/components/ui/label';
import { fetchFiliais } from '@/hooks/slices/noPaper/noPaperSlice';
import { setOrderState } from '@/hooks/slices/noPaper/orderSlice';
import { RootState } from '@/hooks/store';
import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface FilialSelectProps {
    handleSetState: (key: string, value: any) => void;
    validate: boolean;
}

export const FilialSelect = ({
    handleSetState,
    validate,
}: FilialSelectProps) => {
    const { filiais } = useSelector((state: RootState) => state.noPaper);
    const { lojaOP, ramoOP } = useSelector((state: RootState) => state.order);
    const dispatch = useDispatch();
    const [error, setError] = useState('');
    const [localSearchQuery, setLocalSearchQuery] = useState<any>('');

    useEffect(() => {
        dispatch(
            fetchFiliais({ query: localSearchQuery, ramo: ramoOP || '' }) as any
        );
    }, [dispatch, localSearchQuery, ramoOP]);

    const handleSelectChange = (value: string) => {
        setError('');
        dispatch(setOrderState({ lojaOP: value }));
        handleSetState('lojaOP', value);
    };

    useEffect(() => {
        if (validate && !lojaOP) {
            setError('Filial não pode ser vazia.');
        }
    }, [validate, lojaOP]);

    return (
        <div>
            <Label className="text-xs font-semibold text-primary uppercase">
                Selecione a Filial que Pagará
            </Label>
            <Select
                disabled={!ramoOP}
                showSearch
                className="w-full"
                value={lojaOP}
                onChange={handleSelectChange}
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
        </div>
    );
};
