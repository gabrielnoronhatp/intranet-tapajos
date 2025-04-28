'use client';
import React from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitOrder, setOrderState } from '@/hooks/slices/noPaper/orderSlice';
import { GetProp, message, Upload } from 'antd';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import OriginData from '@/components/nopaper/form/origin-data-form';
import FinancialData from '@/components/nopaper/form/financial-data-form';
import TaxesData from '@/components/nopaper/form/taxes-data-form';
import CenterOfCoust from '@/components/nopaper/form/center-of-coust-form';
import { AuthGuard } from '@/components/ProtectedRoute/AuthGuard';
import { PlusOutlined } from '@ant-design/icons';
import { api } from '@/app/service/api';
import { AppDispatch, RootState } from '@/hooks/store';
import { OrderState } from '@/types/noPaper/Order/OrderState';
import { CentroCusto } from '@/types/noPaper/Order/CentroCustoType';
import { OrderData } from '@/types/noPaper/Order/OrderData';

interface UploadResponse {
    message: string;
    opId: string;
    urls: string[];
}

export default function NoPaper() {
    const dispatch = useDispatch<AppDispatch>();
    const orderData = useSelector((state: RootState) => state.order);
    const user = useSelector((state: RootState) => state.auth.user);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [isSidebarOpen] = useState(false);
    const [isViewOpen] = useState(false);

    const handleSetState = (
        field: keyof OrderState,
        value: OrderState[keyof OrderState]
    ) => {
        if ((field === 'lojaOP' || field === 'fornecedorOP') && !value) {
            console.error(`${field} não pode ser vazio.`);
            return;
        }
        dispatch(setOrderState({ [field]: value }));
    };

    useEffect(() => {}, [orderData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validateCenters = () => {
            if (!orderData.ccustoOP || orderData.ccustoOP.length === 0) {
                return false;
            }

            return orderData.ccustoOP.every(
                (center: CentroCusto) =>
                    typeof center.centrocusto === 'string' &&
                    center.centrocusto.trim() !== ''
            );
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

        try {
            const orderWithUser = {
                ...orderData,
                userOP: user.username,
                id: orderData.id || 0,
            } as OrderData;

            const response = await dispatch(submitOrder(orderWithUser));
            const opId = response.payload?.id;

            if (!opId) {
                message.error('Erro ao criar a Ordem de Pagamento.');
                return;
            }

            if (fileList.length > 0) {
                const uploadPromises = fileList.map((file) => {
                    if (file.originFileObj) {
                        return handleUpload(file.originFileObj, opId);
                    }
                    return Promise.resolve([]);
                });

                const results = await Promise.all(uploadPromises);
                const successfulUploads = results.filter(
                    (urls) => urls.length > 0
                ).length;

                if (successfulUploads > 0) {
                    message.success(
                        `Ordem de pagamento criada e ${successfulUploads} ${successfulUploads === 1 ? 'arquivo enviado' : 'arquivos enviados'} com sucesso!`
                    );
                }
            } else {
                message.success('Ordem de pagamento criada com sucesso!');
            }
        } catch (error) {
            message.error('Erro ao processar o formulário.');
            console.error('Erro:', error);
        }
    };

    const handleUpload = async (file: File, opId: string) => {
        try {
            const formData = new FormData();
            formData.append('files', file);

            const response = await api.post<UploadResponse>(
                `upload/${opId}`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );

            if (response.data.urls?.length > 0) {
                message.success('Arquivo enviado com sucesso!');
                return response.data.urls;
            }
            return [];
        } catch (error) {
            message.error('Erro ao fazer upload do arquivo.');
            console.error('Erro no upload:', error);
            return [];
        }
    };
    type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

    const beforeUpload = (file: FileType) => {
        const isJpgOrPng =
            file.type === 'image/jpeg' ||
            file.type === 'image/png' ||
            file.type === 'application/pdf';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };
    return (
        <AuthGuard>
            <div className="min-h-screen bg-background">
                <Navbar
                    onToggleSidebar={() =>
                        handleSetState('isSidebarOpen', !isSidebarOpen)
                    }
                />
                <Sidebar isOpen={isSidebarOpen} />

                <main
                    className={`pt-16 transition-all duration-300 ${
                        isSidebarOpen ? 'ml-64' : 'ml-20'
                    }`}
                >
                    <div className="p-4">
                        <h1 className="text-xl font-bold text-primary mb-4">
                            Lançamento NoPaper
                        </h1>

                        <div className="max-w-3xl mx-auto">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <OriginData
                                    data={orderData as OrderData}
                                    onChange={handleSetState}
                                />

                                <FinancialData
                                    data={orderData as OrderData}
                                    onChange={handleSetState}
                                />

                                <TaxesData
                                    data={orderData as OrderData}
                                    onChange={handleSetState}
                                />

                                <CenterOfCoust
                                    data={orderData as OrderData}
                                    onChange={handleSetState}
                                />

                                <div className="mt-6">
                                    <Upload
                                        listType="picture-card"
                                        showUploadList={true}
                                        accept=".xls,.xlsx,.pdf,.jpg,.jpeg,.png"
                                        beforeUpload={beforeUpload}
                                        fileList={fileList}
                                        onChange={({
                                            fileList: newFileList,
                                        }) => {
                                            setFileList(newFileList);
                                        }}
                                        customRequest={async ({
                                            file,
                                            onSuccess,
                                        }) => {
                                            try {
                                                const formData = new FormData();
                                                formData.append(
                                                    'files',
                                                    file as File
                                                );

                                                const response = await api.post(
                                                    `upload/${orderData?.id}`,
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
                                            } catch (error: unknown) {
                                                console.error(
                                                    'Upload error:',
                                                    error
                                                );
                                                message.error(
                                                    'Falha ao enviar o arquivo. Tente novamente.',
                                                    3
                                                );
                                            }
                                        }}
                                    >
                                        <div>
                                            <PlusOutlined />
                                            <div style={{ marginTop: 8 }}>
                                                Upload
                                            </div>
                                        </div>
                                    </Upload>
                                    <div className="text-sm text-gray-500 mt-2">
                                        Você pode anexar múltiplos arquivos
                                        (Excel, PDF, JPG ou PNG)
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        className="w-full bg-primary hover:bg-primary/90"
                                    >
                                        Lançar Ordem de Pagamento
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                    {isViewOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                            <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm">
                                <h2 className="text-lg font-bold mb-2">
                                    Visualização
                                </h2>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </AuthGuard>
    );
}
