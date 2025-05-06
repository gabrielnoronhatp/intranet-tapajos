'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Select, Input } from 'antd';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FilialSelect } from '@/components/nopaper/store-select';
import { FornecedorSelect } from '@/components/nopaper/supplier-select';
import { Label } from '@/components/ui/label';
import { FormSection } from '../form-section';
import { setOrderState } from '@/hooks/slices/noPaper/orderSlice';
import { OrderState } from '@/types/noPaper/Order/OrderState';
import { OrderData } from '@/types/noPaper/Order/OrderData';
interface OriginDataProps {
    data: OrderData; // Alterado para OrderData
    onChange: (field: keyof OrderState, value: string | number) => void; // Alterado para OrderData
}

const OriginData: React.FC<OriginDataProps> = ({ data }) => {
    const {
        ramoOP,
        opcaoLancOP,
        notaOP,
        serieOP,
        fornecedorOP,
        dtlanc,
        lojaOP,
        userOP,
    } = data;
    const dispatch = useDispatch();
    const [documentType, setDocumentType] = useState('nota');

    const [isUserInteracting, setIsUserInteracting] = useState(false);
    useEffect(() => {
        if (!isUserInteracting) {
            if (notaOP && !serieOP) {
                setDocumentType('fatura');
            } else if (notaOP && serieOP) {
                setDocumentType('nota');
            }
        }
    }, [notaOP, serieOP, isUserInteracting]);

    const handleFieldChange = (field: string, value: string) => {
        setIsUserInteracting(true);
        dispatch(setOrderState({ [field]: value }));
    };

    const handleDocumentTypeChange = (value: string) => {
        setDocumentType(value);
        if (value === 'fatura') {
            dispatch(setOrderState({ serieOP: '' }));
        }
    };

    const handleSelectSupplierChange = (value: string) => {
        dispatch(setOrderState({ fornecedorOP: value }));
    };

    const handleSelectFilialChange = (value: string) => {
        dispatch(setOrderState({ lojaOP: value }));
    };

    useEffect(() => {
        dispatch(
            setOrderState({
                ramoOP,
                opcaoLancOP,
                notaOP,
                serieOP,
                fornecedorOP,
                dtlanc,
                userOP,
            })
        );
    }, [ramoOP, opcaoLancOP, fornecedorOP, dtlanc, notaOP, serieOP, userOP]);

    return (
        <FormSection title="Dados de Origem da Nota Fiscal">
            <div>
                <Label className="text-sm font-semibold text-primary">
                    TIPO DE DOCUMENTO
                </Label>
                <RadioGroup
                    value={documentType}
                    onValueChange={handleDocumentTypeChange}
                    className="flex space-x-4"
                >
                    <RadioGroupItem value="nota" id="nota" />
                    <Label htmlFor="nota" className="text-sm">
                        Nota
                    </Label>
                    <RadioGroupItem value="fatura" id="fatura" />
                    <Label htmlFor="fatura" className="text-sm">
                        Fatura
                    </Label>
                </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                    <div>
                        <Label className="text-sm font-semibold text-primary">
                            RAMO
                        </Label>
                        <Select
                            onChange={(value: string) =>
                                handleFieldChange('ramoOP', value)
                            }
                            placeholder="Selecione o Ramo"
                            value={ramoOP}
                            options={[
                                {
                                    value: 'distribuicao',
                                    label: 'DISTRIBUIÇÃO',
                                },
                                { value: 'varejo', label: 'VAREJO' },
                            ]}
                            className="w-full"
                        />
                    </div>

                    <div>
                        <Label className="text-sm font-semibold text-primary">
                            TIPO DE LANÇAMENTO
                        </Label>
                        <Select
                            onChange={(value: string) =>
                                handleFieldChange('opcaoLancOP', value)
                            }
                            placeholder="Selecione o Tipo de Lançamento"
                            value={opcaoLancOP}
                            options={
                                ramoOP === 'distribuicao'
                                    ? [
                                          {
                                              value: 'servico',
                                              label: 'SERVIÇO',
                                          },
                                          {
                                              value: 'usoconsumo',
                                              label: 'USO E CONSUMO',
                                          },
                                          {
                                              value: 'adiantamento',
                                              label: 'ADIANTAMENTO',
                                          },
                                      ]
                                    : ramoOP === 'varejo'
                                      ? [
                                            {
                                                value: 'vendas',
                                                label: 'VENDAS',
                                            },
                                            {
                                                value: 'usoconsumo',
                                                label: 'USO E CONSUMO',
                                            },
                                            {
                                                value: 'servico',
                                                label: 'SERVIÇO',
                                            },
                                        ]
                                      : [
                                            { value: 'geral', label: 'GERAL' },
                                            {
                                                value: 'servico',
                                                label: 'SERVIÇO',
                                            },
                                        ]
                            }
                            className="w-full"
                            disabled={!ramoOP}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <FilialSelect
                        fieldValue={lojaOP || ''}
                        // validate={true}
                        ramo={ramoOP || ''}
                        // handleSetState={(value: any) =>
                        //     handleFieldChange(lojaOP, value)
                        // }
                        handleSelectChange={handleSelectFilialChange}
                    />
                    <FornecedorSelect
                        // handleSetState={(value: any) =>
                        //     handleFieldChange(fornecedorOP, value)
                        // }
                        fieldValue={fornecedorOP || ''}
                        handleSelectChange={handleSelectSupplierChange}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                    <Label className="text-sm font-semibold text-primary">
                        {documentType === 'nota'
                            ? 'NÚMERO DA NOTA FISCAL'
                            : 'NÚMERO IDENTIFICADOR'}
                    </Label>
                    <Input
                        placeholder={
                            documentType === 'nota' ? 'Nota' : 'Identificador'
                        }
                        value={notaOP}
                        className="w-full p-2 border rounded"
                        onChange={(e) =>
                            handleFieldChange('notaOP', e.target.value)
                        }
                    />
                </div>
                {documentType === 'nota' && (
                    <div>
                        <Label className="text-sm font-semibold text-primary">
                            SÉRIE
                        </Label>
                        <Input
                            placeholder="Série"
                            value={serieOP}
                            className="w-full p-2 border rounded"
                            onChange={(e) =>
                                handleFieldChange('serieOP', e.target.value)
                            }
                        />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                    <Label className="text-sm font-semibold text-primary">
                        DATA DE EMISSÃO
                    </Label>
                    <Input
                        type="date"
                        value={
                            dtlanc
                                ? new Date(dtlanc).toISOString().split('T')[0]
                                : ''
                        }
                        className="w-full p-2 border rounded"
                        onChange={(e) =>
                            handleFieldChange('dtlanc', e.target.value)
                        }
                    />
                </div>
            </div>
        </FormSection>
    );
};

export default OriginData;
