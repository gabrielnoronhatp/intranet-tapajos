'use client';
import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/hooks/store';
import { fetchServiceTypes, setCurrentContract } from '@/hooks/slices/contracts/contractSlice';
import { createServiceType } from '@/hooks/slices/noPaper/noPaperSlice';

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
    const [isLoading, setIsLoading] = useState(false);

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

    const handleCreateType = async (input: string) => {
        setIsLoading(true);
        try {
            const result = await dispatch(createServiceType(input) as any   ).unwrap();
            handleSelectChange(result.id);
            message.success('Tipo de serviço criado com sucesso!');
        } catch (error) {
            message.error('Erro ao criar tipo de serviço');
        } finally {
            setIsLoading(false);
        }
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
                id="tipo"
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