'use client';
import React from 'react';
import { setOrderState } from '@/hooks/slices/noPaper/orderSlice';
import { SelectField } from '../select-field';
import { FormSection } from '../form-section';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContasGerenciais } from '@/hooks/slices/noPaper/noPaperSlice';
import {
    setFieldError,
    clearFieldError,
} from '@/hooks/slices/noPaper/errorSlice';
import { Select } from 'antd';
import { RootState } from '@/hooks/store';

interface FinancialDataProps {
    data: any;
    onChange: (field: keyof any, value: any) => void;
}

export default function FinancialData({ data, onChange }: FinancialDataProps) {
    const dispatch = useDispatch();
    const {
        metodoOP,
        installmentDates = [],
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
    const { formErrors } = useSelector((state: any) => state.error);

    const validateField = (field: string, value: any) => {
        if (!value || (typeof value === 'string' && !value.trim())) {
            dispatch(
                setFieldError({
                    field,
                    message: `O campo ${field} é obrigatório`,
                })
            );
        } else {
            dispatch(clearFieldError(field));
        }
    };

    useEffect(() => {
        dispatch(fetchContasGerenciais('') as any);
    }, [dispatch]);

    const handleFormaPagamentoChange = (value: string) => {
        onChange('metodoOP', value);
        validateField('metodoOP', value);
        if (value === 'avista') {
            onChange('qtparcelasOP', 1);
            onChange('installmentDates', []);
        } else if (value !== 'boleto') {
            onChange('qtparcelasOP', 1);
            onChange('installmentDates', []);
        }
    };

    const handleInstallmentsChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const numInstallments = parseInt(e.target.value, 10);
        onChange('qtparcelasOP', numInstallments);
        onChange('parcelasOP', numInstallments);
        onChange('installmentDates', Array(numInstallments).fill(''));
    };

    const handleInstallmentDateChange = (index: number, date: string) => {
        const newDates = [...installmentDates];
        newDates[index] = date;
        onChange('installmentDates', newDates);
    };

    return (
        <FormSection title="Dados Financeiros">
            <div className="space-y-2">
                <SelectField
                    label="Escolha a Forma de Pagamento"
                    value={metodoOP}
                    onChange={handleFormaPagamentoChange}
                    options={[
                        { value: 'avista', label: 'À VISTA' },
                        { value: 'deposito', label: 'DEPÓSITO' },
                        { value: 'boleto', label: 'BOLETO' },
                        { value: 'pix', label: 'PIX' },
                    ]}
                />
                {formErrors.metodoOP && (
                    <p className="text-red-500 text-xs">
                        {formErrors.metodoOP}
                    </p>
                )}

                {metodoOP === 'avista' && (
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold text-primary uppercase">
                            Data de Vencimento
                        </Label>
                        <Input
                            type="date"
                            value={dtavista}
                            onChange={(e) =>
                                onChange('dtavista', e.target.value)
                            }
                            className="form-control"
                        />
                        {formErrors.dtvista && (
                            <p className="text-red-500 text-xs">
                                {formErrors.dtvista}
                            </p>
                        )}
                    </div>
                )}

                {metodoOP === 'boleto' && (
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold text-primary uppercase">
                            Número de Parcelas
                        </Label>
                        <Input
                            type="number"
                            value={qtparcelasOP}
                            onChange={handleInstallmentsChange}
                            min={1}
                            max={12}
                            className="form-control"
                        />
                        {Array.from({ length: qtparcelasOP }).map(
                            (_, index) => (
                                <div key={index} className="space-y-1">
                                    <Label className="text-xs font-semibold text-primary uppercase">
                                        Data de Vencimento {index + 1}
                                    </Label>
                                    <Input
                                        type="date"
                                        value={installmentDates[index] || ''}
                                        onChange={(e) =>
                                            handleInstallmentDateChange(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        className="form-control"
                                    />
                                    {formErrors.installmentDates &&
                                        formErrors.installmentDates[index] && (
                                            <p className="text-red-500 text-xs">
                                                {
                                                    formErrors.installmentDates[
                                                        index
                                                    ]
                                                }
                                            </p>
                                        )}
                                </div>
                            )
                        )}
                    </div>
                )}

                {metodoOP === 'deposito' && (
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold text-primary uppercase">
                            Banco
                        </Label>
                        <Input
                            type="text"
                            value={bancoOP}
                            onChange={(e) =>
                                onChange('bancoOP', e.target.value)
                            }
                            placeholder="Banco"
                            className="form-control"
                        />
                        {formErrors.bancoOP && (
                            <p className="text-red-500 text-xs">
                                {formErrors.bancoOP}
                            </p>
                        )}

                        <Label className="text-xs font-semibold text-primary uppercase">
                            Agência
                        </Label>
                        <Input
                            type="text"
                            value={agenciaOP}
                            onChange={(e) =>
                                onChange('agenciaOP', e.target.value)
                            }
                            placeholder="Agência"
                            className="form-control"
                        />
                        {formErrors.agenciaOP && (
                            <p className="text-red-500 text-xs">
                                {formErrors.agenciaOP}
                            </p>
                        )}

                        <Label className="text-xs font-semibold text-primary uppercase">
                            Conta
                        </Label>
                        <Input
                            type="text"
                            value={contaOP}
                            onChange={(e) =>
                                onChange('contaOP', e.target.value)
                            }
                            placeholder="Conta"
                            className="form-control"
                        />
                        {formErrors.contaOP && (
                            <p className="text-red-500 text-xs">
                                {formErrors.contaOP}
                            </p>
                        )}

                        <Label className="text-xs font-semibold text-primary uppercase">
                            Data de Depósito
                        </Label>
                        <Input
                            type="date"
                            value={dtdepositoOP}
                            onChange={(e) =>
                                onChange('dtdepositoOP', e.target.value)
                            }
                            className="form-control"
                        />
                        {formErrors.dtdepositoOP && (
                            <p className="text-red-500 text-xs">
                                {formErrors.dtdepositoOP}
                            </p>
                        )}
                    </div>
                )}

                {metodoOP === 'pix' && (
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold text-primary uppercase">
                            Tipo de Chave PIX
                        </Label>
                        <SelectField
                            value={tipopixOP}
                            onChange={(value: string) =>
                                onChange('tipopixOP', value)
                            }
                            options={[
                                { value: 'cpf/cnpj', label: 'CPF/CNPJ' },
                                { value: 'telefone', label: 'Telefone' },
                                { value: 'email', label: 'E-mail' },
                                { value: 'aleatoria', label: 'Aleatória' },
                            ]}
                            label=""
                        />
                        {formErrors.tipopixOP && (
                            <p className="text-red-500 text-xs">
                                {formErrors.tipopixOP}
                            </p>
                        )}

                        <Label className="text-xs font-semibold text-primary uppercase">
                            Chave PIX
                        </Label>
                        <Input
                            type="text"
                            value={chavepixOP}
                            onChange={(e) =>
                                onChange('chavepixOP', e.target.value)
                            }
                            placeholder="Insira a Chave PIX"
                            className="form-control"
                        />
                        {formErrors.chavepixOP && (
                            <p className="text-red-500 text-xs">
                                {formErrors.chavepixOP}
                            </p>
                        )}

                        <Label className="text-xs font-semibold text-primary uppercase">
                            Data de Pagamento PIX
                        </Label>
                        <Input
                            type="date"
                            value={datapixOP}
                            onChange={(e) =>
                                onChange('datapixOP', e.target.value)
                            }
                            className="form-control"
                        />
                        {formErrors.datapixOP && (
                            <p className="text-red-500 text-xs">
                                {formErrors.datapixOP}
                            </p>
                        )}
                    </div>
                )}
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
                {formErrors.contagerencialOP && (
                    <p className="text-red-500 text-xs">
                        {formErrors.contagerencialOP}
                    </p>
                )}
            </div>
        </FormSection>
    );
}

//
