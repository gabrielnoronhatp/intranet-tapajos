'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import {
    fetchContractDetails,
    updateContract,
    setCurrentContract,
} from '@/hooks/slices/contracts/contractSlice';
import { RootState, AppDispatch } from '@/hooks/store';
import { Button, Input, message, Select, Upload, Radio } from 'antd';
import { FormSection } from '@/components/nopaper/form-section';
import { ServiceTypeSelect } from '@/components/contracts/service-type-select';
import { FornecedorSelect } from '@/components/nopaper/supplier-select';
import { fetchLojas } from '@/hooks/slices/noPaper/noPaperSlice';
import { AuthGuard } from '@/components/ProtectedRoute/AuthGuard';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import FinancialData from '@/components/contracts/duplicated-components/financial-data-form';

export default function EditContractPage() {
    const dispatch = useDispatch<AppDispatch>();
    const params = useParams();
    const contractId = params?.contractId as string;

    const { currentContract } = useSelector(
        (state: RootState) => state.contracts
    );
    const { lojas } = useSelector((state: RootState) => state.noPaper);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [tipoMulta, setTipoMulta] = useState<'valor' | 'percentual'>('valor');

    useEffect(() => {
        if (contractId) {
            dispatch(fetchContractDetails(Number(contractId)));
        }
        dispatch(fetchLojas(''));
    }, [contractId, selectedFile, dispatch]);

    const handleSetState = (
        field: keyof typeof currentContract,
        value: string | number | boolean | null | undefined
    ) => {
        dispatch(setCurrentContract({ [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(
                updateContract({
                    contractId: Number(contractId),
                    contractData: currentContract,
                })
            );
        } catch (error) {
            console.log(error);
            message.error('Erro ao atualizar contrato');
        }
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
                                Editar Contrato
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
                                        handleSelectChange={(value) =>
                                            handleSetState(
                                                'idfornecedor',
                                                value
                                            )
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
                                        onChange={(value) =>
                                            handleSetState('idfilial', value)
                                        }
                                        options={lojas.map((filial) => ({
                                            value: filial.loja,
                                            label: `${filial.loja}`,
                                        }))}
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
                                                htmlFor="email1"
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
                                                step="0.01"
                                                value={
                                                    tipoMulta === 'percentual'
                                                        ? currentContract.percentual_multa ||
                                                          0
                                                        : currentContract.valor_multa ||
                                                          0
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
                                                Data fim do contrato
                                            </label>
                                            <Input
                                                id="data_venc_contrato"
                                                type="date"
                                                placeholder="Vencimento"
                                                value={
                                                    currentContract.data_venc_contrato
                                                        ? new Date(
                                                              currentContract.data_venc_contrato
                                                          )
                                                              .toISOString()
                                                              .split('T')[0]
                                                        : undefined
                                                }
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
                                                htmlFor="valor_contrato"
                                                className="block text-sm font-medium text-[#11833B] uppercase"
                                            >
                                                Valor
                                            </label>
                                            <Input
                                                id="valor_contrato"
                                                type="number"
                                                placeholder="Valor"
                                                value={
                                                    currentContract.valor_contrato ||
                                                    ''
                                                }
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
                                                value={currentContract.obs1}
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
                                                    setSelectedFile(file);
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
                                        Atualizar Contrato
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
