'use client';

import React from 'react';
import { useState } from 'react';
import { Button, Input, Select, Upload } from 'antd';
import { FilialSelect } from '@/components/nopaper/store-select';
import { FornecedorSelect } from '@/components/nopaper/supplier-select';
import FinancialData from '@/components/nopaper/form/financial-data-form';
// import { FormSection } from "@/components/nopaper/form/form-section";
import { useDispatch } from 'react-redux';
import { setOrderState } from '@/hooks/slices/noPaper/orderSlice';
import { FormSection } from '@/components/nopaper/form-section';
import { AuthGuard } from '@/components/ProtectedRoute/AuthGuard';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';

export default function ContractForm() {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);


    ///TODO: Tirar Any 
    const handleSetState = (field: string, value: string | number | Array<any>) => {
        setFormData({ ...formData, [field]: value });
        dispatch(setOrderState({ [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    
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
                                    <Select
                                        placeholder="Selecione o Tipo de Serviço"
                                        onChange={(value) =>
                                            handleSetState('tipoServico', value)
                                        }
                                        options={[
                                            {
                                                value: 'servico1',
                                                label: 'Serviço 1',
                                            },
                                            {
                                                value: 'servico2',
                                                label: 'Serviço 2',
                                            },
                                        ]}
                                        className="w-full"
                                    />
                                    <FilialSelect
                                        handleSetState={handleSetState}
                                        validate={false}
                                    />
                                    <FornecedorSelect
                                        handleSetState={handleSetState}
                                    />
                                </FormSection>

                                <FormSection title="Dados de Contato">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label
                                                htmlFor="contatoNome"
                                                className="block text-sm font-medium text-[#11833B] uppercase"
                                            >
                                                Nome
                                            </label>
                                            <Input
                                                id="contatoNome"
                                                placeholder="Nome"
                                                onChange={(e) =>
                                                    handleSetState(
                                                        'contatoNome',
                                                        e.target.value
                                                    )
                                                }
                                                className="mb-4"
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="contatoTelefone"
                                                className="block text-sm font-medium text-[#11833B] uppercase"
                                            >
                                                Telefone
                                            </label>
                                            <Input
                                                id="contatoTelefone"
                                                placeholder="Telefone"
                                                onChange={(e) =>
                                                    handleSetState(
                                                        'contatoTelefone',
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
                                                id="contatoEmail"
                                                placeholder="Email"
                                                onChange={(e) =>
                                                    handleSetState(
                                                        'contatoEmail',
                                                        e.target.value
                                                    )
                                                }
                                                className="mb-4"
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="contatoEndereco"
                                                className="block text-sm font-medium text-[#11833B] uppercase"
                                            >
                                                Endereço
                                            </label>
                                            <Input
                                                id="contatoEndereco"
                                                placeholder="Endereço"
                                                onChange={(e) =>
                                                    handleSetState(
                                                        'contatoEndereco',
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
                                            htmlFor="periodo"
                                            className="block text-sm font-medium text-[#11833B] uppercase"
                                        >
                                            Período
                                        </label>
                                        <Input
                                            id="periodo"
                                            type="date"
                                            placeholder="Período"
                                            onChange={(e) =>
                                                handleSetState(
                                                    'periodo',
                                                    e.target.value
                                                )
                                            }
                                            className="mb-4"
                                        />
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
                                        <div>
                                            <label
                                                htmlFor="multa"
                                                className="block text-sm font-medium text-[#11833B] uppercase"
                                            >
                                                Multa
                                            </label>
                                            <Input
                                                id="multa"
                                                placeholder="Multa"
                                                onChange={(e) =>
                                                    handleSetState(
                                                        'multa',
                                                        e.target.value
                                                    )
                                                }
                                                className="mb-4"
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="vencimento"
                                                className="block text-sm font-medium text-[#11833B] uppercase"
                                            >
                                                Vencimento
                                            </label>
                                            <Input
                                                id="vencimento"
                                                type="date"
                                                placeholder="Vencimento"
                                                onChange={(e) =>
                                                    handleSetState(
                                                        'vencimento',
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
                                                id="valor"
                                                placeholder="Valor"
                                                onChange={(e) =>
                                                    handleSetState(
                                                        'valor',
                                                        e.target.value
                                                    )
                                                }
                                                className="mb-4"
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="observacoes"
                                                className="block text-sm font-medium text-[#11833B] uppercase"
                                            >
                                                Observações
                                            </label>
                                            <Input.TextArea
                                                id="observacoes"
                                                placeholder="Observações"
                                                onChange={(e) =>
                                                    handleSetState(
                                                        'observacoes',
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
                                        className="w-full"
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
