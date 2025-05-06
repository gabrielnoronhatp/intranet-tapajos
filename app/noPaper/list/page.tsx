'use client';

import React from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { DataTableOrder } from '@/components/nopaper/data-table-order';
import { FloatingActionButton } from '@/components/nopaper/floating-action-button';
import { AuthGuard } from '@/components/ProtectedRoute/AuthGuard';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { api } from '@/app/service/api';
import { OrderState } from '@/types/noPaper/Order/OrderState';
import { DatePicker } from 'antd';

export default function NoPaperList() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchParams, setSearchParams] = useState<Record<string, string>>({
        id: '',
        numero_nota: '',
        conta_gerencial: '',
        fornecedor: '',
        startDate: '',
        endDate: '',
    });
    const [orders, setOrders] = useState<OrderState[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSearchParams((prev: Record<string, string>) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDateRangeChange = (
        dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null,
        dateStrings: [string, string]
    ) => {
        if (dates && dates[0] && dates[1]) {
            setSearchParams((prev: Record<string, string>) => ({
                ...prev,
                startDate: dateStrings[0],
                endDate: dateStrings[1],
            }));
        } else {
            setSearchParams((prev: Record<string, string>) => ({
                ...prev,
                startDate: '',
                endDate: '',
            }));
        }
    };

    useEffect(() => {
        async function fetchOrders() {
            try {
                const { data } = await api.get('/orders', {
                    params: searchParams,
                });
                setOrders(data);
            } catch (error) {
                console.error('Erro ao buscar ordens:', error);
            }
        }
        fetchOrders();
    }, [searchParams, orders]);
    

    return (
        <AuthGuard>
            <div>
                <div className="min-h-screen bg-background">
                    <Navbar
                        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    />
                    <Sidebar isOpen={isSidebarOpen} />

                    <main
                        className={`pt-16 transition-all duration-300 ${
                            isSidebarOpen ? 'ml-64' : 'ml-16'
                        }`}
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-primary">
                                        Ordens de Pagamento
                                    </h1>
                                    <p className="text-muted-foreground mt-1">
                                        Listagem de Ordens de Pagamento para
                                        Assinatura
                                    </p>
                                </div>
                            </div>
                            <div className="mb-4">
                                <form className="flex flex-wrap gap-4">
                                    {Object.keys(searchParams)
                                        .filter(
                                            (key) =>
                                                key !== 'startDate' &&
                                                key !== 'endDate'
                                        )
                                        .map((key) => (
                                            <div
                                                key={key}
                                                className="flex flex-col w-40"
                                            >
                                                <label
                                                    htmlFor={key}
                                                    className="text-green-700 mb-1 uppercase"
                                                >
                                                    {key.replace('_', ' ')}
                                                </label>
                                                <input
                                                    id={key}
                                                    type="text"
                                                    name={key}
                                                    value={
                                                        searchParams[
                                                            key as keyof typeof searchParams
                                                        ]
                                                    }
                                                    onChange={handleInputChange}
                                                    placeholder={`Buscar por ${key.replace('_', ' ')}`}
                                                    className="p-1 border rounded"
                                                />
                                            </div>
                                        ))}
                                    <div className="flex flex-col w-64">
                                        <label
                                            htmlFor="dateRange"
                                            className="text-green-700 mb-1 uppercase"
                                        >
                                            Período
                                        </label>
                                        <DatePicker.RangePicker
                                            onChange={handleDateRangeChange}
                                            placeholder={[
                                                'Data de Início',
                                                'Data de Fim',
                                            ]}
                                            value={[
                                                searchParams.startDate
                                                    ? dayjs(
                                                          searchParams.startDate
                                                      )
                                                    : null,
                                                searchParams.endDate
                                                    ? dayjs(
                                                          searchParams.endDate
                                                      )
                                                    : null,
                                            ]}
                                            className="p-1 border rounded"
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="rounded-lg border bg-card">
                                <DataTableOrder
                                    searchParams={searchParams}
                                    // orders={orders}
                                />
                            </div>

                            <FloatingActionButton href="/noPaper" />
                        </div>
                    </main>
                </div>
            </div>
        </AuthGuard>
    );
}
