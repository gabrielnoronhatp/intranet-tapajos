'use client';

import React from 'react';
import { useState } from 'react';
import { Button, Input, Select, Upload, Radio } from 'antd';
import { FilialSelect } from '@/components/nopaper/store-select';
import { FornecedorSelect } from '@/components/nopaper/supplier-select';
import FinancialData from '@/components/contracts/duplicated-components/financial-data-form';

import { useDispatch, useSelector } from 'react-redux';
import { FormSection } from '@/components/nopaper/form-section';
import { AuthGuard } from '@/components/ProtectedRoute/AuthGuard';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import {
    setCurrentContract,
    createContract,
} from '@/hooks/slices/contracts/contractSlice';
import { RootState } from '@/hooks/store';
import { ServiceTypeSelect } from '@/components/contracts/service-type-select';

export default function ContractForm() {
    const dispatch = useDispatch();
    const { currentContract } = useSelector(
        (state: RootState) => state.contracts
    );
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [tipoMulta, setTipoMulta] = useState<'valor' | 'percentual'>('valor');
    const [error, setError] = useState<string | null>(null);
    const handleSetState = (
        field: string,
        value: string | number | Array<any>
    ) => {
        dispatch(setCurrentContract({ [field]: value }));
    };
     

    // TODO DELETE ANY
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(createContract(currentContract) as any);
    };

    const handleSelectSupplierChange = (value: string) => {
        dispatch(setCurrentContract({ idfornecedor: value }));
    };

    const handleSelectFilialChange = (value: string) => {
        dispatch(setCurrentContract({ idfilial: value }));
    };

    return (
        <AuthGuard>
            <div className="min-h-screen bg-background p-4">
                <Navbar
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                />
                <Sidebar isOpen={isSidebarOpen} />
                <main
                    className={`pt-16 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}
                >
                    <div className="flex justify-center">
                        <div className="max-w-3xl w-full bg-background p-4">
                            <h1 className="text-xl font-bold text-primary mb-4">
                                Cadastro de Contrato
                            </h1>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <FormSection title="Informações do Serviço">
                                    <ServiceTypeSelect
                                        handleSetState={handleSetState}
                                        fieldValue={currentContract.idtipo}
                                        handleSelectChange={(value) =>
                                            handleSetState('idtipo', value)
                                        }
                                    />
                                    <FornecedorSelect
                                        handleSelectChange={
                                            handleSelectSupplierChange
                                        }
                                        fieldValue={
                                            currentContract.idfornecedor
                                        }
                                        handleSetState={handleSetState}
                                    />

                                    <FilialSelect
                                        handleSetState={handleSetState}
                                        validate={false}
                                        fieldValue={currentContract.idfilial}
                                        handleSelectChange={
                                            handleSelectFilialChange
                                        }
                                    />
                                </FormSection>

                                <FormSection title="Dados de Contato">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label
                                                htmlFor="nome"
                                                className="block text-sm font-medium text-[#11833B] uppercase"
                                            >
                                                Nome
                                            </label>
                                            <Input
                                                id="nome"
                                                placeholder="Nome"
                                                value={currentContract.nome}
                                                onChange={(e) =>
                                                    handleSetState(
                                                        'nome',
                                                        e.target.value
                                                    )
                                                }
                                                className="mb-4"
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="telefone1"
                                                className="block text-sm font-medium text-[#11833B] uppercase"
                                            >
                                                Telefone
                                            </label>
                                            <Input
                                                id="telefone1"
                                                placeholder="Telefone"
                                                value={
                                                    currentContract.telefone1
                                                }
                                                onChange={(e) =>
                                                    handleSetState(
                                                        'telefone1',
                                                        e.target.value
                                                    )
                                                }
                                                className="mb-4"
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="contatoEmail"
                                                className="block text-sm font-medium text-[#11833B] uppercase"
                                            >
                                                Email
                                            </label>
                                            <Input
                                                id="email1"
                                                placeholder="Email"
                                                value={currentContract.email1}
                                                onChange={(e) =>
                                                    handleSetState(
                                                        'email1',
                                                        e.target.value
                                                    )
                                                }
                                                className="mb-4"
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="endereco1"
                                                className="block text-sm font-medium text-[#11833B] uppercase"
                                            >
                                                Endereço
                                            </label>
                                            <Input
                                                id="endereco1"
                                                placeholder="Endereço"
                                                value={
                                                    currentContract.endereco1
                                                }
                                                onChange={(e) =>
                                                    handleSetState(
                                                        'endereco1',
                                                        e.target.value
                                                    )
                                                }
                                                className="mb-4"
                                            />
                                        </div>
                                    </div>
                                </FormSection>

                                <FormSection title="Período e Índice">
                                    <div>
                                        <label
                                            htmlFor="dia_vencimento"
                                            className="block text-sm font-medium text-[#11833B] uppercase"
                                        >
                                            Período
                                        </label>
                                        <Input
                                            id="dia_vencimento"
                                            type="number"
                                            placeholder="Período"
                                            onChange={(e) => {
                                                const value = parseInt(
                                                    e.target.value,
                                                    10
                                                );
                                                if (value >= 1 && value <= 31) {
                                                    handleSetState(
                                                        'dia_vencimento',
                                                        value
                                                    );
                                                    setError(null); // Limpa a mensagem de erro
                                                } else {
                                                    setError(
                                                        'O dia deve ser um número entre 1 e 31.'
                                                    ); // Define a mensagem de erro
                                                }
                                            }}
                                            className="mb-4"
                                            min={1}
                                            max={31}
                                        />
                                        {error && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {error}
                                            </p>
                                        )}{' '}
                                        {/* Exibe a mensagem de erro */}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="indice"
                                            className="block text-sm font-medium text-[#11833B] uppercase"
                                        >
                                            Índice
                                        </label>
                                        <Select
                                            id="indice"
                                            placeholder="Índice"
                                            onChange={(value) =>
                                                handleSetState('indice', value)
                                            }
                                            options={[
                                                { value: 'PCE', label: 'PCE' },
                                                {
                                                    value: 'IGP-M',
                                                    label: 'IGP-M',
                                                },
                                            ]}
                                            className="w-full mb-4"
                                        />
                                    </div>
                                </FormSection>

                                <FinancialData />

                                <FormSection title="Outras Informações">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-[#11833B] uppercase mb-2">
                                                Tipo de Multa
                                            </label>
                                            <Radio.Group
                                                onChange={(e) =>
                                                    setTipoMulta(e.target.value)
                                                }
                                                value={tipoMulta}
                                                className="flex gap-4 mb-4"
                                            >
                                                <Radio value="valor">
                                                    Valor Fixo
                                                </Radio>
                                                <Radio value="percentual">
                                                    Percentual
                                                </Radio>
                                            </Radio.Group>
                                        </div>
                                        <div>
                                            <label
                                                htmlFor={
                                                    tipoMulta === 'percentual'
                                                        ? 'percentual_multa'
                                                        : 'valor_multa'
                                                }
                                                className="block text-sm font-medium text-[#11833B] uppercase"
                                            >
                                                {tipoMulta === 'percentual'
                                                    ? 'Percentual da Multa (%)'
                                                    : 'Valor da Multa (R$)'}
                                            </label>
                                            <Input
                                                id={
                                                    tipoMulta === 'percentual'
                                                        ? 'percentual_multa'
                                                        : 'valor_multa'
                                                }
                                                placeholder={
                                                    tipoMulta === 'percentual'
                                                        ? 'Ex: 2.5'
                                                        : 'Ex: 1000.00'
                                                }
                                                type="number"
                                                step={
                                                    tipoMulta === 'percentual'
                                                        ? '0.01'
                                                        : '0.01'
                                                }
                                                value={
                                                    tipoMulta === 'percentual'
                                                        ? (currentContract.percentual_multa ??
                                                          0)
                                                        : (currentContract.valor_multa ??
                                                          0)
                                                }
                                                onChange={(e) =>
                                                    handleSetState(
                                                        tipoMulta ===
                                                            'percentual'
                                                            ? 'percentual_multa'
                                                            : 'valor_multa',
                                                        e.target.value
                                                    )
                                                }
                                                className="mb-4"
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="data_venc_contrato"
                                                className="block text-sm font-medium text-[#11833B] uppercase"
                                            >
                                                Vencimento
                                            </label>
                                            <Input
                                                id="data_venc_contrato"
                                                type="date"
                                                placeholder="Vencimento"
                                                onChange={(e) =>
                                                    handleSetState(
                                                        'data_venc_contrato',
                                                        e.target.value
                                                    )
                                                }
                                                className="mb-4"
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="valor"
                                                className="block text-sm font-medium text-[#11833B] uppercase"
                                            >
                                                Valor
                                            </label>
                                            <Input
                                                id="valor_contrato"
                                                type="number"
                                                placeholder="Valor"
                                                onChange={(e) =>
                                                    handleSetState(
                                                        'valor_contrato',
                                                        e.target.value
                                                    )
                                                }
                                                className="mb-4"
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="obs1"
                                                className="block text-sm font-medium text-[#11833B] uppercase"
                                            >
                                                Observações
                                            </label>
                                            <Input.TextArea
                                                id="obs1"
                                                placeholder="Observações"
                                                onChange={(e) =>
                                                    handleSetState(
                                                        'obs1',
                                                        e.target.value
                                                    )
                                                }
                                                className="mb-4"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label
                                                htmlFor="upload"
                                                className="block text-sm font-medium text-[#11833B] uppercase"
                                            >
                                                Upload
                                            </label>
                                            <Upload
                                                id="upload"
                                                name="files"
                                                listType="picture-card"
                                                className="avatar-uploader mb-4"
                                                showUploadList={true}
                                                onChange={(info) =>
                                                    handleSetState(
                                                        'upload',
                                                        info.fileList
                                                    )
                                                }
                                            >
                                                <div>
                                                    <div
                                                        style={{ marginTop: 8 }}
                                                    >
                                                        Upload
                                                    </div>
                                                </div>
                                            </Upload>
                                        </div>
                                    </div>
                                </FormSection>

                                <div className="flex justify-end">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="w-full bg-primary hover:bg-primary/90"
                                    >
                                        Cadastrar Contrato
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </AuthGuard>
    );
}
