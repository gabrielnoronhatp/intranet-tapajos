'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import { setOrderState } from '@/hooks/slices/noPaper/orderSlice';
import { message, Upload, Modal, UploadFile } from 'antd';
import OriginData from '@/components/nopaper/form/origin-data-form';
import FinancialData from '@/components/nopaper/form/financial-data-form';
import TaxesData from '@/components/nopaper/form/taxes-data-form';
import CenterOfCoust from '@/components/nopaper/form/center-of-coust-form';
import { AuthGuard } from '@/components/ProtectedRoute/AuthGuard';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { api } from '@/app/service/api';
import { useParams, useRouter } from 'next/navigation';
import { deleteFile } from '@/hooks/slices/noPaper/noPaperSlice';
import { RootState, AppDispatch } from '@/hooks/store';
import { OrderState } from '@/types/noPaper/Order/OrderState';
import { UploadChangeParam } from 'antd/es/upload';
import { CentroCusto } from '@/types/noPaper/Order/CentroCustoType';
import { OrderData } from '@/types/noPaper/Order/OrderData';

export default function EditOrderPage() {
    const dispatch = useDispatch<AppDispatch>();
    const params = useParams();
    const router = useRouter();
    const orderId = params?.orderId as string;

    const orderData = useSelector((state: RootState) => state.order);
    const [selectedFile, setSelectedFile] = useState<File>();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [existingFiles, setExistingFiles] = useState<
        Array<{ url: string; name: string }>
    >([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fileList, setFileList] = useState<UploadFile<unknown>[]>([]);

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const response = await api.get(`ordem-detalhes/${orderId}`);
                if (response.status === 200) {
                    const data = response.data;
                    if (
                        data.assinatura1 ||
                        data.assinatura2 ||
                        data.assinatura3
                    ) {
                        message.error(
                            'Esta ordem não pode ser editada porque já possui assinaturas.'
                        );
                        router.push('/noPaper/list');
                        return;
                    }
                    dispatch(setOrderState(data));

                    try {
                        const filesResponse = await api.get(
                            `arquivos/${orderId}`
                        );
                        if (
                            filesResponse.data &&
                            filesResponse.data.urls &&
                            Array.isArray(filesResponse.data.urls)
                        ) {
                            const formattedUrls = filesResponse.data.urls.map(
                                (url: string) => ({
                                    url: url,
                                    name: url.split('/').pop() || 'file',
                                })
                            );
                            setExistingFiles(formattedUrls);
                        }
                    } catch (fileError) {
                        console.error('Erro ao buscar arquivos:', fileError);
                        setExistingFiles([]);
                    }
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Erro ao buscar dados da ordem:', error);
                message.error('Erro ao carregar ordem para edição');
                setIsLoading(false);
            }
        };

        if (orderId) {
            fetchOrderData();
        }
    }, [orderId, dispatch, router, fileList, isLoading]);

    const handleSetState = (
        field: keyof OrderState,
        value: OrderState[keyof OrderState]
    ) => {
        dispatch(setOrderState({ [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validateCenters = () => {
            if (!orderData.ccustoOP || orderData.ccustoOP.length === 0) {
                return false;
            }

            return orderData.ccustoOP.every((center: CentroCusto) => {
                const centroCusto = center.centrocusto.toString();
                return (
                    typeof centroCusto === 'string' && centroCusto.trim() !== ''
                );
            });
        };

        if (!validateCenters()) {
            message.error(
                'Preencha todos os Centros de Custo antes de continuar.'
            );
            return;
        }

        if (!orderData.lojaOP) {
            message.error('Por favor, selecione uma filial.');
            return;
        }

        const adjustedOrderData = { ...orderData };

        if (adjustedOrderData.metodoOP === 'pix') {
            delete adjustedOrderData.bancoOP;
            delete adjustedOrderData.agenciaOP;
            delete adjustedOrderData.contaOP;
        }

        try {
            const response = await api.put(
                `atualizar-ordem/${orderId}`,
                adjustedOrderData
            );

            if (selectedFile) {
                const formData = new FormData();
                formData.append('files', selectedFile);
                await api.post(`upload/${orderId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }

            if (response.status === 200) {
                message.success('Ordem atualizada com sucesso!');
                router.push('/noPaper/list');
            }
        } catch (error) {
            console.error('Erro ao atualizar ordem:', error);
            message.error('Erro ao atualizar ordem de pagamento');
        }
    };

    const handleUploadChange = (
        info: UploadChangeParam<UploadFile<unknown>>
    ) => {
        if (info.file.status === 'done') {
            message.success(`${info.file.name} foi enviado com sucesso!`);
            setSelectedFile(info.file.originFileObj);
        } else if (info.file.status === 'error') {
            message.error(`Falha ao enviar ${info.file.name}.`);
        }
        setFileList(info.fileList);
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

                        const updatedFiles = existingFiles.filter(
                            (file) => file.url !== fileUrl
                        );
                        setExistingFiles(updatedFiles);
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

    const handleOnChange = (
        field: keyof OrderState,
        value: OrderState[keyof OrderState]
    ) => {
        handleSetState(field, value);
    };

    return (
        <AuthGuard>
            <div className="min-h-screen bg-background">
                <Navbar
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                />
                <Sidebar isOpen={isSidebarOpen} />

                <main
                    className={`pt-16 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}
                >
                    <div className="p-4">
                        <h1 className="text-xl font-bold text-primary mb-4">
                            Editar Ordem de Pagamento
                        </h1>

                        <div className="max-w-3xl mx-auto">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <OriginData
                                    data={orderData as OrderData}
                                    onChange={handleOnChange}
                                />
                                <FinancialData
                                    data={orderData as OrderData}
                                    onChange={handleSetState}
                                />
                                <TaxesData
                                    data={orderData as OrderData}
                                    onChange={handleOnChange}
                                />
                                <CenterOfCoust
                                    data={orderData as OrderData}
                                    onChange={handleOnChange}
                                />

                                <div className="mt-6">
                                    <h3 className="text-md font-bold mb-2">
                                        Anexar Arquivo:
                                    </h3>
                                    <Upload
                                        listType="picture-card"
                                        showUploadList={true}
                                        accept=".xls,.xlsx,.pdf,.jpg,.jpeg,.png"
                                        onChange={handleUploadChange}
                                        fileList={
                                            selectedFile
                                                ? [
                                                      {
                                                          uid: '-1',
                                                          name: selectedFile.name,
                                                          status: 'done',
                                                          url: URL.createObjectURL(
                                                              selectedFile
                                                          ),
                                                      },
                                                  ]
                                                : []
                                        }
                                        onRemove={() =>
                                            setSelectedFile(undefined)
                                        }
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
                                                    `upload/${orderId}`,
                                                    formData,
                                                    {
                                                        headers: {
                                                            'Content-Type':
                                                                'multipart/form-data',
                                                        },
                                                    }
                                                );

                                                if (response.status !== 200) {
                                                    throw new Error(
                                                        'Upload failed'
                                                    );
                                                }

                                                message.success(
                                                    'Arquivo enviado com sucesso!',
                                                    3
                                                );
                                                onSuccess?.(response.data);
                                                try {
                                                    const filesResponse =
                                                        await api.get(
                                                            `arquivos/${orderId}`
                                                        );
                                                    if (
                                                        filesResponse.data &&
                                                        filesResponse.data
                                                            .urls &&
                                                        Array.isArray(
                                                            filesResponse.data
                                                                .urls
                                                        )
                                                    ) {
                                                        const formattedUrls =
                                                            filesResponse.data.urls.map(
                                                                (
                                                                    url: string
                                                                ) => ({
                                                                    url: url,
                                                                    name:
                                                                        url
                                                                            .split(
                                                                                '/'
                                                                            )
                                                                            .pop() ||
                                                                        'file',
                                                                })
                                                            );
                                                        setExistingFiles(
                                                            formattedUrls
                                                        );
                                                    }
                                                } catch (fileError) {
                                                    console.error(
                                                        'Erro ao atualizar lista de arquivos:',
                                                        fileError
                                                    );
                                                }
                                            } catch (error) {
                                                console.error(
                                                    'Upload error:',
                                                    error
                                                );
                                                message.error(
                                                    'Falha ao enviar o arquivo. Tente novamente.',
                                                    3
                                                );
                                                onError?.(error as Error);
                                            }
                                        }}
                                    >
                                        {!selectedFile && (
                                            <div>
                                                <PlusOutlined />
                                                <div style={{ marginTop: 8 }}>
                                                    Upload
                                                </div>
                                            </div>
                                        )}
                                    </Upload>

                                    {existingFiles.length > 0 && (
                                        <div className="mt-4">
                                            <h3 className="text-md font-bold mb-2">
                                                Arquivos Existentes:
                                            </h3>
                                            <div className="grid grid-cols-1 gap-2">
                                                {existingFiles.map(
                                                    (file, index) => (
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
                                                                    href={
                                                                        file.url
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                                                                >
                                                                    Download
                                                                </a>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleDeleteFile(
                                                                            file.url
                                                                        )
                                                                    }
                                                                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
                                                                >
                                                                    <DeleteOutlined
                                                                        size={
                                                                            16
                                                                        }
                                                                        className="mr-1"
                                                                    />
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

                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        className="w-full bg-primary hover:bg-primary/90"
                                    >
                                        Atualizar Ordem
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
