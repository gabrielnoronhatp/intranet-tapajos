'use client';
import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/hooks/store';
import {
    fetchServiceTypes,
    setCurrentContract,
} from '@/hooks/slices/contracts/contractSlice';
import { createServiceType } from '@/hooks/slices/noPaper/noPaperSlice';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Input, Space } from 'antd';

interface ServiceTypeSelectProps {
    fieldValue: string | number;
    handleSelectChange: (value: string) => void;
}

export const ServiceTypeSelect = ({
    fieldValue,
    handleSelectChange,
}: ServiceTypeSelectProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const { serviceTypes, loading, currentContract } = useSelector(
        (state: RootState) => state.contracts
    );
    const [isLoading, setIsLoading] = useState(false);
    const [newTypeName, setNewTypeName] = useState('');

    useEffect(() => {
        // TODO: FOUND A WAY TO DELETE THIS ANY
        dispatch(fetchServiceTypes());
    }, [dispatch]);

    const handleChange = (value: string) => {
        handleSelectChange(value);
        dispatch(
            setCurrentContract({
                ...currentContract,
                idtipo: value,
            })
        );
    };

    const handleCreateType = async () => {
        if (!newTypeName.trim()) return;

        setIsLoading(true);
        try {
            const result = await dispatch(
                createServiceType(newTypeName)
            ).unwrap();
            handleSelectChange(result.id.toString());
            dispatch(
                setCurrentContract({
                    ...currentContract,
                    idtipo: result.id.toString(),
                })
            );
            setNewTypeName('');
            message.success('Tipo de serviço criado com sucesso!');
        } catch (error) {
            console.log(error);
            message.error('Erro ao criar tipo de serviço');
        } finally {
            setIsLoading(false);
        }
    };

    const addTypeDropdown = (menu: React.ReactNode) => (
        <div>
            {menu}
            <Divider style={{ margin: '8px 0' }} />
            <Space style={{ padding: '0 8px 4px' }}>
                <Input
                    placeholder="Digite o novo tipo"
                    value={newTypeName.toUpperCase()}
                    onChange={(e) =>
                        setNewTypeName(e.target.value.toUpperCase())
                    }
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleCreateType();
                        }
                    }}
                />
                <Button
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={handleCreateType}
                    loading={isLoading}
                >
                    Adicionar
                </Button>
            </Space>
        </div>
    );

    const options = Object.entries(serviceTypes).map(([id, descricao]) => ({
        value: id,
        label: descricao.toUpperCase(),
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
                value={
                    fieldValue
                        ? String(fieldValue)
                        : currentContract.idtipo
                          ? String(currentContract.idtipo)
                          : undefined
                }
                onChange={handleChange}
                loading={loading || isLoading}
                options={options}
                filterOption={(input, option) =>
                    (option?.label ?? '')
                        .toLowerCase()
                        .includes(input.toLowerCase())
                }
                style={{ width: '100%' }}
                dropdownRender={addTypeDropdown}
            />
        </div>
    );
};
