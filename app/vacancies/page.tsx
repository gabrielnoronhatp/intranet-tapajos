'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import {
    Table as AntdTable,
    Input,
    Button,
    Select,
    DatePicker,
    message,
    Modal,
    Form,
    Descriptions,
    Tag,
    Image,
    Tabs,
} from 'antd';
import { AuthGuard } from '@/components/ProtectedRoute/AuthGuard';
import { Upload as AntdUpload } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/hooks/store';
import {
    fetchVacancies,
    createVacancy,
    updateVacancy,
    deleteVacancy,
    fetchDepartments,
} from '@/hooks/slices/vacancySlice';
import dayjs from 'dayjs';
import { Vacancy, CreateVacancyPayload } from '@/types/vacancy/IVacancy';
import {
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import { CustomTagRender } from '@/components/employees/tags';
import { useRouter } from 'next/navigation';
import { Users } from 'lucide-react';

const { TabPane } = Tabs;

export default function VacanciesPage() {
    const dispatch = useDispatch<AppDispatch>();
    const {
        vacancies,
        loading,
        error,
        departments,
        departmentsLoading,
        positions,
    } = useSelector((state: RootState) => state.vacancy);
    const router = useRouter();

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(
        null
    );

    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<any>([]);
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchVacancies());
        dispatch(fetchDepartments());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            message.error(error);
        }
    }, [error]);

    const showViewModal = (record: Vacancy) => {
        setSelectedVacancy(record);
        setIsViewModalVisible(true);
    };

    const handleViewCancel = () => {
        setIsViewModalVisible(false);
        setSelectedVacancy(null);
    };

    const showModal = (record?: Vacancy) => {
        if (record) {
            setEditingId(record.id);
            form.setFieldsValue({
                nome_vaga: record.nome_vaga,
                departamento_vaga: record.departamento_vaga,
                requisitos: record.requisitos
                    .split(',')
                    .map((tag) => tag.trim()),
                diferencial: record.diferencial
                    .split(',')
                    .map((tag) => tag.trim()),
                limit_candidatos: record.limit_candidatos,
                isInternalSelection: record.isInternalSelection,
                url_link: record.url_link,
                data_range: record.data_final
                    ? [dayjs(record.data_inicial), dayjs(record.data_final)]
                    : [dayjs(record.data_inicial), null],
            });

            if (record.imagem_capa) {
                setFileList([
                    {
                        uid: '-1',
                        name: 'Imagem atual',
                        status: 'done',
                        url: record.imagem_capa,
                    },
                ]);
            } else {
                setFileList([]);
            }
        } else {
            setEditingId(null);
            form.resetFields();
            setFileList([]);
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setFileList([]);
        setEditingId(null);
    };

    const refreshVacancies = () => {
        dispatch(fetchVacancies());
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            if (editingId) {
                const currentVacancy = vacancies.find(
                    (v) => v.id === editingId
                );

                if (!currentVacancy) {
                    message.error('Vaga não encontrada');
                    return;
                }

                const changedFields: Partial<CreateVacancyPayload> = {};

                if (values.nome_vaga !== currentVacancy.nome_vaga) {
                    changedFields.nome_vaga = values.nome_vaga;
                }

                if (
                    values.departamento_vaga !==
                    currentVacancy.departamento_vaga
                ) {
                    changedFields.departamento_vaga = values.departamento_vaga;
                }

                if (values.requisitos !== currentVacancy.requisitos) {
                    changedFields.requisitos = values.requisitos;
                }

                if (values.diferencial !== currentVacancy.diferencial) {
                    changedFields.diferencial = values.diferencial;
                }

                if (
                    Number(values.limit_candidatos) !==
                    currentVacancy.limit_candidatos
                ) {
                    changedFields.limit_candidatos = Number(
                        values.limit_candidatos
                    );
                }

                if (
                    values.isInternalSelection !==
                    currentVacancy.isInternalSelection
                ) {
                    changedFields.isInternalSelection =
                        values.isInternalSelection;
                }

                if ((values.url_link || null) !== currentVacancy.url_link) {
                    changedFields.url_link = values.url_link || null;
                }

                const newDataInicial =
                    values.data_range[0].format('YYYY-MM-DD');
                if (newDataInicial !== currentVacancy.data_inicial) {
                    changedFields.data_inicial = newDataInicial;
                }

                const newDataFinal = values.data_range[1]
                    ? values.data_range[1].format('YYYY-MM-DD')
                    : null;
                if (newDataFinal !== currentVacancy.data_final) {
                    changedFields.data_final = newDataFinal;
                }

                if (fileList.length > 0 && fileList[0].originFileObj) {
                    changedFields.imagem_capa = fileList[0].originFileObj;
                }
                if (Object.keys(changedFields).length === 0) {
                    message.info('Nenhuma alteração detectada');
                    setIsModalVisible(false);
                    return;
                }

                if (
                    !changedFields.departamento_vaga &&
                    changedFields.departamento_vaga !== ''
                ) {
                    changedFields.departamento_vaga =
                        currentVacancy.departamento_vaga;
                }

                if (
                    !changedFields.requisitos &&
                    changedFields.requisitos !== ''
                ) {
                    changedFields.requisitos = currentVacancy.requisitos;
                }

                if (
                    !changedFields.diferencial &&
                    changedFields.diferencial !== ''
                ) {
                    changedFields.diferencial = currentVacancy.diferencial;
                }

                if (
                    !changedFields.nome_vaga &&
                    changedFields.nome_vaga !== ''
                ) {
                    changedFields.nome_vaga = currentVacancy.nome_vaga;
                }

                console.log('Campos alterados:', changedFields);

                await dispatch(
                    updateVacancy({ id: editingId, data: changedFields })
                );
                message.success('Vaga atualizada com sucesso!');

                refreshVacancies();
            } else {
                const vacancyData: CreateVacancyPayload = {
                    nome_vaga: values.nome_vaga,
                    departamento_vaga: values.departamento_vaga,
                    requisitos: values.requisitos.join(','),
                    diferencial: values.diferencial.join(','),
                    limit_candidatos: Number(values.limit_candidatos),
                    isInternalSelection: values.isInternalSelection,
                    url_link: values.url_link || null,
                    data_inicial: values.data_range[0].format('YYYY-MM-DD'),
                    data_final: values.data_range[1]
                        ? values.data_range[1].format('YYYY-MM-DD')
                        : null,
                    imagem_capa:
                        fileList.length > 0 && fileList[0].originFileObj
                            ? fileList[0].originFileObj
                            : null,
                };

                console.log('Dados da nova vaga:', vacancyData);

                await dispatch(createVacancy(vacancyData));
                message.success('Vaga criada com sucesso!');

                refreshVacancies();
            }

            setIsModalVisible(false);
            form.resetFields();
            setFileList([]);
            setEditingId(null);
        } catch (error) {
            console.error('Erro ao salvar vaga:', error);
            message.error(
                'Erro ao salvar vaga. Verifique os campos e tente novamente.'
            );
        }
    };

    const handleDelete = async (id: string) => {
        Modal.confirm({
            title: 'Tem certeza que deseja excluir esta vaga?',
            content: 'Esta ação não pode ser desfeita.',
            okText: 'Sim',
            okType: 'danger',
            cancelText: 'Não',
            onOk: async () => {
                await dispatch(deleteVacancy(id));
                message.success('Vaga excluída com sucesso!');
                refreshVacancies();
            },
        });
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return dayjs(dateString).format('DD/MM/YYYY');
    };

    const viewCandidates = (vacancyId: string) => {
        router.push(`/vacancies/candidates/${vacancyId}`);
    };

    const columns = [
        {
            title: 'Vaga',
            dataIndex: 'nome_vaga',
            key: 'nome_vaga',
            sorter: (a: Vacancy, b: Vacancy) =>
                a.nome_vaga.localeCompare(b.nome_vaga),
        },
        {
            title: 'Departamento',
            dataIndex: 'departamento_vaga',
            key: 'departamento_vaga',
            filters: [
                { text: 'TI', value: 'TI' },
                { text: 'RH', value: 'RH' },
                { text: 'Financeiro', value: 'Financeiro' },
                { text: 'Comercial', value: 'Comercial' },
                { text: 'Marketing', value: 'Marketing' },
            ],
            onFilter: (value: string, record: Vacancy) =>
                record.departamento_vaga === value,
        },
        {
            title: 'Data de Início',
            dataIndex: 'data_inicial',
            key: 'data_inicial',
            render: (text: string) => formatDate(text),
            sorter: (a: Vacancy, b: Vacancy) =>
                new Date(a.data_inicial).getTime() -
                new Date(b.data_inicial).getTime(),
        },
        {
            title: 'Data de Fim',
            dataIndex: 'data_final',
            key: 'data_final',
            render: (text: string | null) => formatDate(text),
        },
        {
            title: 'Limite de Candidatos',
            dataIndex: 'limit_candidatos',
            key: 'limit_candidatos',
            sorter: (a: Vacancy, b: Vacancy) =>
                a.limit_candidatos - b.limit_candidatos,
        },
        {
            title: 'Status',
            key: 'is_ativo',
            render: (is_ativo: Vacancy) => {
                return (
                    <Tag color={is_ativo.is_ativo ? 'green' : 'red'}>
                        {is_ativo.is_ativo ? 'Ativa' : 'Inativa'}
                    </Tag>
                );
            },
            filters: [
                { text: 'Ativa', value: 'active' },
                { text: 'Inativa', value: 'inactive' },
            ],
            onFilter: (value: string, record: Vacancy) => {
                const today = dayjs().format('YYYY-MM-DD');
                const isActive =
                    record.data_inicial <= today &&
                    (!record.data_final || record.data_final >= today);

                return (
                    (value === 'active' && isActive) ||
                    (value === 'inactive' && !isActive)
                );
            },
        },
        {
            title: 'Tipo',
            dataIndex: 'isInternalSelection',
            key: 'isInternalSelection',
            render: (isInternal: boolean) => (
                <Tag color={isInternal ? 'blue' : 'green'}>
                    {isInternal ? 'Interna' : 'Externa'}
                </Tag>
            ),
            filters: [
                { text: 'Interna', value: true },
                { text: 'Externa', value: false },
            ],
            onFilter: (value: boolean, record: Vacancy) =>
                record.isInternalSelection === value,
        },
        {
            title: 'Ações',
            key: 'actions',
            render: (_: any, record: Vacancy) => (
                <div className="flex space-x-2">
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => showViewModal(record)}
                        className="bg-[#11833b] hover:bg-[#11833b]"
                        size="small"
                    />
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => showModal(record)}
                        className="bg-[#11833b] hover:bg-[#11833b]"
                        size="small"
                    />
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                        className="bg-[#11833b] hover:bg-[#11833b]"
                        size="small"
                    />
                    <Button
                        type="primary"
                        icon={<Users />}
                        onClick={() => viewCandidates(record.id)}
                        className="bg-[#11833b] hover:bg-[#11833b]"
                        size="small"
                    ></Button>
                </div>
            ),
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
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-primary">
                                Gerenciamento de Vagas
                            </h1>
                            <Button
                                type="primary"
                                onClick={() => showModal()}
                                className="bg-[#11833b] hover:bg-[#11833b] "
                            >
                                +
                            </Button>
                        </div>

                        <Tabs defaultActiveKey="vacancies">
                            <TabPane tab="Vagas" key="vacancies">
                                <AntdTable
                                    columns={columns as any}
                                    dataSource={vacancies}
                                    rowKey="id"
                                    loading={loading}
                                    pagination={{ pageSize: 10 }}
                                />
                            </TabPane>

                            <TabPane tab="Todos os Candidatos" key="new-tab">
                                <div>
                                    <h2 className="text-xl font-bold">
                                        Conteúdo da Nova Aba
                                    </h2>
                                    <p>
                                        Aqui você pode adicionar qualquer
                                        conteúdo ou funcionalidade específica
                                        para esta aba.
                                    </p>
                                </div>
                            </TabPane>
                        </Tabs>
                    </div>
                </main>

                {/* Modal de Visualização */}
                <Modal
                    title="Detalhes da Vaga"
                    open={isViewModalVisible}
                    onCancel={handleViewCancel}
                    footer={[
                        <Button key="back" onClick={handleViewCancel}>
                            Fechar
                        </Button>,
                        <Button
                            key="edit"
                            type="primary"
                            onClick={() => {
                                handleViewCancel();
                                if (selectedVacancy) showModal(selectedVacancy);
                            }}
                            className="bg-blue-500 hover:bg-blue-600"
                        >
                            Editar
                        </Button>,
                    ]}
                    width={800}
                >
                    {selectedVacancy && (
                        <div className="mt-4">
                            {selectedVacancy.imagem_capa && (
                                <div className="mb-6 flex justify-center">
                                    <Image
                                        src={selectedVacancy.imagem_capa}
                                        alt={selectedVacancy.nome_vaga}
                                        style={{ maxHeight: '200px' }}
                                    />
                                </div>
                            )}

                            <Descriptions bordered column={2}>
                                <Descriptions.Item
                                    label="Nome da Vaga"
                                    span={2}
                                >
                                    {selectedVacancy.nome_vaga}
                                </Descriptions.Item>

                                <Descriptions.Item label="Departamento">
                                    {selectedVacancy.departamento_vaga}
                                </Descriptions.Item>

                                <Descriptions.Item label="Tipo de Seleção">
                                    <Tag
                                        color={
                                            selectedVacancy.isInternalSelection
                                                ? 'blue'
                                                : 'green'
                                        }
                                    >
                                        {selectedVacancy.isInternalSelection
                                            ? 'Interna'
                                            : 'Externa'}
                                    </Tag>
                                </Descriptions.Item>

                                <Descriptions.Item label="Limite de Candidatos">
                                    {selectedVacancy.limit_candidatos}
                                </Descriptions.Item>

                                <Descriptions.Item label="Criado por">
                                    {selectedVacancy.criado_por || '-'}
                                </Descriptions.Item>

                                <Descriptions.Item label="Data de Criação">
                                    {formatDate(selectedVacancy.data_criacao)}
                                </Descriptions.Item>

                                <Descriptions.Item label="Data de Atualização">
                                    {formatDate(selectedVacancy.data_update)}
                                </Descriptions.Item>

                                <Descriptions.Item
                                    label="Período de Validade"
                                    span={2}
                                >
                                    {formatDate(selectedVacancy.data_inicial)}{' '}
                                    até {formatDate(selectedVacancy.data_final)}
                                </Descriptions.Item>

                                {selectedVacancy.url_link && (
                                    <Descriptions.Item label="URL" span={2}>
                                        <a
                                            href={selectedVacancy.url_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {selectedVacancy.url_link}
                                        </a>
                                    </Descriptions.Item>
                                )}
                            </Descriptions>

                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-2">
                                    Requisitos
                                </h3>
                                <div className="bg-gray-50 p-4 rounded border whitespace-pre-line">
                                    {selectedVacancy.requisitos}
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-2">
                                    Diferenciais
                                </h3>
                                <div className="bg-gray-50 p-4 rounded border whitespace-pre-line">
                                    {selectedVacancy.diferencial}
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>

                {/* Modal de Edição/Criação */}
                <Modal
                    title={editingId ? 'Editar Vaga' : 'Nova Vaga'}
                    open={isModalVisible}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            Cancelar
                        </Button>,
                        <Button
                            key="submit"
                            type="primary"
                            onClick={handleSubmit}
                            className="bg-green-500 hover:bg-green-600"
                        >
                            Salvar
                        </Button>,
                    ]}
                    width={800}
                >
                    <Form form={form} layout="vertical" className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item
                                name="nome_vaga"
                                label="Nome da Vaga"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Por favor, selecione o nome da vaga',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Selecione um cargo"
                                    options={positions.map((position) => ({
                                        label: position,
                                        value: position,
                                    }))}
                                />
                            </Form.Item>

                            <Form.Item
                                name="departamento_vaga"
                                label="Departamento"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Por favor, selecione o departamento',
                                    },
                                ]}
                            >
                                <Select loading={departmentsLoading}>
                                    {departments && departments.length > 0 ? (
                                        departments.map((dept) => (
                                            <Select.Option
                                                key={dept}
                                                value={dept}
                                            >
                                                {dept}
                                            </Select.Option>
                                        ))
                                    ) : (
                                        <>
                                            <Select.Option value="TI">
                                                TI
                                            </Select.Option>
                                            <Select.Option value="RH">
                                                RH
                                            </Select.Option>
                                            <Select.Option value="Financeiro">
                                                Financeiro
                                            </Select.Option>
                                            <Select.Option value="Comercial">
                                                Comercial
                                            </Select.Option>
                                            <Select.Option value="Marketing">
                                                Marketing
                                            </Select.Option>
                                        </>
                                    )}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="limit_candidatos"
                                label="Limite de Candidatos"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Por favor, informe o limite de candidatos',
                                    },
                                ]}
                            >
                                <Input type="number" min={1} />
                            </Form.Item>

                            <Form.Item
                                name="isInternalSelection"
                                label="Tipo de Seleção"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Por favor, selecione o tipo de seleção',
                                    },
                                ]}
                            >
                                <Select>
                                    <Select.Option value={true}>
                                        Interna
                                    </Select.Option>
                                    <Select.Option value={false}>
                                        Externa
                                    </Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="data_range"
                                label="Período de Validade"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Por favor, selecione o período de validade',
                                    },
                                ]}
                            >
                                <DatePicker.RangePicker
                                    style={{ width: '100%' }}
                                    format="DD/MM/YYYY"
                                />
                            </Form.Item>
                        </div>
                        <Form.Item
                            name="requisitos"
                            label="Requisitos"
                            rules={[
                                {
                                    required: true,
                                    message: 'Por favor, informe os requisitos',
                                },
                            ]}
                        >
                            <Select
                                mode="tags"
                                style={{ width: '100%' }}
                                placeholder="Digite um requisito e pressione Enter"
                                tokenSeparators={[',', ';']}
                                tagRender={CustomTagRender}
                            />
                        </Form.Item>
                        <Form.Item
                            name="diferencial"
                            label="Diferenciais"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        'Por favor, informe os diferenciais',
                                },
                            ]}
                        >
                            <Select
                                mode="tags"
                                style={{ width: '100%' }}
                                placeholder="Digite um diferencial e pressione Enter"
                                tokenSeparators={[',', ';']}
                                tagRender={CustomTagRender}
                            />
                        </Form.Item>
                        <Form.Item
                            name="imagem_capa"
                            label="Imagem de Capa"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        'Por favor, faça upload de uma imagem de capa',
                                },
                            ]}
                        >
                            <AntdUpload
                                listType="picture-card"
                                fileList={fileList}
                                onChange={({ fileList }) =>
                                    setFileList(fileList)
                                }
                                beforeUpload={() => false}
                                maxCount={1}
                            >
                                {fileList.length < 1 && 'Upload'}
                            </AntdUpload>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </AuthGuard>
    );
}
