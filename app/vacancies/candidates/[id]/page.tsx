'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/hooks/store';
import {
    fetchVacancyById,
    fetchVacancyCandidates,
} from '@/hooks/slices/vacancySlice';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { AuthGuard } from '@/components/ProtectedRoute/AuthGuard';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import {
    Table,
    Button,
    Tag,
    Avatar,
    Spin,
    Empty,
    Modal,
    Descriptions,
    Image,
    Tooltip,
    Tabs,
    Card,
} from 'antd';
import {
    ArrowLeftOutlined,
    UserOutlined,
    PhoneOutlined,
    MailOutlined,
    FileOutlined,
    DownloadOutlined,
    FilePdfOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { message } from 'antd';

const { TabPane } = Tabs;

export default function VacancyCandidatesPage() {
    const { id } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const { currentVacancy, candidates, candidatesLoading, loading } =
        useSelector((state: RootState) => state.vacancy);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [allCandidates, setAllCandidates] = useState<any[]>([]);

    useEffect(() => {
        if (id) {
            dispatch(fetchVacancyById(id as string));
            dispatch(fetchVacancyCandidates(id as string));
        }
        // dispatch(fetchAllCandidates()).then((response) => {
        //     setAllCandidates(response.payload);
        // });
    }, [dispatch, id]);

    const showCandidateDetails = (candidate: any) => {
        setSelectedCandidate(candidate);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedCandidate(null);
    };

    const getProfileImageUrl = (file_perfil: string) => {
        if (!file_perfil) return null;

        const imageName = file_perfil.split('/').pop();
        if (!imageName) return null;

        return `https://api.rh.grupotapajos.com.br/candidato/perfil/${imageName}`;
    };

    const getCvUrl = (file_cv: string) => {
        if (!file_cv) return null;

        const fileName = file_cv.split('/').pop();
        if (!fileName) return null;

        return `https://api.rh.grupotapajos.com.br/candidato/cv/${fileName}`;
    };

    const getCvViewUrl = (file_cv: any) => {
        if (!file_cv) return null;

        const fileName = file_cv.split('/').pop();
        if (!fileName) return null;

        return `https://api.rh.grupotapajos.com.br/candidato/cv/uploads/cv/${fileName}`;
    };

    const downloadCv = (candidate: any) => {
        if (!candidate || !candidate.file_cv) {
            message.error('Currículo não disponível');
            return;
        }

        const cvUrl = getCvUrl(candidate.file_cv);
        if (!cvUrl) {
            message.error('Erro ao gerar link do currículo');
            return;
        }

        window.open(cvUrl, '_blank');
    };

    const showImagePreview = (imageUrl: string) => {
        setPreviewImage(imageUrl);
        setPreviewVisible(true);
    };

    const getScoreColor = (score: number) => {
        if (score < 5) return 'text-red-600';
        return 'text-green-600';
    };

    const columns = [
        {
            title: 'Foto',
            dataIndex: ['candidate', 'file_perfil'],
            key: 'file_perfil',
            render: (file_perfil: string) => {
                const imageUrl = getProfileImageUrl(file_perfil);
                return (
                    <Avatar
                        src={imageUrl}
                        icon={!imageUrl && <UserOutlined />}
                        size={40}
                        className="cursor-pointer"
                        onClick={() => imageUrl && showImagePreview(imageUrl)}
                    />
                );
            },
        },
        {
            title: 'Nome',
            dataIndex: ['candidate', 'nome_completo'],
            key: 'nome_completo',
            sorter: (a: any, b: any) =>
                a.candidate.nome_completo.localeCompare(
                    b.candidate.nome_completo
                ),
        },
        {
            title: 'Email',
            dataIndex: ['candidate', 'email'],
            key: 'email',
        },
        {
            title: 'Telefone',
            dataIndex: ['candidate', 'telefone'],
            key: 'telefone',
        },
        {
            title: 'Primeira Experiência',
            dataIndex: ['candidate', 'is_primeiraexperiencia'],
            key: 'is_primeiraexperiencia',
            render: (is_primeiraexperiencia: boolean) => (
                <Tag color={is_primeiraexperiencia ? 'blue' : 'green'}>
                    {is_primeiraexperiencia ? 'Sim' : 'Não'}
                </Tag>
            ),
            filters: [
                { text: 'Sim', value: true },
                { text: 'Não', value: false },
            ],
            onFilter: (value: boolean, record: any) =>
                record.candidate.is_primeiraexperiencia === value,
        },
        {
            title: 'Disponível',
            dataIndex: ['candidate', 'is_disponivel'],
            key: 'is_disponivel',
            render: (is_disponivel: string) => (
                <Tag color={is_disponivel === 'true' ? 'green' : 'red'}>
                    {is_disponivel === 'true' ? 'Sim' : 'Não'}
                </Tag>
            ),
            filters: [
                { text: 'Sim', value: 'true' },
                { text: 'Não', value: 'false' },
            ],
            onFilter: (value: string, record: any) =>
                record.candidate.is_disponivel === value,
        },
        {
            title: 'Analisado',
            dataIndex: ['candidate', 'is_analizado'],
            key: 'is_analizado',
            render: (is_analizado: boolean) => (
                <Tag color={is_analizado ? 'green' : 'orange'}>
                    {is_analizado ? 'Sim' : 'Não'}
                </Tag>
            ),
            filters: [
                { text: 'Sim', value: true },
                { text: 'Não', value: false },
            ],
            onFilter: (value: boolean, record: any) =>
                record.candidate.is_analizado === value,
        },
        {
            title: 'Currículo',
            dataIndex: ['candidate', 'file_cv'],
            key: 'file_cv',
            render: (file_cv: string, record: any) =>
                file_cv ? (
                    <Tooltip title="Baixar Currículo">
                        <Button
                            type="text"
                            icon={<FileOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                downloadCv(record.candidate);
                            }}
                        />
                    </Tooltip>
                ) : (
                    <span className="text-gray-400">Não disponível</span>
                ),
        },
        {
            title: 'Ações',
            key: 'actions',
            render: (_: any, record: any) => (
                <Button
                    type="primary"
                    onClick={() => showCandidateDetails(record)}
                    className="bg-[#11833b] hover:bg-[#11833b]"
                >
                    Ver Detalhes
                </Button>
            ),
        },
    ];

    const allCandidatesColumns = [
        {
            title: 'Nome',
            dataIndex: 'nome_completo',
            key: 'nome_completo',
            sorter: (a: any, b: any) =>
                a.nome_completo.localeCompare(b.nome_completo),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Telefone',
            dataIndex: 'telefone',
            key: 'telefone',
        },
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
                        <div className="mb-6">
                            <Link
                                href="/vacancies"
                                className="flex items-center text-blue-500 hover:text-blue-700"
                            >
                                <ArrowLeftOutlined className="mr-2" /> Voltar
                                para Vagas
                            </Link>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <Spin size="large" />
                            </div>
                        ) : (
                            <>
                                <div className="mb-6">
                                    <h1 className="text-2xl font-bold text-primary">
                                        Candidatos para:{' '}
                                        {currentVacancy?.nome_vaga}
                                    </h1>
                                    <p className="text-gray-600">
                                        Departamento:{' '}
                                        {currentVacancy?.departamento_vaga} |
                                        Tipo:{' '}
                                        {currentVacancy?.isInternalSelection
                                            ? 'Seleção Interna'
                                            : 'Seleção Externa'}
                                    </p>
                                </div>

                                <Tabs defaultActiveKey="candidates">
                                    <TabPane tab="Candidatos" key="candidates">
                                        {candidatesLoading ? (
                                            <div className="flex justify-center items-center h-64">
                                                <Spin size="large" />
                                            </div>
                                        ) : candidates &&
                                          candidates.length > 0 ? (
                                            <Table
                                                columns={columns as any}
                                                dataSource={candidates}
                                                rowKey={(record) =>
                                                    record.candidate.id
                                                }
                                                pagination={{ pageSize: 10 }}
                                            />
                                        ) : (
                                            <Empty
                                                description="Nenhum candidato encontrado para esta vaga"
                                                className="my-12"
                                            />
                                        )}
                                    </TabPane>
                                </Tabs>
                            </>
                        )}
                    </div>
                </main>

                <Modal
                    title="Detalhes do Candidato"
                    open={isModalVisible}
                    onCancel={handleModalClose}
                    footer={[
                        selectedCandidate?.candidate?.file_cv && (
                            <Button
                                key="download"
                                type="primary"
                                icon={<DownloadOutlined />}
                                onClick={() =>
                                    downloadCv(selectedCandidate.candidate)
                                }
                                className="bg-blue-500 hover:bg-blue-600 mr-2"
                            >
                                Baixar Currículo
                            </Button>
                        ),
                        <Button key="back" onClick={handleModalClose}>
                            Fechar
                        </Button>,
                    ]}
                    width={800}
                >
                    {selectedCandidate && (
                        <div className="mt-4">
                            <Tabs defaultActiveKey="info">
                                <TabPane tab="Informações Pessoais" key="info">
                                    <div className="flex items-center mb-6">
                                        <div className="mr-4">
                                            <Avatar
                                                src={getProfileImageUrl(
                                                    selectedCandidate.candidate
                                                        .file_perfil
                                                )}
                                                icon={
                                                    !selectedCandidate.candidate
                                                        .file_perfil && (
                                                        <UserOutlined />
                                                    )
                                                }
                                                size={64}
                                                className="cursor-pointer"
                                                onClick={() => {
                                                    const imageUrl =
                                                        getProfileImageUrl(
                                                            selectedCandidate
                                                                .candidate
                                                                .file_perfil
                                                        );
                                                    if (imageUrl)
                                                        showImagePreview(
                                                            imageUrl
                                                        );
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-semibold">
                                                {
                                                    selectedCandidate.candidate
                                                        .nome_completo
                                                }
                                            </h2>
                                            <div className="flex items-center text-gray-600 mt-1">
                                                <MailOutlined className="mr-2" />
                                                {
                                                    selectedCandidate.candidate
                                                        .email
                                                }
                                            </div>
                                            <div className="flex items-center text-gray-600 mt-1">
                                                <PhoneOutlined className="mr-2" />
                                                {
                                                    selectedCandidate.candidate
                                                        .telefone
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <Descriptions bordered column={2}>
                                        <Descriptions.Item label="CPF">
                                            {selectedCandidate.candidate.cpf}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Primeira Experiência">
                                            <Tag
                                                color={
                                                    selectedCandidate.candidate
                                                        .is_primeiraexperiencia
                                                        ? 'blue'
                                                        : 'green'
                                                }
                                            >
                                                {selectedCandidate.candidate
                                                    .is_primeiraexperiencia
                                                    ? 'Sim'
                                                    : 'Não'}
                                            </Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Disponível">
                                            <Tag
                                                color={
                                                    selectedCandidate.candidate
                                                        .is_disponivel ===
                                                    'true'
                                                        ? 'green'
                                                        : 'red'
                                                }
                                            >
                                                {selectedCandidate.candidate
                                                    .is_disponivel === 'true'
                                                    ? 'Sim'
                                                    : 'Não'}
                                            </Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Analisado">
                                            <Tag
                                                color={
                                                    selectedCandidate.candidate
                                                        .is_analizado
                                                        ? 'green'
                                                        : 'orange'
                                                }
                                            >
                                                {selectedCandidate.candidate
                                                    .is_analizado
                                                    ? 'Sim'
                                                    : 'Não'}
                                            </Tag>
                                        </Descriptions.Item>
                                    </Descriptions>

                                    {selectedCandidate.analise && (
                                        <div className="mt-6">
                                            <h3 className="text-lg font-semibold mb-2">
                                                Análise
                                            </h3>

                                            {selectedCandidate.analise
                                                .score && (
                                                <div className="mb-4">
                                                    <p className="text-2xl text-primary">
                                                        Score:
                                                    </p>
                                                    {selectedCandidate.analise
                                                        .score < 5 && (
                                                        <p
                                                            className={`text-2xl ${getScoreColor(selectedCandidate.analise.score)} font-bold`}
                                                        >
                                                            {
                                                                selectedCandidate
                                                                    .analise
                                                                    .score
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {selectedCandidate.analise
                                                .cv_resumo && (
                                                <div className="mt-6">
                                                    <h3 className="text-lg font-semibold mb-4">
                                                        Análise do Currículo
                                                    </h3>
                                                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 prose max-w-none overflow-y-auto max-h-96">
                                                        <ReactMarkdown
                                                            components={{
                                                                h2: ({
                                                                    node,
                                                                    ...props
                                                                }) => (
                                                                    <h3
                                                                        className="text-xl font-bold mt-4 mb-2 text-primary"
                                                                        {...props}
                                                                    />
                                                                ),
                                                                h3: ({
                                                                    node,
                                                                    ...props
                                                                }) => (
                                                                    <h4
                                                                        className="text-lg font-semibold mt-3 mb-2 text-gray-800"
                                                                        {...props}
                                                                    />
                                                                ),
                                                                strong: ({
                                                                    node,
                                                                    ...props
                                                                }) => (
                                                                    <strong
                                                                        className="text-red-600 font-medium"
                                                                        {...props}
                                                                    />
                                                                ),
                                                                ul: ({
                                                                    node,
                                                                    ...props
                                                                }) => (
                                                                    <ul
                                                                        className="list-disc pl-6 mb-4"
                                                                        {...props}
                                                                    />
                                                                ),
                                                                li: ({
                                                                    node,
                                                                    ...props
                                                                }) => (
                                                                    <li
                                                                        className="mb-2"
                                                                        {...props}
                                                                    />
                                                                ),
                                                                p: ({
                                                                    node,
                                                                    ...props
                                                                }) => (
                                                                    <p
                                                                        className="mb-3 text-gray-700 leading-relaxed"
                                                                        {...props}
                                                                    />
                                                                ),
                                                            }}
                                                            rehypePlugins={[
                                                                rehypeRaw,
                                                            ]}
                                                        >
                                                            {selectedCandidate.analise.cv_resumo
                                                                .replace(
                                                                    /\\n/g,
                                                                    '\n'
                                                                )
                                                                .replace(
                                                                    /\*\*/g,
                                                                    '**'
                                                                )
                                                                .replace(
                                                                    /## /g,
                                                                    '### '
                                                                )}
                                                        </ReactMarkdown>
                                                    </div>
                                                </div>
                                            )}

                                            {!selectedCandidate.analise.score &&
                                                !selectedCandidate.analise
                                                    .cv_resumo && (
                                                    <p className="text-gray-500 italic">
                                                        Nenhuma análise
                                                        disponível
                                                    </p>
                                                )}
                                        </div>
                                    )}
                                </TabPane>

                                {selectedCandidate.candidate.file_cv && (
                                    <TabPane
                                        tab={
                                            <span>
                                                <FilePdfOutlined /> Currículo
                                            </span>
                                        }
                                        key="cv"
                                    >
                                        <Card className="mb-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-lg font-semibold">
                                                    Currículo do Candidato
                                                </h3>
                                                <Button
                                                    type="primary"
                                                    icon={<DownloadOutlined />}
                                                    onClick={() => {
                                                        const url =
                                                            getCvViewUrl(
                                                                selectedCandidate
                                                                    .candidate
                                                                    .file_cv
                                                            );
                                                        if (url) {
                                                            window.open(
                                                                url,
                                                                '_blank'
                                                            );
                                                        }
                                                    }}
                                                    className="bg-blue-500 hover:bg-blue-600"
                                                >
                                                    Ver
                                                </Button>
                                            </div>

                                            <div
                                                className="border rounded overflow-hidden"
                                                style={{ height: '500px' }}
                                            >
                                                <iframe
                                                    src={`${getCvViewUrl(selectedCandidate.candidate.file_cv) || ''}#toolbar=0`}
                                                    width="100%"
                                                    height="100%"
                                                    style={{ border: 'none' }}
                                                    title="Currículo do Candidato"
                                                />
                                            </div>

                                            <p className="text-gray-500 text-sm mt-2">
                                                Se o currículo não carregar
                                                corretamente, você pode ver o
                                                currículo usando o botão acima.
                                            </p>
                                        </Card>
                                    </TabPane>
                                )}
                            </Tabs>
                        </div>
                    )}
                </Modal>
                <Modal
                    open={previewVisible}
                    title="Foto do Candidato"
                    footer={null}
                    onCancel={() => setPreviewVisible(false)}
                >
                    {previewImage && (
                        <Image
                            alt="Foto do candidato"
                            src={previewImage}
                            style={{ width: '100%' }}
                            preview={false}
                        />
                    )}
                </Modal>
            </div>
        </AuthGuard>
    );
}
