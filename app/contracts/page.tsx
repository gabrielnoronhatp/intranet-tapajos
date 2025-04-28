'use client';

import React, { useEffect, useState } from 'react';
import { Button, Input, Select, Upload, Radio } from 'antd';
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
    uploadContractFile,
} from '@/hooks/slices/contracts/contractSlice';
import { AppDispatch, RootState } from '@/hooks/store';
import { ServiceTypeSelect } from '@/components/contracts/service-type-select';
import { fetchLojas } from '@/hooks/slices/noPaper/noPaperSlice';
import { toast } from 'react-hot-toast';
import { NumericFormat } from 'react-number-format';
import { IContract } from '@/types/Contracts/Contracts';

export default function ContractForm() {
    const dispatch = useDispatch<AppDispatch>();
    const { currentContract } = useSelector(
        (state: RootState) => state.contracts
    );
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [tipoMulta, setTipoMulta] = useState<'valor' | 'percentual'>('valor');
    const [error, setError] = useState<string | null>(null);
    const { lojas } = useSelector((state: RootState) => state.noPaper);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleSetState = (
        field: string,
        value: string | number | Array<IContract>
    ) => {
        dispatch(setCurrentContract({ [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const resultAction = await dispatch(
                createContract(currentContract)
            );
            const newContractId = resultAction.payload.id;

            if (newContractId && selectedFile) {
                await dispatch(
                    uploadContractFile({
                        contractId: newContractId,
                        file: selectedFile,
                    })
                );
            }
        } catch (error) {
            console.log(error);
            toast.error('Erro ao cadastrar contrato ou enviar arquivo.');
        }
    };

    const handleSelectSupplierChange = (value: string) => {
        dispatch(setCurrentContract({ idfornecedor: value }));
    };

    const [localSearchQuery, setLocalSearchQuery] = useState<string>('');

    const handleSelectFilialChange = (value: string) => {
        dispatch(setCurrentContract({ idfilial: value }));
    };

    useEffect(() => {
        dispatch(fetchLojas(localSearchQuery));
    }, [localSearchQuery, dispatch]);

    const handleFileChange = (file: File) => {
        setSelectedFile(file);
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
                                        fieldValue={currentContract.idtipo}
                                        handleSelectChange={(value) =>
                                            handleSetState(
                                                'idtipo',
                                                value.toString()
                                            )
                                        }
                                    />
                                    <FornecedorSelect
                                        handleSelectChange={
                                            handleSelectSupplierChange
                                        }
                                        fieldValue={
                                            currentContract.idfornecedor
                                        }
                                    />
                                    <div className="text-sm font-medium text-[#11833B] uppercase">
                                        SELECIONE A FILIAL
                                    </div>

                                    <Select
                                        id="filial"
                                        placeholder="Selecione a Filial"
                                        value={currentContract.idfilial}
                                        onChange={handleSelectFilialChange}
                                        onSearch={(value) =>
                                            setLocalSearchQuery(value)
                                        }
                                        showSearch
                                        // find way to remove this any
                                        options={lojas.map((filial) => ({
                                            value: filial.loja,
                                            label: filial.loja,
                                        }))}
                                        filterOption={(input: string, option) =>
                                            (option?.label ?? '')
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        }
                                        className="w-full mb-4"
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
                                                type="number"
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
                                            Dia do Vencimento
                                        </label>
                                        <Input
                                            id="dia_vencimento"
                                            type="number"
                                            placeholder="Dia do Vencimento"
                                            onChange={(e) => {
                                                const value = parseInt(
                                                    e.target.value,
                                                    10
                                                );
                                                if (value >= 1 && value <= 31) {
                                                    handleSetState(
                                                        'dia_vencimento',
                                                        value.toString()
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
                                            <NumericFormat
                                                customInput={Input}
                                                thousandSeparator="."
                                                decimalSeparator=","
                                                prefix="R$ "
                                                decimalScale={2}
                                                fixedDecimalScale
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
                                                step="0.01"
                                                value={
                                                    tipoMulta === 'percentual'
                                                        ? (currentContract.percentual_multa ??
                                                          0)
                                                        : (currentContract.valor_multa ??
                                                          0)
                                                }
                                                onValueChange={(values) =>
                                                    handleSetState(
                                                        tipoMulta ===
                                                            'percentual'
                                                            ? 'percentual_multa'
                                                            : 'valor_multa',
                                                        values.floatValue ?? 0
                                                    )
                                                }
                                                className="mb-4"
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="data_inicio_contrato"
                                                className="block text-sm font-medium text-[#11833B] uppercase"
                                            >
                                                Data de início do contrato
                                            </label>
                                            <Input
                                                id="data_inicio_contrato"
                                                type="date"
                                                placeholder="Data de início do contrato"
                                                onChange={(e) =>
                                                    handleSetState(
                                                        'data_inicio_contrato',
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
                                                Data fim do contrato
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
                                            <NumericFormat
                                                id="valor_contrato"
                                                customInput={Input}
                                                thousandSeparator="."
                                                decimalSeparator=","
                                                prefix="R$ "
                                                decimalScale={2}
                                                fixedDecimalScale
                                                placeholder="Valor"
                                                value={
                                                    currentContract.valor_contrato
                                                }
                                                onValueChange={(values) =>
                                                    handleSetState(
                                                        'valor_contrato',
                                                        values.floatValue ?? 0
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
                                                beforeUpload={(file) => {
                                                    handleFileChange(file);
                                                    return false;
                                                }}
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
