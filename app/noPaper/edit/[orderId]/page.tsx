'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import { setOrderState } from '@/hooks/slices/noPaper/orderSlice';
import { message, Upload } from 'antd';
import OriginData from '@/components/nopaper/form/origin-data-form';
import FinancialData from '@/components/nopaper/form/financial-data-form';
import TaxesData from '@/components/nopaper/form/taxes-data-form';
import CenterOfCoust from '@/components/nopaper/form/center-of-coust-form';
import { AuthGuard } from '@/components/ProtectedRoute/AuthGuard';
import { PlusOutlined } from '@ant-design/icons';
import { api } from '@/app/service/api';
import { useParams, useRouter } from 'next/navigation';

export default function EditOrderPage() {
    const dispatch = useDispatch();
    const params = useParams();
    const router = useRouter();
    const orderId = params?.orderId as string;

    const orderData = useSelector((state: any) => state.order);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [existingFiles, setExistingFiles] = useState<
        Array<{ url: string; name: string }>
    >([]);

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
                    setExistingFiles(data.anexos || []);
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
    }, [orderId, dispatch, router]);

    const handleSetState = (field: keyof typeof orderData, value: any) => {
        dispatch(setOrderState({ [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!orderData.lojaOP) {
            message.error('Por favor, selecione uma filial.');
            return;
        }

        const adjustedOrderData = { ...orderData };

        if (adjustedOrderData.forma_pag === 'pix') {
            delete adjustedOrderData.banco;
            delete adjustedOrderData.agencia;
            delete adjustedOrderData.conta;
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

    const beforeUpload = (file: File) => {
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'application/pdf',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ];

        if (!allowedTypes.includes(file.type)) {
            message.error('Formato de arquivo não suportado!');
            return false;
        }
        return true;
    };

    if (isLoading) {
        return <div>Carregando...</div>;
    }

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
                                    data={orderData}
                                    onChange={handleSetState}
                                />
                                <FinancialData
                                    data={orderData}
                                    onChange={handleSetState}
                                />
                                <TaxesData
                                    data={orderData}
                                    onChange={handleSetState}
                                />
                                <CenterOfCoust
                                    data={orderData}
                                    onChange={handleSetState}
                                />

                                <div className="mt-6">
                                    <Upload
                                        listType="picture-card"
                                        showUploadList={false}
                                        beforeUpload={beforeUpload}
                                        accept=".xls,.xlsx,.pdf,.jpg,.jpeg,.png"
                                        onChange={(info) => {
                                            const file =
                                                info.file.originFileObj;
                                            file && setSelectedFile(file);
                                        }}
                                    >
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>
                                            Upload
                                        </div>
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
                                                                <a
                                                                    href={
                                                                        file.url
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="truncate text-blue-600 underline"
                                                                >
                                                                    {file.name}
                                                                </a>
                                                            </div>
                                                            {/* Opcional: Adicionar opção para remover arquivos existentes */}
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
