'use client';
import React from 'react';
import { SelectField } from '../select-field';
import { FormSection } from '../form-section';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContasGerenciais } from '@/hooks/slices/noPaper/noPaperSlice';

import { Select } from 'antd';
import { RootState } from '@/hooks/store';
import { OrderState } from '@/types/noPaper/Order/OrderState';
import { OrderData } from '@/types/noPaper/Order/OrderData';
import { Parcela } from '@/types/noPaper/Order/Parcela';

interface FinancialDataProps {
    data: OrderData;
    onChange: (field: keyof OrderState, value: string | number) => void;
}

export default function FinancialData({ data, onChange }: FinancialDataProps) {
    const dispatch = useDispatch();
    const {
        metodoOP,
        parcelasOP = [],
        dtavista,
        bancoOP,
        contagerencialOP,
        agenciaOP,
        dtdepositoOP,
        tipopixOP,
        chavepixOP,
        datapixOP,
        qtparcelasOP,
        contaOP,
    } = data;

    const { contasGerenciais } = useSelector(
        (state: RootState) => state.noPaper
    );

    useEffect(() => {
        dispatch(fetchContasGerenciais() as any);
    }, [dispatch]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return '';
        }
        return date.toISOString().split('T')[0];
    };

    const handleFormaPagamentoChange = (value: string) => {
        onChange('metodoOP', value);

        let newParcelasOP: any = [];

        if (value === 'pix') {
            newParcelasOP = [
                {
                    parcela: datapixOP ?? null,
                    banco: bancoOP || '',
                    agencia: agenciaOP || '',
                    conta: contaOP || '',
                    tipopix: tipopixOP || '',
                    chavepix: chavepixOP || '',
                },
            ];
        } else if (value === 'boleto') {
            newParcelasOP = Array.from({ length: qtparcelasOP || 1 }, () => ({
                parcela: null,
                banco: '',
                agencia: '',
                conta: '',
                tipopix: '',
                chavepix: '',
            }));
        } else if (value === 'deposito') {
            newParcelasOP = [
                {
                    parcela: dtdepositoOP ?? null,
                    banco: bancoOP || '',
                    agencia: agenciaOP || '',
                    conta: contaOP || '',
                    tipopix: tipopixOP || '',
                    chavepix: chavepixOP || '',
                },
            ];
        } else if (value === 'avista') {
            newParcelasOP = [
                {
                    parcela: dtavista ?? null,
                    banco: '',
                    agencia: '',
                    conta: '',
                    tipopix: '',
                    chavepix: '',
                },
            ];
        }

        onChange('parcelasOP', newParcelasOP);
        onChange('qtparcelasOP', newParcelasOP.length);
    };

    const handleParcelasChange = (
        index: number,
        field: string,
        value: string | number
    ) => {
        const updatedParcelas = [...parcelasOP];
        updatedParcelas[index] = {
            ...updatedParcelas[index],
            [field]: field === 'parcela' ? ((value as string) || null) : value,
        };
        onChange('parcelasOP', updatedParcelas as any);
    };

    return (
        <FormSection title="Dados Financeiros">
            <div className="space-y-2">
                <SelectField
                    label="Escolha a Forma de Pagamento"
                    value={metodoOP || ''}
                    onChange={handleFormaPagamentoChange}
                    options={[
                        { value:'avista', label: 'À VISTA' },
                        { value: 'deposito', label: 'DEPÓSITO' },
                        { value: 'boleto', label: 'BOLETO' },
                        { value: 'pix', label: 'PIX' },
                    ]}
                />

                {metodoOP === 'boleto' && (
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold text-primary uppercase">
                            Número de Parcelas
                        </Label>
                        <Input
                            type="number"
                            min="1"
                            value={qtparcelasOP || ''}
                            onChange={(e) => {
                                const value = parseInt(e.target.value);
                                onChange('qtparcelasOP', value);

                                // Atualiza as parcelas quando o número muda
                                if (value > 0) {
                                    const newParcelasOP = Array.from(
                                        { length: value },
                                        () => ({
                                            parcela: null,
                                            banco: '',
                                            agencia: '',
                                            conta: '',
                                            tipopix: '',
                                            chavepix: '',
                                        })
                                    );
                                    onChange(
                                        'parcelasOP',
                                        newParcelasOP as any
                                    );
                                }
                            }}
                            className="form-control"
                        />
                    </div>
                )}

                {/* Renderização dinâmica das parcelas */}
                {parcelasOP.map((parcela: any, index: number) => (
                    <div key={index} className="space-y-2 border p-2 rounded">
                        <Label className="text-xs font-semibold text-primary uppercase">
                            {metodoOP === 'boleto'
                                ? `Data de Vencimento - Parcela ${index + 1}`
                                : 'Data de Vencimento'}
                        </Label>
                        <Input
                            type="date"
                            value={formatDate(parcela.parcela || '')}
                            onChange={(e) =>
                                handleParcelasChange(
                                    index,
                                    'parcela',
                                    e.target.value
                                )
                            } 
                            className="form-control"
                        />

                        {metodoOP === 'deposito' && (
                            <>
                                <Label className="text-xs font-semibold text-primary uppercase">
                                    Banco
                                </Label>
                                <Input
                                    type="text"
                                    value={parcela.banco || ''}
                                    onChange={(e) =>
                                        handleParcelasChange(
                                            index,
                                            'banco',
                                            e.target.value
                                        )
                                    }
                                    placeholder="Banco"
                                    className="form-control"
                                />

                                <Label className="text-xs font-semibold text-primary uppercase">
                                    Agência
                                </Label>
                                <Input
                                    type="text"
                                    value={parcela.agencia || ''}
                                    onChange={(e) =>
                                        handleParcelasChange(
                                            index,
                                            'agencia',
                                            e.target.value
                                        )
                                    }
                                    placeholder="Agência"
                                    className="form-control"
                                />

                                <Label className="text-xs font-semibold text-primary uppercase">
                                    Conta
                                </Label>
                                <Input
                                    type="text"
                                    value={parcela.conta || ''}
                                    onChange={(e) =>
                                        handleParcelasChange(
                                            index,
                                            'conta',
                                            e.target.value
                                        )
                                    }
                                    placeholder="Conta"
                                    className="form-control"
                                />
                            </>
                        )}

                        {metodoOP === 'pix' && (
                            <>
                                <Label className="text-xs font-semibold text-primary uppercase">
                                    Tipo de Chave PIX
                                </Label>
                                <SelectField
                                    value={parcela.tipopix || ''}
                                    onChange={(value: string) =>
                                        handleParcelasChange(
                                            index,
                                            'tipopix',
                                            value
                                        )
                                    }
                                    options={[
                                        {
                                            value: 'cpf/cnpj',
                                            label: 'CPF/CNPJ',
                                        },
                                        {
                                            value: 'telefone',
                                            label: 'Telefone',
                                        },
                                        { value: 'email', label: 'E-mail' },
                                        {
                                            value: 'aleatoria',
                                            label: 'Aleatória',
                                        },
                                    ]}
                                    label=""
                                />

                                <Label className="text-xs font-semibold text-primary uppercase">
                                    Chave PIX
                                </Label>
                                <Input
                                    type="text"
                                    value={parcela.chavepix || ''}
                                    onChange={(e) =>
                                        handleParcelasChange(
                                            index,
                                            'chavepix',
                                            e.target.value
                                        )
                                    }
                                    placeholder="Insira a Chave PIX"
                                    className="form-control"
                                />
                            </>
                        )}
                    </div>
                ))}

                {/* Outros campos existentes */}
            </div>
            <div className="space-y-2">
                <Label className="text-xs font-semibold text-primary uppercase">
                    Conta Gerencial
                </Label>
                <Select
                    className="w-full"
                    showSearch
                    value={contagerencialOP}
                    onChange={(value: string) =>
                        onChange('contagerencialOP', value)
                    }
                    options={contasGerenciais.map((conta: any) => ({
                        value: conta.conta,
                        label: conta.conta,
                    }))}
                />
            </div>
        </FormSection>
    );
}
