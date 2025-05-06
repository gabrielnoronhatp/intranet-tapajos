'use client';
import React from 'react';
import {
    CheckCircle2,
    XCircle,
    Eye,
    Edit,
    FileWarning,
    Trash2,
    Copy,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { message, Modal } from 'antd';
import { api } from '@/app/service/api';
import './data-table-order-styles.css';
import { Table as AntdTable } from 'antd';
import { PinModal } from './pin-modal';
import {
    setOrderId,
    setSignatureNumber,
    deleteFile,
} from '@/hooks/slices/noPaper/noPaperSlice';
import { useDispatch } from 'react-redux';
import { OrderState } from '@/types/noPaper/Order/OrderState';
import { cancelOrder, duplicateOrder } from '@/hooks/slices/noPaper/orderSlice';
import { ColumnType } from 'antd/es/table';
import { AppDispatch } from '@/hooks/store';
interface DataTableOrderProps {
    searchParams: Record<string, string>;
}

export function DataTableOrder({ searchParams }: DataTableOrderProps) {
    const dispatch = useDispatch<AppDispatch>();

    const [orders, setOrders] = useState<Array<OrderState>>([]);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<OrderState | null>(null);
    const [fileUrls, setFileUrls] = useState<
        Array<{ url: string; name: string }>
    >([]);

    const [isPinModalOpen, setIsPinModalOpen] = useState(false);
    const [orderDetails, setOrderDetails] = useState<OrderState | null>(null);

    const fetchOrders = async (
        params: Record<string, string> = searchParams
    ) => {
        try {
            const query = new URLSearchParams(params).toString();
            const response = await api.get(`buscar-ordem?${query}`);
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [searchParams]);

    const fetchOrderDetails = async (ordemId: number) => {
        try {
            const response = await api.get(`ordem-detalhes/${ordemId}`);
            setOrderDetails(response.data);
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
    };

    const toggleView = async (item: OrderState) => {
        setSelectedItem(item);
        setIsViewOpen(!isViewOpen);
        await fetchOrderDetails(item.id as number);

        if (!isViewOpen) {
            try {
                const response = await api.get(`arquivos/${item.id}`);

                if (
                    response.data &&
                    response.data.urls &&
                    Array.isArray(response.data.urls)
                ) {
                    // Mapeia as URLs para o formato esperado
                    const formattedUrls = response.data.urls.map(
                        (url: string) => ({
                            url: url,
                            name: url.split('/').pop() || 'file', // Extrai o nome do arquivo da URL
                        })
                    );
                    setFileUrls(formattedUrls);
                } else {
                    setFileUrls([]);
                }
            } catch (error) {
                console.error('Error fetching files:', error);
                setFileUrls([]);
            }
        } else {
            setFileUrls([]);
        }
    };

    const handleClosePinModal = () => {
        setIsPinModalOpen(false);
    };

    const handleConfirmPin = () => {
        setIsPinModalOpen(false);
        fetchOrders();
    };

    const checkUserPermission = async (
        signerName: string,
        signatureNumber: number
    ) => {
        try {
            const response = await api.post('/orders/permission', {
                signerName,
                signatureNumber,
            });

            return response.data;
        } catch (error) {
            console.error('Error checking user permission:', error);
            return false;
        }
    };

    const handleSignatureClick = async (
        record: OrderState,
        signatureNumber: number
    ) => {
        const auth = localStorage.getItem('auth');
        const userName = JSON.parse(auth || '{}');
        const user = userName.user;
        const hasPermission = await checkUserPermission(
            user.username,
            signatureNumber
        );
        if (hasPermission) {
            dispatch(setOrderId(record.id as number));
            dispatch(setSignatureNumber(signatureNumber));
            setIsPinModalOpen(true);
        } else {
            message.error('Você não tem permissão para assinar esta ordem.');
        }
    };

    const handleCancelOrderModal = async (orderId: number) => {
        Modal.confirm({
            title: 'Confirmar Cancelamento',
            content: 'Você tem certeza que deseja cancelar esta ordem?',
            onOk: async () => {
                await handleCancelOrder(orderId);
            },
            okButtonProps: {
                style: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
            },
        });
    };

    const handleCancelOrder = async (orderId: number) => {
        try {
            dispatch(cancelOrder(orderId));
            fetchOrders();
        } catch (error) {
            console.error('Error canceling order:', error);
        }
    };

    const handleDeleteFile = async (fileUrl: string) => {
        try {
            const match = fileUrl.match(/amazonaws\.com\/(.+)$/);

            if (!match || !match[1]) {
                message.error('Formato de URL inválido');
                return;
            }

            const fileKey = match[1];

            Modal.confirm({
                title: 'Confirmar Exclusão',
                content: 'Você tem certeza que deseja excluir este arquivo?',
                onOk: async () => {
                    try {
                        await dispatch(deleteFile(fileKey));
                        message.success('Arquivo excluído com sucesso');
                    } catch (error) {
                        console.error('Erro ao excluir arquivo:', error);
                        message.error('Erro ao excluir arquivo');
                    }
                },
                okButtonProps: {
                    style: {
                        backgroundColor: '#f44336',
                        borderColor: '#f44336',
                    },
                },
            });
        } catch (error) {
            console.error('Erro ao excluir arquivo:', error);
            message.error('Erro ao excluir arquivo');
        }
    };

    const handleDuplicateOrder = async (orderId: number) => {
        try {
            await dispatch(duplicateOrder(orderId));
            fetchOrders();
        } catch (error) {
            console.error('Erro ao duplicar ordem:', error);
        }
        
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Fornecedor', dataIndex: 'fornecedor', key: 'fornecedor' },
        { title: 'CNPJ', dataIndex: 'cnpj', key: 'cnpj' },
        { title: 'Nota Fiscal', dataIndex: 'notafiscal', key: 'notafiscal' },
        { title: 'Forma Pag.', dataIndex: 'formapag', key: 'formapag' },
        {
            title: 'Conta Gerencial',
            dataIndex: 'contagerencial',
            key: 'contagerencial',
        },
        { title: 'Itens', dataIndex: 'itens', key: 'itens', align: 'center' },
        {
            title: 'Parcelas',
            dataIndex: 'parcelas',
            key: 'parcelas',
            align: 'center',
        },
        { title: 'Valor', dataIndex: 'valor', key: 'valor', align: 'right' },
        {
            title: 'Assinatura 1',
            dataIndex: 'assinatura1',
            key: 'assinatura1',
            align: 'center',
            render: (text: string, record: OrderState) => (
                <span
                    onClick={() => handleSignatureClick(record, 1)}
                    style={{ cursor: 'pointer' }}
                >
                    {text ? (
                        <CheckCircle2 color="green" />
                    ) : (
                        <XCircle color="red" />
                    )}
                </span>
            ),
        },
        {
            title: 'Assinatura 2',
            dataIndex: 'assinatura2',
            key: 'assinatura2',
            align: 'center',
            render: (text: string, record: OrderState) => (
                <span
                    onClick={() => handleSignatureClick(record, 2)}
                    style={{ cursor: 'pointer' }}
                >
                    {text ? (
                        <CheckCircle2 color="green" />
                    ) : (
                        <XCircle color="red" />
                    )}
                </span>
            ),
        },
        {
            title: 'Assinatura 3',
            dataIndex: 'assinatura3',
            key: 'assinatura3',
            align: 'center',
            render: (text: string, record: OrderState) => (
                <span
                    onClick={() => handleSignatureClick(record, 3)}
                    style={{ cursor: 'pointer' }}
                >
                    {text ? (
                        <CheckCircle2 color="green" />
                    ) : (
                        <XCircle color="red" />
                    )}
                </span>
            ),
        },
        {
            title: 'Ações',
            key: 'acoes',
            align: 'center',
            render: (record: OrderState) => {
                const hasSignature =
                    record.assinatura1 ||
                    record.assinatura2 ||
                    record.assinatura3;
                const isCanceled = record.canceled;

                return (
                    <>
                        {!isCanceled && (
                            <Eye
                                color="green"
                                onClick={() => toggleView(record)}
                                style={{ cursor: 'pointer', marginRight: 8 }}
                            />
                        )}
                        {!isCanceled && (
                            <Edit
                                color={hasSignature ? 'gray' : 'green'}
                                onClick={() =>
                                    !hasSignature &&
                                    navigateToEditPage(record.id as number)
                                }
                                style={{
                                    cursor: hasSignature
                                        ? 'not-allowed'
                                        : 'pointer',
                                    marginRight: 8,
                                }}
                            />
                        )}
                        {!isCanceled && (
                            <FileWarning
                                type="link"
                                onClick={() =>
                                    handleCancelOrderModal(record.id as number)
                                }
                                style={{ color: 'green' }}
                            />
                        )}
                        {!isCanceled && (
                            <Copy
                                type="link"
                                onClick={() => handleDuplicateOrder(record.id as number)}
                                style={{ color: 'green' }}
                            />
                        )}
                    </>
                );
            },
        },
    ];

    const navigateToEditPage = (orderId: number) => {
        window.location.href = `/noPaper/edit/${orderId}`;
    };

    return (
        <div className="rounded-md border">
            <AntdTable
                columns={columns as ColumnType<OrderState>[]}
                dataSource={orders}
                rowKey="id"
                pagination={false}
            />

            {isViewOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-5 rounded-lg shadow-lg w-[700px] max-h-[80vh] overflow-y-auto mt-20">
                        <div className="grid gap-6">
                            <div>
                                <h2 className="text-lg font-bold">
                                    Detalhes do Item
                                </h2>
                                <p>ID: {selectedItem?.id}</p>
                                <p>
                                    Data de Lançamento:{' '}
                                    {orderDetails?.dtlanc
                                        ? new Date(
                                              orderDetails.dtlanc
                                          ).toLocaleDateString('pt-BR')
                                        : '-'}
                                </p>
                                <p>
                                    Fornecedor:{' '}
                                    {orderDetails?.fornecedorOP || '-'}
                                </p>
                                <p>CNPJ: {selectedItem?.cnpj || '-'}</p>
                                <p>
                                    Nota Fiscal: {orderDetails?.notaOP || '-'}
                                </p>
                                <p>Série: {orderDetails?.serieOP || '-'}</p>
                                <p>
                                    Forma de Pagamento:{' '}
                                    {orderDetails?.metodoOP || '-'}
                                </p>
                                <p>Ramo: {orderDetails?.ramoOP || '-'}</p>
                                <p>
                                    Opção de Lançamento:{' '}
                                    {orderDetails?.opcaoLancOP || '-'}
                                </p>
                                <p>Loja: {orderDetails?.lojaOP || '-'}</p>
                                <p>
                                    Conta Gerencial:{' '}
                                    {orderDetails?.contagerencialOP || '-'}
                                </p>
                                <p>Itens: {orderDetails?.qtitensOP || '-'}</p>
                                <p>
                                    Parcelas:{' '}
                                    {orderDetails?.qtparcelasOP || '-'}
                                </p>
                                <p>
                                    Valor: {orderDetails?.valorimpostoOP || '-'}
                                </p>
                                <p>Usuário: {orderDetails?.userOP || '-'}</p>

                                {orderDetails?.observacaoOP && (
                                    <p>
                                        Observação: {orderDetails.observacaoOP}
                                    </p>
                                )}

                                {orderDetails &&
                                    orderDetails.parcelasOP &&
                                    orderDetails.parcelasOP.length > 0 && (
                                        <>
                                            <h3 className="text-md font-bold mt-4">
                                                Parcelas:
                                            </h3>
                                            <div className="bg-gray-50 p-3 rounded border">
                                                {orderDetails.parcelasOP.map(
                                                    (parcela, index) => (
                                                        <div
                                                            key={index}
                                                            className="mb-2 pb-2 border-b border-gray-200 last:border-b-0"
                                                        >
                                                            <p>
                                                                Data:{' '}
                                                                {parcela.parcela
                                                                    ? new Date(
                                                                          parcela.parcela
                                                                      ).toLocaleDateString(
                                                                          'pt-BR'
                                                                      )
                                                                    : '-'}
                                                            </p>
                                                            {parcela.banco && (
                                                                <p>
                                                                    Banco:{' '}
                                                                    {
                                                                        parcela.banco
                                                                    }
                                                                </p>
                                                            )}
                                                            {parcela.agencia && (
                                                                <p>
                                                                    Agência:{' '}
                                                                    {
                                                                        parcela.agencia
                                                                    }
                                                                </p>
                                                            )}
                                                            {parcela.conta && (
                                                                <p>
                                                                    Conta:{' '}
                                                                    {
                                                                        parcela.conta
                                                                    }
                                                                </p>
                                                            )}
                                                            {parcela.tipopix && (
                                                                <p>
                                                                    Tipo PIX:{' '}
                                                                    {
                                                                        parcela.tipopix
                                                                    }
                                                                </p>
                                                            )}
                                                            {parcela.chavepix && (
                                                                <p>
                                                                    Chave PIX:{' '}
                                                                    {
                                                                        parcela.chavepix
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </>
                                    )}

                                {orderDetails &&
                                    orderDetails.produtosOP &&
                                    orderDetails.produtosOP.length > 0 && (
                                        <>
                                            <h3 className="text-md font-bold mt-4">
                                            Itens Contratados:
                                        </h3>
                                            <div className="bg-gray-50 p-4 rounded border">
                                                {orderDetails.produtosOP.map(
                                                    (item, index) => (
                                                        <div
                                                            key={index}
                                                            className="mb-2 pb-2 border-b border-gray-200 last:border-b-0"
                                                        >
                                                            <p>
                                                                <strong>
                                                                    Produto:
                                                                </strong>{' '}
                                                                {item.produto}
                                                            </p>
                                                            <p>
                                                                <strong>
                                                                    Valor:
                                                                </strong>{' '}
                                                                R${' '}
                                                                {parseFloat(
                                                                    item.valor.toString()
                                                                ).toLocaleString(
                                                                    'pt-BR',
                                                                    {
                                                                        minimumFractionDigits: 2,
                                                                    }
                                                                )}
                                                            </p>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </>
                                    )}

                                {orderDetails &&
                                    orderDetails.ccustoOP &&
                                    orderDetails.ccustoOP.length > 0 && (
                                        <>
                                            <h3 className="text-md font-bold mt-4">
                                            Centros de Custo:
                                        </h3>
                                            <div className="bg-gray-50 p-4 rounded border">
                                                {orderDetails.ccustoOP.map(
                                                    (centro, index) => (
                                                        <div
                                                            key={index}
                                                            className="mb-2 pb-2 border-b border-gray-200 last:border-b-0"
                                                        >
                                                            <p>
                                                                <strong>
                                                                    Centro de
                                                                    Custo:
                                                                </strong>{' '}
                                                                {
                                                                    centro.centrocusto
                                                                }
                                                            </p>
                                                            <p>
                                                                <strong>
                                                                    Valor:
                                                                </strong>{' '}
                                                                R${' '}
                                                                {parseFloat(
                                                                    centro.valor.toString()
                                                                ).toLocaleString(
                                                                    'pt-BR',
                                                                    {
                                                                        minimumFractionDigits: 2,
                                                                    }
                                                                )}
                                                            </p>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                    </>
                                )}

                                {fileUrls.length > 0 && (
                                    <div className="mt-4">
                                        <h3 className="text-md font-bold mb-2">
                                            Arquivos Anexados:
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
                                                                {file.name}
                                                            </span>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <a
                                                                href={file.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                                                            >
                                                                Download
                                                            </a>
                                                            <button
                                                                onClick={() =>
                                                                    handleDeleteFile(
                                                                        file.url
                                                                    )
                                                                }
                                                                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
                                                            >
                                                                <Trash2
                                                                    size={16}
                                                                    className="mr-1"
                                                                />{' '}
                                                                Excluir
                                                            </button>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setIsViewOpen(false);
                                setOrderDetails(null);
                            }}
                            className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}

            <PinModal
                isOpen={isPinModalOpen}
                onClose={handleClosePinModal}
                onConfirm={handleConfirmPin}
                orderId={selectedItem?.id as number}
            />
        </div>
    );
}
