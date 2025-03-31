'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';

import { Table as AntdTable, Input, Button, Select, DatePicker } from 'antd';
import { AuthGuard } from '@/components/ProtectedRoute/AuthGuard';
import { Upload } from 'lucide-react';
import { Upload as AntdUpload } from 'antd';

interface Vacancy {
    title: string;
    imageUrl: string;
    source: string;
    period: string;
    availablePositions: number;
    validityPeriod: [string, string] | null;
}

export default function VacanciesPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [newVacancy, setNewVacancy] = useState('Analista');
    const [imageUrl, setImageUrl] = useState('');
    const [source, setSource] = useState('Interna');
    const [period, setPeriod] = useState('Comercial');
    const [availablePositions, setAvailablePositions] = useState(1);
    const [validityPeriod, setValidityPeriod] = useState<
        [string, string] | null
    >(null);

    const handleAddVacancy = () => {
        if (newVacancy.trim() && imageUrl.trim() && source.trim()) {
            setVacancies([
                ...vacancies,
                {
                    title: newVacancy,
                    imageUrl,
                    source,
                    period,
                    availablePositions,
                    validityPeriod,
                },
            ]);
            setNewVacancy('');
            setImageUrl('');
            setSource('');
            setPeriod('Comercial');
            setAvailablePositions(1);
            setValidityPeriod(null);
        }
    };

    const columns = [
        { title: 'Vaga', dataIndex: 'title', key: 'title' },
        { title: 'Posições', dataIndex: 'positions', key: 'positions' },
        {
            title: 'Candidaturas',
            dataIndex: 'candidaturas',
            key: 'candidaturas',
        },
        {
            title: 'Contratações',
            dataIndex: 'contratacoes',
            key: 'contratacoes',
        },
        {
            title: 'Contratação Até',
            dataIndex: 'contratacaoAte',
            key: 'contratacaoAte',
        },
        { title: 'Status', dataIndex: 'status', key: 'status' },
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
                            <div className="grid grid-cols-1 md:grid-cols-1gap-2 mb-4">
                                <div>
                                    <AntdUpload
                                        id="upload"
                                        name="files"
                                        listType="picture-card"
                                        className="avatar-uploader mb-2"
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
                                </div>

                                <div className="flex flex-col gap-3">
                                    <Select
                                        placeholder="Selecione a vaga"
                                        value={newVacancy}
                                        onChange={(value) =>
                                            setNewVacancy(value)
                                        }
                                        className="w-1/2 h-8"
                                        size="small"
                                    >
                                        <Select.Option value="Analista">
                                            Analista
                                        </Select.Option>
                                        <Select.Option value="Desenvolvedor">
                                            Desenvolvedor
                                        </Select.Option>
                                        <Select.Option value="Gerente">
                                            Gerente
                                        </Select.Option>
                                    </Select>

                                    <Select
                                        value={source}
                                        onChange={(value) => setSource(value)}
                                        className="w-1/2 h-8"
                                        size="small"
                                    >
                                        <Select.Option value="Interna">
                                            Interna
                                        </Select.Option>
                                        <Select.Option value="Externa">
                                            Externa
                                        </Select.Option>
                                    </Select>

                                    <Select
                                        value={period}
                                        onChange={(value) => setPeriod(value)}
                                        className="w-1/2 h-8"
                                        size="small"
                                    >
                                        <Select.Option value="Comercial">
                                            Período Comercial
                                        </Select.Option>
                                        <Select.Option value="Manhã">
                                            Manhã
                                        </Select.Option>
                                        <Select.Option value="Tarde">
                                            Tarde
                                        </Select.Option>
                                        <Select.Option value="Noite">
                                            Noite
                                        </Select.Option>
                                    </Select>

                                    <Input
                                        type="number"
                                        min={1}
                                        value={availablePositions}
                                        onChange={(e) =>
                                            setAvailablePositions(
                                                Number(e.target.value)
                                            )
                                        }
                                        placeholder="Quantidade de vagas"
                                        className="w-1/2 h-8"
                                        size="small"
                                    />

                                    <DatePicker.RangePicker
                                        onChange={(dates: any) =>
                                            setValidityPeriod(dates)
                                        }
                                        placeholder={['Início', 'Fim']}
                                        className="w-1/2 h-8"
                                        size="small"
                                    />

                                    <Button
                                        type="primary"
                                        onClick={handleAddVacancy}
                                        className="bg-green-500 hover:bg-green-600 w-1/2 h-8"
                                        style={{
                                            fontSize: '12px',
                                            height: '30px',
                                            width: '100px',
                                        }}
                                    >
                                        Adicionar Vaga
                                    </Button>
                                </div>
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
