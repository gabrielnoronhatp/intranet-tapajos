'use client';
import React from 'react';
import { CheckCircle2, XCircle, Eye, Edit } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Image, Upload, UploadFile, message, Input, Button } from 'antd';
import { api } from '@/app/service/api';
import { UploadChangeParam } from 'antd/es/upload';
import './data-table-order-styles.css';
import { Table as AntdTable } from 'antd';
import { PinModal } from './pin-modal';
import {
    setOrderId,
    setSignatureNumber,
} from '@/hooks/slices/noPaper/noPaperSlice';
import { useDispatch } from 'react-redux';
import { OrderState } from '@/types/noPaper/Order/OrderTypes';
import { useRouter } from 'next/navigation';

interface DataTableOrderProps {
    searchParams: Record<string, string>;
    ordersSearch: Record<string, string>;
}

export function DataTableOrder({
    searchParams,
    ordersSearch,
}: DataTableOrderProps) {
    const dispatch = useDispatch();
    const router = useRouter();
    const [orders, setOrders] = useState<Array<OrderState>>([]);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedItem, setSelectedItem]: any = useState(null);
    const [fileUrls, setFileUrls] = useState<
        Array<{ url: string; name: string }>
    >([]);
    const [fileList, setFileList] = useState<any[]>([]);
    const [isPinModalOpen, setIsPinModalOpen] = useState(false);
    const [orderDetails, setOrderDetails] = useState<any>(null);

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

    const toggleView = async (item: any) => {
        setSelectedItem(item);
        setIsViewOpen(!isViewOpen);
        await fetchOrderDetails(item.id);

        if (!isViewOpen) {
            try {
                const response = await api.get(`arquivos/${item.id}`);
                console.log(response.data);

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

    const beforeUpload = (file: File) => {
        return true;
    };

    const handleUploadChange = (info: UploadChangeParam<UploadFile<any>>) => {
        console.log(info);
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
            render: (text: string, record: any) => (
                <span
                    onClick={() => {
                        dispatch(setOrderId(record.id));
                        dispatch(setSignatureNumber(1));
                        setIsPinModalOpen(true);
                    }}
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
            render: (text: string, record: any) => (
                <span
                    onClick={() => {
                        dispatch(setOrderId(record.id));
                        dispatch(setSignatureNumber(2));
                        setIsPinModalOpen(true);
                    }}
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
            render: (text: string, record: any) => (
                <span
                    onClick={() => {
                        dispatch(setOrderId(record.id));
                        dispatch(setSignatureNumber(3));
                        setIsPinModalOpen(true);
                    }}
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
            render: (record: any) => {
                const hasSignature =
                    record.assinatura1 ||
                    record.assinatura2 ||
                    record.assinatura3;
                return (
                    <>
                        <Eye
                            color="green"
                            onClick={() => toggleView(record)}
                            style={{ cursor: 'pointer', marginRight: 8 }}
                        />
                        <Edit
                            color={hasSignature ? 'gray' : 'green'}
                            onClick={() =>
                                !hasSignature && navigateToEditPage(record.id)
                            }
                            style={{
                                cursor: hasSignature
                                    ? 'not-allowed'
                                    : 'pointer',
                                marginRight: 8,
                            }}
                        />
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
                columns={columns as any}
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
                                                (item: any, index: number) => (
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
                                                    centro: any,
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
                                                        <a
                                                            href={file.url}
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
                                <h3 className="text-md font-bold mt-2">
                                    Upload de Arquivo:
                                </h3>
                                <Upload
                                    name="files"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={true}
                                    customRequest={async ({
                                        file,
                                        onSuccess,
                                        onError,
                                    }) => {
                                        try {
                                            const formData = new FormData();
                                            formData.append(
                                                'files',
                                                file as File
                                            );
                                            const response = await api.post(
                                                `upload/${selectedItem.id}`,
                                                formData
                                            );

                                            if (response.status !== 200) {
                                                throw new Error(
                                                    'Upload failed'
                                                );
                                            }

                                            const result = await response;
                                            onSuccess?.(result);
                                        } catch (error) {
                                            onError?.(error as any);
                                        }
                                    }}
                                    beforeUpload={beforeUpload}
                                    onChange={handleUploadChange}
                                    fileList={fileList}
                                >
                                    <div>
                                        <div style={{ marginTop: 8 }}>
                                            Upload
                                        </div>
                                    </div>
                                </Upload>
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
