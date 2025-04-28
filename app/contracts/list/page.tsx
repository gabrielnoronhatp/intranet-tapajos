'use client';

import React, { useState, useEffect } from 'react';
import { Table as AntdTable, Input, DatePicker, Modal } from 'antd';
import { apiDev } from '@/app/service/api';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { FloatingActionButton } from '@/components/nopaper/floating-action-button';
import { AuthGuard } from '@/components/ProtectedRoute/AuthGuard';
import { IContract } from '@/types/Contracts/Contracts';
import {
    fetchContracts,
    fetchServiceTypes,
    cancelContract,
} from '@/hooks/slices/contracts/contractSlice';
import { AppDispatch, RootState } from '@/hooks/store';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, Edit, FileWarning } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { debounce } from 'lodash';
import '@/components/styles/table.css';
import { IFile } from '@/types/Contracts/IFile';

export default function ContractList() {
    const [searchParams, setSearchParams] = useState<Record<string, string>>(
        {}
    );
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedContract, setSelectedContract] = useState<IContract>();
    const [fileUrls, setFileUrls] = useState<
        Array<{ url: string; name: string }>
    >([]);

    const dispatch = useDispatch<AppDispatch>();
    const contracts = useSelector(
        (state: RootState) => state.contracts.contracts
    );
    const serviceTypes = useSelector(
        (state: RootState) => state.contracts.serviceTypes
    );
    const loading = useSelector((state: RootState) => state.contracts.loading);
    const router = useRouter();

    useEffect(() => {
        const params: string = new URLSearchParams(searchParams).toString();
        dispatch(fetchContracts(params));
        dispatch(fetchServiceTypes());
    }, [dispatch, searchParams]);

    const handleFilterChange = debounce((key: string, value: string) => {
        setSearchParams((prev) => {
            const newParams = { ...prev, [key]: value };
            if (!value) {
                delete newParams[key];
            }
            return newParams;
        });
    }, 300);

    const sortedContracts = [...contracts].sort(
        (a: IContract, b: IContract) => {
            const dateA = new Date(a.datalanc || '').getTime();
            const dateB = new Date(b.datalanc || '').getTime();
            return dateB - dateA;
        }
    );

    const handleCancelContract = async (contractId: number) => {
        try {
            await dispatch(cancelContract(contractId));
        } catch (error) {
            console.error('Erro ao cancelar contrato:', error);
        }
    };

    const confirmCancelContract = (contractId: number) => {
        Modal.confirm({
            title: 'Confirmar Cancelamento',
            content: 'Você tem certeza que deseja cancelar este contrato?',
            okText: 'Sim',
            cancelText: 'Não',
            onOk: () => handleCancelContract(contractId),
            okButtonProps: {
                style: {
                    backgroundColor: 'green',
                    borderColor: 'green',
                    boxShadow: 'none',
                },
            },
        });
    };

    const rowClassName = (record: IContract) => {
        if (record.cancelado) return 'contract-cancelled';

        const today = new Date();
        const dueDate = new Date(record.data_venc_contrato || '');
        const timeDiff = dueDate.getTime() - today.getTime();
        const daysToDue = timeDiff / (1000 * 3600 * 24);

        return daysToDue <= 7 ? 'contract-near-due' : '';
    };

    const columns = [
        {
            title: 'Tipo de Serviço',
            dataIndex: 'idtipo',
            key: 'idtipo',
            render: (idtipo: number) => {
                if (loading) return 'Carregando...';
                return serviceTypes[idtipo] || 'Tipo não encontrado';
            },
        },
        { title: 'Nome', dataIndex: 'nome', key: 'nome' },
        { title: 'Período', dataIndex: 'datalanc', key: 'datalanc' },
        { title: 'Índice', dataIndex: 'indice', key: 'indice' },
        { title: 'Multa', dataIndex: 'valor_multa', key: 'valor_multa' },
        {
            title: 'Vencimento',
            dataIndex: 'data_venc_contrato',
            key: 'data_venc_contrato',
        },
        {
            title: 'Início',
            dataIndex: 'data_inicio_contrato',
            key: 'data_inicio_contrato',
        },
        { title: 'Valor', dataIndex: 'valor_contrato', key: 'valor_contrato' },
        { title: 'Observações', dataIndex: 'obs1', key: 'obs1' },
        {
            title: 'Ações',
            key: 'acoes',
            render: (record: IContract) => (
                <>
                    {!record.cancelado && (
                        <>
                            <Eye
                                color="green"
                                onClick={() => handleViewContract(record)}
                                style={{ cursor: 'pointer', marginRight: 8 }}
                            />
                            <Edit
                                color="green"
                                onClick={() =>
                                    router.push(`/contracts/edit/${record.id}`)
                                }
                                style={{ cursor: 'pointer' }}
                            />
                        </>
                    )}
                    <FileWarning
                        color="green"
                        onClick={() => confirmCancelContract(record.id)}
                    />
                </>
            ),
        },
    ];

    const handleViewContract = async (contract: IContract) => {
        setSelectedContract(contract);
        setIsViewOpen(true);

        try {
            const response = await apiDev.get(`contracts/${contract.id}/files`);

            if (
                response.data &&
                response.data.files &&
                Array.isArray(response.data.files)
            ) {
                const formattedUrls = response.data.files.map(
                    (file: IFile) => ({
                        url: file.file_url,
                        name: file.filename || 'file',
                    })
                );
                setFileUrls(formattedUrls);
            } else {
                setFileUrls([]);
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
            setFileUrls([]);
        }
    };

    const formatDate = (date: string | Date | undefined): string => {
        if (!date) return 'N/A';
        if (date instanceof Date) return date.toLocaleDateString();
        return date; // Already a string
    };
    return (
        <AuthGuard>
            <div className="min-h-screen bg-background">
                <Navbar
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                />
                <Sidebar isOpen={isSidebarOpen} />
                <main
                    className={`pt-16 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}
                >
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-primary">
                                    Contratos
                                </h1>
                                <p className="text-muted-foreground mt-1">
                                    Listagem de Contratos
                                </p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <Input
                                placeholder="Tipo de Serviço"
                                onChange={(e) =>
                                    handleFilterChange(
                                        'descricao_tipo',
                                        e.target.value
                                    )
                                }
                                style={{ width: 200, marginRight: 8 }}
                            />
                            <Input
                                placeholder="Nome"
                                onChange={(e) =>
                                    handleFilterChange('nome', e.target.value)
                                }
                                style={{ width: 200, marginRight: 8 }}
                            />

                            <DatePicker
                                placeholder="Vencimento"
                                onChange={(_, dateString) =>
                                    handleFilterChange(
                                        'data_venc_contrato',
                                        dateString as string
                                    )
                                }
                                style={{ marginRight: 8 }}
                            />
                            <DatePicker
                                placeholder="Data de Lançamento"
                                onChange={(_, dateString) =>
                                    handleFilterChange(
                                        'datalanc',
                                        dateString as string
                                    )
                                }
                            />
                        </div>

                        <AntdTable
                            columns={columns}
                            dataSource={sortedContracts}
                            rowKey="id"
                            pagination={false}
                            loading={loading}
                            rowClassName={rowClassName}
                        />
                        <FloatingActionButton href="/contracts" />

                        {isViewOpen && selectedContract && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                                <div className="bg-white p-5 rounded-lg shadow-lg w-[700px] max-h-[80vh] overflow-y-auto mt-20">
                                    <div className="grid gap-6">
                                        <div>
                                            <h2 className="text-lg font-bold">
                                                Detalhes do Contrato
                                            </h2>
                                            <p>
                                                Tipo de Serviço:{' '}
                                                {
                                                    serviceTypes[
                                                        selectedContract.idtipo as number
                                                    ]
                                                }
                                            </p>
                                            <p>Nome: {selectedContract.nome}</p>
                                            <p>
                                                Período:{' '}
                                                {selectedContract.datalanc}
                                            </p>
                                            <p>
                                                Índice:{' '}
                                                {selectedContract.indice}
                                            </p>
                                            <p>
                                                Multa:{' '}
                                                {selectedContract.valor_multa}
                                            </p>
                                            <p>
                                                Vencimento:{' '}
                                                {formatDate(
                                                    selectedContract.data_venc_contrato
                                                )}
                                            </p>
                                            <p>
                                                Valor:{' '}
                                                {
                                                    selectedContract.valor_contrato
                                                }
                                            </p>
                                            <p>
                                                Observações:{' '}
                                                {selectedContract.obs1}
                                            </p>
                                        </div>

                                        {fileUrls.length > 0 && (
                                            <div className="mt-4">
                                                <h3 className="text-md font-bold mb-2">
                                                    Documentos Anexados:
                                                </h3>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {fileUrls.map(
                                                        (
                                                            file: {
                                                                url: string;
                                                                name: string;
                                                            },
                                                            index: number
                                                        ) => (
                                                            <div
                                                                key={index}
                                                                className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100"
                                                            >
                                                                <div className="flex flex-col flex-1">
                                                                    <span className="truncate">
                                                                        {
                                                                            file.name
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <a
                                                                    href={
                                                                        file.url
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                                                                >
                                                                    Download
                                                                </a>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => {
                                            setIsViewOpen(false);
                                            setFileUrls([]);
                                        }}
                                        className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                    >
                                        Fechar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </AuthGuard>
    );
}
