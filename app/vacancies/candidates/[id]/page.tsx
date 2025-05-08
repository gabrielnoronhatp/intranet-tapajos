'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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
    MailOutlined as EmailIcon,
} from '@ant-design/icons';
import Link from 'next/link';
import { message } from 'antd';
import { ICandidate } from '@/types/vacancy/ICandidate';
import EmailModal from '@/components/modals/EmailModal';

const { TabPane } = Tabs;

export interface PageProps {
    name?: string;
    params?: {
        id: string;
    };
    searchParams?: {
        [key: string]: string | string[] | undefined;
    };
}

export default function VacancyCandidatesPage() {
    const { id } = useParams();
    
    const dispatch = useDispatch<AppDispatch>();
    const { currentVacancy, candidates, candidatesLoading, loading, vacancyName } =
        useSelector((state: RootState) => state.vacancy);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [selectedCandidate, setSelectedCandidate] = useState<ICandidate>();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
    const [selectedEmailCandidate, setSelectedEmailCandidate] =
        useState<ICandidate | null>(null);

    useEffect(() => {
        console.log(vacancyName);
        if (id) {
            dispatch(fetchVacancyById(id as string));
            dispatch(fetchVacancyCandidates(id as string));
        }
    }, [dispatch, id]);

    const showCandidateDetails = (candidate: ICandidate) => {
        if (!candidate) return;
        setSelectedCandidate(candidate);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedCandidate(undefined);
    };

    const showEmailModal = (candidate: ICandidate) => {
        if (!candidate) return;
        setSelectedEmailCandidate(candidate);
        setIsEmailModalVisible(true);
    };

    const handleEmailModalClose = () => {
        setIsEmailModalVisible(false);
        setSelectedEmailCandidate(null);
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

        return `https://api.rh.grupotapajos.com.br/candidato/cv/uploads/cv/${fileName}`;
    };

    const getCvViewUrl = (file_cv: string) => {
        if (!file_cv) return null;

        const fileName = file_cv.split('/').pop();
        if (!fileName) return null;

        return `https://api.rh.grupotapajos.com.br/candidato/cv/uploads/cv/${fileName}`;
    };

    const downloadCv = (candidate: ICandidate) => {
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

    // const getScoreColor = (score: number) => {
    //     if (score >= 5 && score < 7) return 'yellow';
    //     if (score >= 7 && score < 9) return 'green';
    //     if (score >= 9 && score < 10) return 'blue';
    //     if (score >= 10) return 'red';
    // };

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
            sorter: (a: ICandidate, b: ICandidate) =>
                a.nome_completo.localeCompare(b.nome_completo),
        },
        {
            title: 'Email',
            dataIndex: ['candidate', 'email'],
            key: 'email',
        },
        {
            title: 'Score',
            dataIndex: ['analise', 'score'],
            key: 'score',
            sorter: (a: ICandidate, b: ICandidate) => b.analise.score - a.analise.score,
           
            render: (score: number) => {
                if (score >= 5 && score < 7) return <Tag color="yellow">{score}</Tag>;
                if (score >= 7 && score < 9) return <Tag color="green">{score}</Tag>;
                if (score >= 9 && score < 10) return <Tag color="blue">{score}</Tag>;
                if (score >= 10) return <Tag color="red">{score}</Tag>;
                return score;
            },
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
            onFilter: (value: boolean, record: ICandidate) =>
                record.is_primeiraexperiencia === value,
        },
        {
            title: 'Disponível',
            dataIndex: ['candidate', 'is_disponivel'],
            key: 'is_disponivel',
            onFilter: (value: string, record: ICandidate) =>
                record.is_disponivel === value,
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
            onFilter: (value: boolean, record: ICandidate) =>
                record.is_analizado === value,
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
                                if (record.candidate) {
                                    downloadCv(record.candidate);
                                }
                            }}
                        />
                    </Tooltip>
                ) : (
                    <span className="text-gray-400">Não disponível</span>
                ),
        },
        {
            title: 'Enviar E-mail',
            key: 'enviar_email',
            render: (_: any, record: any) => (
                <Tooltip title="Enviar E-mail">
                    <Button
                        type="text"
                        icon={<EmailIcon style={{ color: '#1677ff' }} />}
                        onClick={(e) => {
                            e.stopPropagation();
                            showEmailModal(record);
                        }}
                    />
                </Tooltip>
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
    
    const getScoreColor = (score: number) => {
        if (score >= 5 && score < 7) return 'yellow';
        if (score >= 7 && score < 9) return 'green';
        if (score >= 9 && score < 10) return 'blue';
        if (score >= 10) return 'red';
        return 'gray';
    };
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
                                        Candidatos para: {vacancyName}
                                       
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
                                    <TabPane
                                        tab="Todos Candidatos"
                                        key="candidates"
                                    >
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
                                                sortDirections={['descend', 'ascend']}
                                                pagination={{ pageSize: 10 }}
                                            />
                                        ) : (
                                            <Empty
                                                description="Nenhum candidato encontrado para esta vaga"
                                                className="my-12"
                                            />
                                        )}
                                    </TabPane>

                                    {/* Aba de Candidatos Aprovados */}
                                    <TabPane
                                        tab={
                                            <span className="text-green-500 font-medium">
                                                Aprovados
                                            </span>
                                        }
                                        key="approved"
                                    >
                                        {candidatesLoading ? (
                                            <div className="flex justify-center items-center h-64">
                                                <Spin size="large" />
                                            </div>
                                        ) : candidates &&
                                          candidates.filter(
                                              (c: any) =>
                                                  c.analise?.status ===
                                                  'aprovado'
                                          ).length > 0 ? (
                                            <Table
                                                columns={columns as any}
                                                dataSource={candidates.filter(
                                                    (c: any) =>
                                                        c.analise?.status ===
                                                        'aprovado'
                                                )}
                                                rowKey={(record) =>
                                                    record.candidate.id
                                                }
                                                pagination={{ pageSize: 10 }}
                                            />
                                        ) : (
                                            <Empty
                                                description="Nenhum candidato aprovado para esta vaga"
                                                className="my-12"
                                            />
                                        )}
                                    </TabPane>

                                    {/* Aba de Candidatos em Entrevista */}
                                    <TabPane
                                        tab={
                                            <span className="text-blue-500 font-medium">
                                                Entrevistas
                                            </span>
                                        }
                                        key="interview"
                                    >
                                        {candidatesLoading ? (
                                            <div className="flex justify-center items-center h-64">
                                                <Spin size="large" />
                                            </div>
                                        ) : candidates &&
                                          candidates.filter(
                                              (c: any) =>
                                                  c.analise?.status ===
                                                  'entrevista'
                                          ).length > 0 ? (
                                            <Table
                                                columns={columns as any}
                                                dataSource={candidates.filter(
                                                    (c: any) =>
                                                        c.analise?.status ===
                                                        'entrevista'
                                                )}
                                                rowKey={(record) =>
                                                    record.candidate.id
                                                }
                                                pagination={{ pageSize: 10 }}
                                            />
                                        ) : (
                                            <Empty
                                                description="Nenhum candidato em fase de entrevista para esta vaga"
                                                className="my-12"
                                            />
                                        )}
                                    </TabPane>

                                    {/* Aba de Candidatos Recusados */}
                                    <TabPane
                                        tab={
                                            <span className="text-red-500 font-medium">
                                                Recusados
                                            </span>
                                        }
                                        key="rejected"
                                    >
                                        {candidatesLoading ? (
                                            <div className="flex justify-center items-center h-64">
                                                <Spin size="large" />
                                            </div>
                                        ) : candidates &&
                                          candidates.filter(
                                              (c: any) =>
                                                  c.analise?.status ===
                                                  'recusado'
                                          ).length > 0 ? (
                                            <Table
                                                columns={columns as any}
                                                dataSource={candidates.filter(
                                                    (c: any) =>
                                                        c.analise?.status ===
                                                        'recusado'
                                                )}
                                                rowKey={(record) =>
                                                    record.candidate.id
                                                }
                                                pagination={{ pageSize: 10 }}
                                            />
                                        ) : (
                                            <Empty
                                                description="Nenhum candidato recusado para esta vaga"
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
                                    selectedCandidate?.candidate &&
                                    downloadCv(selectedCandidate.candidate)
                                }
                                className="bg-blue-500 hover:bg-blue-600 mr-2"
                            >
                                Baixar Currículo
                            </Button>
                        ),
                        <Button
                            key="email"
                            type="primary"
                            icon={<EmailIcon />}
                            onClick={() => {
                                if (!selectedCandidate) return;
                                handleModalClose();
                                showEmailModal(selectedCandidate);
                            }}
                            className="bg-green-500 hover:bg-green-600 mr-2"
                        >
                            Enviar E-mail
                        </Button>,
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
                                                        ?.file_perfil || ''
                                                )}
                                                icon={
                                                    !selectedCandidate.candidate
                                                        ?.file_perfil && (
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
                                                                ?.file_perfil ||
                                                                ''
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
                                                        ?.nome_completo
                                                }
                                            </h2>
                                            <div className="flex items-center text-gray-600 mt-1">
                                                <MailOutlined className="mr-2" />
                                                {
                                                    selectedCandidate.candidate
                                                        ?.email
                                                }
                                            </div>
                                            <div className="flex items-center text-gray-600 mt-1">
                                                <PhoneOutlined className="mr-2" />
                                                {
                                                    selectedCandidate.candidate
                                                        ?.telefone
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <Descriptions bordered column={2}>
                                        <Descriptions.Item label="CPF">
                                            {selectedCandidate.candidate?.cpf}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Primeira Experiência">
                                            <Tag
                                                color={
                                                    selectedCandidate.candidate
                                                        ?.is_primeiraexperiencia
                                                        ? 'blue'
                                                        : 'green'
                                                }
                                            >
                                                {selectedCandidate.candidate
                                                    ?.is_primeiraexperiencia
                                                    ? 'Sim'
                                                    : 'Não'}
                                            </Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Disponível">
                                            <Tag>
                                                {
                                                    selectedCandidate.candidate
                                                        ?.is_disponivel
                                                }
                                            </Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Analisado">
                                            <Tag
                                                color={
                                                    selectedCandidate.candidate
                                                        ?.is_analizado
                                                        ? 'green'
                                                        : 'orange'
                                                }
                                            >
                                                {selectedCandidate.candidate
                                                    ?.is_analizado
                                                    ? 'Sim'
                                                    : 'Não'}
                                            </Tag>
                                        </Descriptions.Item>
                                        {selectedCandidate.analise?.status && (
                                            <Descriptions.Item label="Status">
                                                <Tag
                                                    color={
                                                        selectedCandidate
                                                            .analise.status ===
                                                        'aprovado'
                                                            ? 'green'
                                                            : selectedCandidate
                                                                    .analise
                                                                    .status ===
                                                                'recusado'
                                                              ? 'red'
                                                              : selectedCandidate
                                                                      .analise
                                                                      .status ===
                                                                  'entrevista'
                                                                ? 'blue'
                                                                : 'default'
                                                    }
                                                >
                                                    {selectedCandidate.analise
                                                        .status === 'aprovado'
                                                        ? 'Aprovado'
                                                        : selectedCandidate
                                                                .analise
                                                                .status ===
                                                            'recusado'
                                                          ? 'Recusado'
                                                          : selectedCandidate
                                                                  .analise
                                                                  .status ===
                                                              'entrevista'
                                                            ? 'Entrevista'
                                                            : 'Sem status'}
                                                </Tag>
                                            </Descriptions.Item>
                                        )}
                                    </Descriptions>
                                </TabPane>

                                {/* Aba de Análise - Exibida apenas se houver análise */}
                                {selectedCandidate.analise && (
                                    <TabPane tab="Análise" key="analise">
                                        <div className="mt-4">
                                            <h3 className="text-lg font-semibold mb-2">
                                                Análise
                                            </h3>

                                            {/* Score */}
                                            {selectedCandidate.analise
                                                .score && (
                                                <div className="mb-4">
                                                    <p className="text-2xl text-primary">
                                                        Score:
                                                    </p>
                                                    <p
                                                        className={`text-2xl ${getScoreColor(selectedCandidate.analise.score)} font-bold`}
                                                    >
                                                        {
                                                            selectedCandidate
                                                                .analise.score
                                                        }
                                                    </p>
                                                </div>
                                            )}

                                            {/* Status */}
                                            {selectedCandidate.analise
                                                .status && (
                                                <div className="mb-4">
                                                    <p className="text-xl text-primary mt-4">
                                                        Status:
                                                    </p>
                                                    <Tag
                                                        className="mt-2 text-lg px-3 py-1"
                                                        color={
                                                            selectedCandidate
                                                                .analise
                                                                .status ===
                                                            'aprovado'
                                                                ? 'green'
                                                                : selectedCandidate
                                                                        .analise
                                                                        .status ===
                                                                    'recusado'
                                                                  ? 'red'
                                                                  : selectedCandidate
                                                                          .analise
                                                                          .status ===
                                                                      'entrevista'
                                                                    ? 'blue'
                                                                    : 'default'
                                                        }
                                                    >
                                                        {selectedCandidate
                                                            .analise.status ===
                                                        'aprovado'
                                                            ? 'Aprovado'
                                                            : selectedCandidate
                                                                    .analise
                                                                    .status ===
                                                                'recusado'
                                                              ? 'Recusado'
                                                              : selectedCandidate
                                                                      .analise
                                                                      .status ===
                                                                  'entrevista'
                                                                ? 'Entrevista'
                                                                : 'Sem status'}
                                                    </Tag>
                                                </div>
                                            )}

                                            {/* Resumo do CV */}
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
                                                                    ...props
                                                                }) => (
                                                                    <h3
                                                                        className="text-xl font-bold mt-4 mb-2 text-primary"
                                                                        {...props}
                                                                    />
                                                                ),
                                                                h3: ({
                                                                    ...props
                                                                }) => (
                                                                    <h4
                                                                        className="text-lg font-semibold mt-3 mb-2 text-gray-800"
                                                                        {...props}
                                                                    />
                                                                ),
                                                                strong: ({
                                                                    ...props
                                                                }) => (
                                                                    <strong
                                                                        className="text-red-600 font-medium"
                                                                        {...props}
                                                                    />
                                                                ),
                                                                ul: ({
                                                                    ...props
                                                                }) => (
                                                                    <ul
                                                                        className="list-disc pl-6 mb-4"
                                                                        {...props}
                                                                    />
                                                                ),
                                                                li: ({
                                                                    ...props
                                                                }) => (
                                                                    <li
                                                                        className="mb-2"
                                                                        {...props}
                                                                    />
                                                                ),
                                                                p: ({
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
                                                    .cv_resumo &&
                                                !selectedCandidate.analise
                                                    .status && (
                                                    <p className="text-gray-500 italic">
                                                        Nenhuma análise
                                                        disponível
                                                    </p>
                                                )}
                                        </div>
                                    </TabPane>
                                )}

                                {/* Aba de Status (nova) */}
                                {selectedCandidate.analise?.status && (
                                    <TabPane
                                        tab={
                                            <span
                                                className={
                                                    selectedCandidate.analise
                                                        .status === 'aprovado'
                                                        ? 'text-green-500 font-medium'
                                                        : selectedCandidate
                                                                .analise
                                                                .status ===
                                                            'recusado'
                                                          ? 'text-red-500 font-medium'
                                                          : selectedCandidate
                                                                  .analise
                                                                  .status ===
                                                              'entrevista'
                                                            ? 'text-blue-500 font-medium'
                                                            : 'font-medium'
                                                }
                                            >
                                                Status
                                            </span>
                                        }
                                        key="status"
                                    >
                                        <div className="p-4">
                                            {/* Conteúdo para candidato em entrevista */}
                                            {selectedCandidate.analise
                                                .status === 'entrevista' && (
                                                <>
                                                    <h2 className="text-xl font-bold text-blue-600 mb-4">
                                                        Candidato para
                                                        Entrevista
                                                    </h2>
                                                    <p className="mb-4">
                                                        O candidato foi
                                                        selecionado para a etapa
                                                        de entrevista.
                                                    </p>

                                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                                                        <h3 className="text-lg font-medium text-blue-700 mb-2">
                                                            Próximos Passos:
                                                        </h3>
                                                        <ul className="list-disc pl-5 space-y-2">
                                                            <li>
                                                                Agendar
                                                                entrevista com o
                                                                candidato
                                                            </li>
                                                            <li>
                                                                Preparar
                                                                questões
                                                                específicas
                                                                baseadas no
                                                                currículo
                                                            </li>
                                                            <li>
                                                                Verificar
                                                                disponibilidade
                                                                do gestor da
                                                                vaga
                                                            </li>
                                                            <li>
                                                                Enviar e-mail de
                                                                confirmação após
                                                                o agendamento
                                                            </li>
                                                        </ul>
                                                    </div>

                                                    <Button
                                                        type="primary"
                                                        icon={<EmailIcon />}
                                                        onClick={() => {
                                                            handleModalClose();
                                                            showEmailModal(
                                                                selectedCandidate
                                                            );
                                                        }}
                                                        className="bg-blue-500 hover:bg-blue-600"
                                                    >
                                                        Enviar E-mail de
                                                        Agendamento
                                                    </Button>
                                                </>
                                            )}

                                            {/* Conteúdo para candidato aprovado */}
                                            {selectedCandidate.analise
                                                .status === 'aprovado' && (
                                                <>
                                                    <h2 className="text-xl font-bold text-green-600 mb-4">
                                                        Candidato Aprovado
                                                    </h2>
                                                    <p className="mb-4">
                                                        O candidato foi aprovado
                                                        para a vaga.
                                                    </p>

                                                    <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                                                        <h3 className="text-lg font-medium text-green-700 mb-2">
                                                            Próximos Passos:
                                                        </h3>
                                                        <ul className="list-disc pl-5 space-y-2">
                                                            <li>
                                                                Comunicar a
                                                                aprovação ao
                                                                candidato
                                                            </li>
                                                            <li>
                                                                Solicitar
                                                                documentação
                                                                necessária
                                                            </li>
                                                            <li>
                                                                Agendar exames
                                                                admissionais
                                                            </li>
                                                            <li>
                                                                Preparar o
                                                                processo de
                                                                integração
                                                            </li>
                                                        </ul>
                                                    </div>

                                                    <Button
                                                        type="primary"
                                                        icon={<EmailIcon />}
                                                        onClick={() => {
                                                            handleModalClose();
                                                            showEmailModal(
                                                                selectedCandidate
                                                            );
                                                        }}
                                                        className="bg-green-500 hover:bg-green-600"
                                                    >
                                                        Enviar E-mail de
                                                        Aprovação
                                                    </Button>
                                                </>
                                            )}

                                            {/* Conteúdo para candidato recusado */}
                                            {selectedCandidate.analise
                                                .status === 'recusado' && (
                                                <>
                                                    <h2 className="text-xl font-bold text-red-600 mb-4">
                                                        Candidato Recusado
                                                    </h2>
                                                    <p className="mb-4">
                                                        O candidato não foi
                                                        selecionado para
                                                        prosseguir no processo.
                                                    </p>

                                                    <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-4">
                                                        <h3 className="text-lg font-medium text-red-700 mb-2">
                                                            Motivos possíveis:
                                                        </h3>
                                                        <ul className="list-disc pl-5 space-y-2">
                                                            <li>
                                                                Perfil não
                                                                compatível com a
                                                                vaga
                                                            </li>
                                                            <li>
                                                                Experiência
                                                                insuficiente
                                                                para os
                                                                requisitos
                                                            </li>
                                                            <li>
                                                                Outros
                                                                candidatos com
                                                                melhor adequação
                                                            </li>
                                                            <li>
                                                                Disponibilidade
                                                                incompatível com
                                                                a necessidade
                                                            </li>
                                                        </ul>
                                                    </div>

                                                    <Button
                                                        type="primary"
                                                        icon={<EmailIcon />}
                                                        onClick={() => {
                                                            handleModalClose();
                                                            showEmailModal(
                                                                selectedCandidate
                                                            );
                                                        }}
                                                        className="bg-red-500 hover:bg-red-600"
                                                    >
                                                        Enviar E-mail de
                                                        Feedback
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </TabPane>
                                )}

                                {selectedCandidate.candidate?.file_cv && (
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
                                                        if (
                                                            !selectedCandidate
                                                                .candidate
                                                                ?.file_cv
                                                        )
                                                            return;
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
                {selectedEmailCandidate && (
                    <EmailModal
                        isVisible={isEmailModalVisible}
                        onClose={handleEmailModalClose}
                        vacancyId={id as string}
                        candidateId={selectedEmailCandidate.candidate?.id || ''}
                        candidate={selectedEmailCandidate}
                        vacancyName={currentVacancy?.nome_vaga || ''}
                    />
                )}
            </div>
        </AuthGuard>
    );
}
