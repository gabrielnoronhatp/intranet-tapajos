'use client';

import React, { useState, useEffect } from 'react';
import { Table as AntdTable, Input, Button } from 'antd';
import { api, apiDev } from '@/app/service/api';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { FloatingActionButton } from '@/components/nopaper/floating-action-button';
import { AuthGuard } from '@/components/ProtectedRoute/AuthGuard';
import { IContract } from '@/types/Contracts/Contracts';
import { fetchContracts, fetchServiceTypes } from '@/hooks/slices/contracts/contractSlice';
import { RootState } from '@/hooks/store';
import { useDispatch, useSelector } from 'react-redux';

export default function ContractList() {
    const [searchParams, setSearchParams] = useState<any>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const dispatch = useDispatch();
    const contracts = useSelector((state: RootState) => state.contracts.contracts);
    const serviceTypes = useSelector((state: RootState) => state.contracts.serviceTypes);
    const loading = useSelector((state: RootState) => state.contracts.loading);

    useEffect(() => {
        dispatch(fetchContracts(searchParams) as any);
        dispatch(fetchServiceTypes() as any);
    }, [dispatch, searchParams]);


    

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
        { title: 'Valor', dataIndex: 'valor', key: 'valor' },
        { title: 'Observações', dataIndex: 'obs1', key: 'obs1' },
        {
            title: 'Ações',
            key: 'acoes',
            render: (record: IContract) => (
                <Button onClick={() => handleViewContract(record)}>
                    Ver Detalhes
                </Button>
            ),
        },
    ];

    const handleViewContract = (contract: IContract) => {
        console.log('Contrato selecionado:', contract);
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

                        <AntdTable
                            columns={columns}
                            dataSource={contracts}
                            rowKey="id"
                            pagination={false}
                            loading={loading}
                        />
                        <FloatingActionButton href="/contracts" />
                    </div>
                </main>
            </div>
        </AuthGuard>
    );
}