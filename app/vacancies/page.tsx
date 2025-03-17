'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { FloatingActionButton } from '@/components/vacancies/floating-action-button';
import { Table as AntdTable, Input, Button } from 'antd';
import { AuthGuard } from '@/components/ProtectedRoute/AuthGuard';

interface Vacancy {
    title: string;
}

export default function VacanciesPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [newVacancy, setNewVacancy] = useState('');

    const handleAddVacancy = () => {
        if (newVacancy.trim()) {
            setVacancies([...vacancies, { title: newVacancy }]);
            setNewVacancy('');
        }
    };

    const columns = [
        { title: 'Vaga', dataIndex: 'title', key: 'title' },
    ];

    return (
        <AuthGuard>
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
                        <h1 className="text-2xl font-bold text-primary mb-6">
                            Cadastro de Vagas
                        </h1>
                        <div className="mb-4">
                            <Input
                                placeholder="Nova Vaga"
                                value={newVacancy}
                                onChange={(e) => setNewVacancy(e.target.value)}
                                onPressEnter={handleAddVacancy}
                                className="mr-2"
                            />
                            <Button type="primary" onClick={handleAddVacancy}>
                                Adicionar
                            </Button>
                        </div>
                        <AntdTable columns={columns} dataSource={vacancies} rowKey="title" />
                    </div>
                </main>
            </div>
        </AuthGuard>
    );
} 