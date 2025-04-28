'use client';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RootState } from '@/hooks/store';
import { SelectField } from '@/components/nopaper/select-field';
import { FormSection } from '@/components/nopaper/form-section';
import { setCurrentContract } from '@/hooks/slices/contracts/contractSlice';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

export default function FinancialData() {
    const dispatch = useDispatch();

    const handleSetState = (field: string, value: string) => {
        if (field === 'idfilial') {
            dispatch(setCurrentContract({ [field]: String(value) }));
        } else {
            dispatch(setCurrentContract({ [field]: value }));
        }
    };

    const [dtavista] = useState<string>('');

    const { forma_pag, banco, agencia, tipopix, chavepix, conta } = useSelector(
        (state: RootState) => state.contracts.currentContract
    );

    const handleFormaPagamentoChange = (value: string) => {
        handleSetState('forma_pag', value);
    };

    return (
        <FormSection title="Dados Financeiros">
            <div className="space-y-2">
                <SelectField
                    label="Escolha a Forma de Pagamento"
                    value={forma_pag !== undefined ? String(forma_pag) : ''}
                    onChange={handleFormaPagamentoChange}
                    options={[
                        { value: 'boleto    ', label: 'Boleto' },
                        { value: 'deposito', label: 'Depósito' },
                        { value: 'pix', label: 'Pix' },
                    ]}
                />

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
                    </div>
                )}

                {forma_pag === 'pix' && (
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold text-primary uppercase">
                            Tipo de Chave PIX
                        </Label>
                        <SelectField
                            value={tipopix || ''}
                            onChange={(value: string) =>
                                handleSetState('tipo_chave_pix', value)
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
                                handleSetState('chave_pix', e.target.value)
                            }
                            placeholder="Insira a Chave PIX"
                            className="form-control"
                        />
                    </div>
                )}
            </div>
        </FormSection>
    );
}
