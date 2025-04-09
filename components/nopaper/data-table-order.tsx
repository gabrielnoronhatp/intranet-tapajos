'use client';
import React from 'react';
import {
    CheckCircle2,
    XCircle,
    Eye,
    Edit,
    FileWarning,
    Trash2,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import {   message, Modal } from 'antd';
import { api } from '@/app/service/api';
import './data-table-order-styles.css';
import { Table as AntdTable } from 'antd';
import { PinModal } from './pin-modal';
import {
    setOrderId,
    setSignatureNumber,
    deleteFile,
} from '@/hooks/slices/noPaper/noPaperSlice';
import { useDispatch, } from 'react-redux';
import { OrderState, Item } from '@/types/noPaper/Order/OrderTypes';
import { cancelOrder } from '@/hooks/slices/noPaper/orderSlice';
import { ColumnType } from 'antd/es/table';
import { CentroCusto } from '@/types/noPaper/Order/CentroCustoType';
interface DataTableOrderProps {
    searchParams: Record<string, string>;
    
}

export function DataTableOrder({
    searchParams,
    
}: DataTableOrderProps) {
    const dispatch = useDispatch();

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
        await fetchOrderDetails(item.id);

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
            dispatch(setOrderId(record.id));
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
            // Para URLs no formato "https://intranet-tapajos.s3.us-east-1.amazonaws.com/578/1742492011990-NFSE 2133.pdf"
            const match = fileUrl.match(/amazonaws\.com\/(.+)$/);

            if (!match || !match[1]) {
                message.error('Formato de URL inválido');
                return;
            }

            // Extrai a parte após "amazonaws.com/" (ex: "578/1742492011990-NFSE 2133.pdf")
            const fileKey = match[1];

            Modal.confirm({
                title: 'Confirmar Exclusão',
                content: 'Você tem certeza que deseja excluir este arquivo?',
                onOk: async () => {
                    try {
                        await dispatch(deleteFile(fileKey));
                        message.success('Arquivo excluído com sucesso');

                        // Atualizar a lista de arquivos
                       
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
                                    navigateToEditPage(record.id)
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
                                    handleCancelOrderModal(record.id)
                                }
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
                        <div className="grid  gap-6">
                            <div>
                                <h2 className="text-lg font-bold">
                                    Detalhes do Item
                                </h2>
                                <p>ID: {selectedItem?.id}</p>
                                <p>Fornecedor: {selectedItem?.fornecedor}</p>
                                <p>CNPJ: {selectedItem?.cnpj}</p>
                                <p>Nota Fiscal: {selectedItem?.notafiscal}</p>
                                <p>
                                    Forma de Pagamento: {selectedItem?.formapag}
                                </p>
                                <p>
                                    Conta Gerencial:{' '}
                                    {selectedItem?.contagerencial}
                                </p>
                                <p>Itens: {selectedItem?.itens}</p>
                                <p>Parcelas: {selectedItem?.parcelas}</p>
                                <p>Valor: {selectedItem?.valor}</p>
                                <p>
                                    Assinatura 1:{' '}
                                    {selectedItem?.assinatura1 ? 'Sim' : 'Não'}
                                </p>
                                <p>
                                    Assinatura 2:{' '}
                                    {selectedItem?.assinatura2 ? 'Sim' : 'Não'}
                                </p>
                                <p>
                                    Assinatura 3:{' '}
                                    {selectedItem?.assinatura3 ? 'Sim' : 'Não'}
                                </p>

                                {orderDetails && (
                                    <>
                                        <h3 className="text-md font-bold mt-2">
                                            Itens Contratados:
                                        </h3>
                                        <ul>
                                            {orderDetails?.produtosOP?.map(
                                                (item: Item, index: number) => (
                                                    <li key={index}>
                                                        {item.produto} -{' '}
                                                        {item.valor}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                        <h3 className="text-md font-bold mt-2">
                                            Centros de Custo:
                                        </h3>
                                        <ul>
                                            {orderDetails?.ccustoOP?.map(
                                                (
                                                    centro: CentroCusto,
                                                    index: number
                                                ) => (
                                                    <li key={index}>
                                                        {centro.centrocusto} -{' '}
                                                        {centro.valor}
                                                    </li>
                                                )
                                            )}
                                        </ul>
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
                            className="mt-1 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
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
                orderId={selectedItem?.id}
            />
        </div>
    );
}
