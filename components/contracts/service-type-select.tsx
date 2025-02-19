'use client';
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/hooks/store';
import { fetchServiceTypes, setCurrentContract } from '@/hooks/slices/contracts/contractSlice';

interface ServiceTypeSelectProps {
    handleSetState: (key: string, value: string) => void;
    fieldValue: string;
    handleSelectChange: (value: string) => void;
}

export const ServiceTypeSelect = ({
    handleSetState,
    fieldValue,
    handleSelectChange,
}: ServiceTypeSelectProps) => {
    const dispatch = useDispatch();
    const { serviceTypes, loading, currentContract } = useSelector(
        (state: RootState) => state.contracts
    );

    useEffect(() => {
        // TODO: FOUND A WAY TO DELETE THIS ANY
        dispatch(fetchServiceTypes() as any);
    }, [dispatch]);

    const handleChange = (value: string) => {
        handleSelectChange(value);
        dispatch(
            setCurrentContract({
                ...currentContract,
    
            })
        );
    };

    const options = Object.entries(serviceTypes).map(([id, descricao]) => ({
        value: id,
        label: descricao,
    }));

    return (
        <div>
            <Label className="text-xs font-semibold text-primary uppercase">
                Tipo de Serviço
            </Label>
            <Select
                showSearch
                placeholder="Selecione o tipo de serviço"
                optionFilterProp="children"
                value={fieldValue || currentContract.idtipo}
                onChange={handleChange}
                loading={loading}
                options={options}
                filterOption={(input, option) =>
                    (option?.label ?? '')
                        .toLowerCase()
                        .includes(input.toLowerCase())
                }
                style={{ width: '100%' }}
            />
        </div>
    );
}; 