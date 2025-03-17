'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { FloatingActionButton } from '@/components/vacancies/floating-action-button';
import { Table as AntdTable, Input, Button, Select } from 'antd';
import { AuthGuard } from '@/components/ProtectedRoute/AuthGuard';
import { Upload } from 'lucide-react';
import { Upload as AntdUpload } from 'antd';

interface Vacancy {
    title: string;
    imageUrl: string;
    source: string;
}

export default function VacanciesPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [newVacancy, setNewVacancy] = useState('Analista');
    const [imageUrl, setImageUrl] = useState('');
    const [source, setSource] = useState('Interna');

    const handleAddVacancy = () => {
        if (newVacancy.trim() && imageUrl.trim() && source.trim()) {
            setVacancies([
                ...vacancies,
                { title: newVacancy, imageUrl, source },
            ]);
            setNewVacancy('');
            setImageUrl('');
            setSource('');
        }
    };

    const columns = [
        { title: 'Vaga', dataIndex: 'title', key: 'title' },
        {
            title: 'Imagem',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (url: string) => (
                <img src={url} alt="Vaga" style={{ width: 50 }} />
            ),
        },
        { title: 'Origem', dataIndex: 'source', key: 'source' },
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
                        <div className="bg-white p-4 rounded shadow mb-4">
                            <div className="flex gap-2 mb-2">
                                <AntdUpload
                                    id="upload"
                                    name="files"
                                    listType="picture-card"
                                    className="avatar-uploader mb-4"
                                    showUploadList={true}
                                    beforeUpload={(file) => {
                                        return false;
                                    }}
                                >
                                    <div>
                                        <div style={{ marginTop: 8 }}>
                                            Upload
                                        </div>
                                    </div>
                                </AntdUpload>
                                <div>
                                <Select
                                    value={source}
                                    onChange={(value) => setSource(value)}
                                    className="flex-1  mr-2"
                                >
                                    <Select.Option value="Interna">
                                        Interna
                                    </Select.Option>
                                    <Select.Option value="Externa">
                                        Externa
                                    </Select.Option>
                                </Select>
                                <Select
                                    placeholder="Nova Vaga"
                                    value={newVacancy}
                                    onChange={(value) => setNewVacancy(value)}
                                    className="flex-1"
                                >
                                    <Select.Option value="Interna">
                                        Interna
                                    </Select.Option>
                                    <Select.Option value="Externa">
                                        Externa
                                    </Select.Option>
                                </Select>
                                </div>
                                
                                <Button
                                    type="primary"
                                    onClick={handleAddVacancy}
                                    className="bg-green-500 hover:bg-green-600"
                                >
                                    Adicionar
                                </Button>
                            </div>
                        </div>
                        <AntdTable
                            columns={columns}
                            dataSource={vacancies}
                            rowKey="title"
                        />
                    </div>
                </main>
            </div>
        </AuthGuard>
    );
}
