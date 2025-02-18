'use client';
import React, { useState } from 'react';
import { setOrderState } from '@/hooks/slices/noPaper/orderSlice';
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
import { SelectField } from '@/components/nopaper/select-field';
import { FormSection } from '@/components/nopaper/form-section';
import { setCurrentContract } from '@/hooks/slices/contracts/contractSlice';

export default function FinancialData() {
    const dispatch = useDispatch();
    const handleSetState = (field: keyof any, value: any) => {
        if (field === 'idfilial') {
            dispatch(setCurrentContract({ [field]: String(value) }));
        } else {
            dispatch(setCurrentContract({ [field]: value }));
        }
        validateField(field as string, value);
    };
    const [installmentDates, setInstallmentDates] = useState<any[]>([]);
    const [dtavista, setDtavista] = useState<any>(null);
    const [qtparcelas, setQtparcelas] = useState<any>(null);
    const {
        metodoOP,
    } = useSelector((state: any) => state.order);
    const {
        forma_pag,
        banco,
        agencia,
        dtdeposito,
        tipopix,
        chavepix,
        datapix,
        conta,
    } = useSelector((state: any) => state.contracts.currentContract);

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

 

    const handleFormaPagamentoChange = (value: string) => {
        handleSetState('forma_pag', value);
        
    };

    const handleInstallmentsChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const numInstallments = parseInt(e.target.value, 10);
       
    };

    const handleInstallmentDateChange = (index: number, date: string) => {
        const newDates = [...installmentDates];
        newDates[index] = date;
       
    };

    return (
        <FormSection title="Dados Financeiros">
            <div className="space-y-2">
                <SelectField
                    label="Escolha a Forma de Pagamento"
                    value={forma_pag}
                    onChange={handleFormaPagamentoChange}
                    options={[
                        { value: 'avista', label: 'À VISTA' },
                        { value: 'deposito', label: 'DEPÓSITO' },
                      
                        { value: 'pix', label: 'PIX' },
                    ]}
                />
                {formErrors.formaPagamento && (
                    <p className="text-red-500 text-xs">
                        {formErrors.formaPagamento}
                    </p>
                )}

                {forma_pag === 'avista' && (
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold text-primary uppercase">
                            Data de Vencimento
                        </Label>
                        <Input
                            type="date"
                            value={dtavista}
                            
                            className="form-control"
                        />
                    </div>
                )}

                {forma_pag=== 'boleto' && (
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold text-primary uppercase">
                            Número de Parcelas
                        </Label>
                        <Input
                            type="number"
                            value={qtparcelas}
                            onChange={handleInstallmentsChange}
                            min={1}
                            max={12}
                            className="form-control"
                        />
                        {Array.from({ length: qtparcelas }).map(
                            (_, index) => (
                                <div key={index} className="space-y-1">
                                    <Label className="text-xs font-semibold text-primary uppercase">
                                        Data de Vencimento {index + 1}
                                    </Label>
                                    <Input
                                        type="date"
                                        value={installmentDates[index]}
                                        onChange={(e) =>
                                            handleInstallmentDateChange(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        className="form-control"
                                    />
                                </div>
                            )
                        )}
                    </div>
                )}

                {forma_pag === 'deposito' && (
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold text-primary uppercase">
                            Banco
                        </Label>
                        <Input
                            type="text"
                            value={banco}
                            onChange={(e) =>
                                handleSetState('banco', e.target.value)
                            }
                            placeholder="Banco"
                            className="form-control"
                        />
                        <Label className="text-xs font-semibold text-primary uppercase">
                            Agência
                        </Label>
                        <Input
                            type="text"
                            value={agencia}
                            onChange={(e) =>
                                handleSetState('agencia', e.target.value)
                            }
                            placeholder="Agência"
                            className="form-control"
                        />
                        <Label className="text-xs font-semibold text-primary uppercase">
                            Conta
                        </Label>
                        <Input
                            type="text"
                            value={conta}
                            onChange={(e) =>
                                handleSetState('conta', e.target.value)
                            }
                            placeholder="Conta"
                            className="form-control"
                        />
                        <Label className="text-xs font-semibold text-primary uppercase">
                            Data de Depósito
                        </Label>
                        <Input
                            type="date"
                            value={dtdeposito}
                            onChange={(e) =>
                                handleSetState('dtdeposito', e.target.value)
                            }
                            className="form-control"
                        />
                    </div>
                )}

                {forma_pag === 'pix' && (
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold text-primary uppercase">
                            Tipo de Chave PIX
                        </Label>
                        <SelectField
                            value={tipopix}
                            onChange={(value: string) =>
                                handleSetState('tipopix', value)
                            }
                            options={[
                                { value: 'cpf/cnpj', label: 'CPF/CNPJ' },
                                { value: 'telefone', label: 'Telefone' },
                                { value: 'email', label: 'E-mail' },
                                { value: 'aleatoria', label: 'Aleatória' },
                            ]}
                            label=""
                        />
                        <Label className="text-xs font-semibold text-primary uppercase">
                            Chave PIX
                        </Label>
                        <Input
                            type="text"
                            value={chavepix}
                            onChange={(e) =>
                                handleSetState('chavepix', e.target.value)
                            }
                            placeholder="Insira a Chave PIX"
                            className="form-control"
                        />
                        <Label className="text-xs font-semibold text-primary uppercase">
                            Data de Pagamento PIX
                        </Label>
                        <Input
                            type="date"
                            value={datapix}
                            onChange={(e) =>
                                handleSetState('datapix', e.target.value)
                            }
                            className="form-control"
                        />
                    </div>
                )}
            </div>
           
        </FormSection>
    );
}

//
