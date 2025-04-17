'use client';
import React, { useEffect, useState } from 'react';
import {
    Table as AntdTable,
    Modal,
    Input,
    DatePicker,
    Button,
    Space,
    Form,
    message,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/hooks/store';
import {
    deactivateCampaign,
    fetchCampaignById,
    fetchCampaigns,
    searchCampaigns,
    cloneCampaign,
} from '@/hooks/slices/trade/tradeSlice';
import { Eye, Edit, FileWarning, Search, Copy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useTokenRefresh from '@/hooks/useTokenRefresh';
import dayjs from 'dayjs';
import { MetaTableReadOnly } from './meta-table-readonly';
import { ICampaign} from '@/types/Trade/ICampaign'; 
import { IEscala } from '@/types/Trade/IEscala';
import { IParticipants } from '@/types/Trade/IParticipants';
import { IProduct } from '@/types/Trade/IProduct';


export function TableTrade() {
    const [clientSideReady] = useState(false);
    const [searchForm] = Form.useForm();
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const refreshToken = useTokenRefresh();

    useEffect(() => {
        const initializeData = async () => {
            await refreshToken();
            dispatch(fetchCampaigns());
        };

        initializeData();
    }, [dispatch, clientSideReady]);

    const handleSearch = (values: ICampaign) => {
        const searchParams: any = {};

        if (values.nome) {
            searchParams.nome = values.nome;
        }

        if (values.datainicial) {
            searchParams.datainicial = dayjs(values.datainicial).format(
                'DD/MM/YYYY'
            );
        }

        if (values.datafinal) {
            searchParams.datafinal = dayjs(values.datafinal).format(
                'DD/MM/YYYY'
            );
        }

        dispatch(searchCampaigns(searchParams));
    };

    const handleReset = () => {
        searchForm.resetFields();
        dispatch(fetchCampaigns());
    };

    const handleEditCampaign = (id: string | undefined) => {
        if (id) {
            router.push(`/trade/edit/${id}`);
        }
    };
    const { campaigns, currentCampaign } = useSelector(
        (state: RootState) => state.trade || {}
    );

    const sortedCampaigns = campaigns?.slice().sort((a: ICampaign, b: ICampaign) => {
        //order by id descending
        return b.id - a.id;
    });

    const handleViewCampaign = (id: string) => {
        dispatch(fetchCampaignById(id)).then(() => {
            const escalaData = currentCampaign?.escala || [];

            let metaGeralRange: any = [];
            let metaVendedorRange: any = [];
            let valoresMeta: any = [];

            if (escalaData.length > 0) {
                const primeiraLinha = escalaData.find(
                    (item: IEscala) => item.linha === ''
                );

                if (primeiraLinha) {
                    const usesCol = Object.keys(primeiraLinha).some(
                        (key) =>
                            key.startsWith('col') && !key.startsWith('coluna')
                    );
                    const columnPrefix = usesCol ? 'col' : 'coluna';

                    metaVendedorRange = Object.keys(primeiraLinha)
                        .filter((key) => key.startsWith(columnPrefix))
                        .map((key) => primeiraLinha[key]);
                }

                const outrasLinhas = escalaData.filter(
                    (item: IEscala) => item.linha !== ''
                );
                metaGeralRange = outrasLinhas.map((item: IEscala) => item.linha || '');

                valoresMeta = [];
                outrasLinhas.forEach((linha: IEscala, idxLinha: number) => {
                    metaVendedorRange.forEach((_: any, idxCol: number) => {
                        const usesCol = Object.keys(linha).some(
                            (key) =>
                                key.startsWith('col') &&
                                !key.startsWith('coluna')
                        );
                        const columnPrefix = usesCol ? 'col' : 'coluna';

                        const colKey = `${columnPrefix}${idxCol + 1}`;
                        if (linha[colKey] !== undefined) {
                            valoresMeta.push({
                                idMetaGeral: idxLinha + 1,
                                idMetaVendedor: idxCol + 1,
                                celValordaMeta: parseFloat(linha[colKey]),
                            });
                        }
                    });
                });
            }

            Modal.info({
                title: 'Detalhes da Campanha',
                content: (
                    <div>
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-green-600">
                                Campanha
                            </h3>
                            <p>
                                <strong>Nome:</strong>{' '}
                                {currentCampaign?.campanha?.nome}
                            </p>
                            <p>
                                <strong>Data Inicial:</strong>{' '}
                                {currentCampaign?.campanha?.datainicial}
                            </p>
                            <p>
                                <strong>Data Final:</strong>{' '}
                                {currentCampaign?.campanha?.datafinal}
                            </p>
                            <p>
                                <strong>Valor Total:</strong>{' '}
                                {currentCampaign?.campanha?.valor_total}
                            </p>
                            <p>
                                <strong>Usuário Lançamento:</strong>{' '}
                                {currentCampaign?.campanha?.userlanc}
                            </p>
                            <p>
                                <strong>Data Lançamento:</strong>{' '}
                                {currentCampaign?.campanha?.datalanc}
                            </p>
                            <p>
                                <strong>Status:</strong>{' '}
                                {currentCampaign?.campanha?.status
                                    ? 'Ativo'
                                    : 'Inativo'}
                            </p>
                        </div>

                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-green-600">
                                Participantes
                            </h3>
                            {currentCampaign?.participantes?.map(
                                (participante: IParticipants) => (
                                    <div
                                        key={participante.id}
                                        className="mb-3 pb-2 border-b"
                                    >
                                        <p>
                                            <strong>Nome:</strong>{' '}
                                            {participante.nome}
                                        </p>
                                        <p>
                                            <strong>Modelo:</strong>{' '}
                                            {participante.modelo}
                                        </p>
                                        <p>
                                            <strong>Meta:</strong>{' '}
                                            {participante.meta}
                                        </p>
                                        {participante.meta === 'QUANTIDADE' && (
                                            <p>
                                                <strong>
                                                    Meta Quantidade:
                                                </strong>{' '}
                                                {participante.meta_quantidade}
                                            </p>
                                        )}
                                        {participante.meta === 'VALOR' && (
                                            <p>
                                                <strong>Meta Valor:</strong>{' '}
                                                {participante.meta_valor}
                                            </p>
                                        )}
                                        <p>
                                            <strong>Premiação:</strong>{' '}
                                            {participante.premiacao}
                                        </p>
                                    </div>
                                )
                            )}
                        </div>

                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-green-600">
                                Itens
                            </h3>
                            {currentCampaign?.itens?.map((item: IProduct) => (
                                <div key={item.id} className="mb-2">
                                    <p>
                                        <strong>Nome:</strong> {item.nome}
                                    </p>
                                    <p>
                                        <strong>Métrica:</strong> {item.metrica}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Seção de Escala/Metas */}
                        {escalaData.length > 0 && (
                            <div className="mb-4">
                                <h3 className="text-lg font-bold text-green-600">
                                    Escala de Metas
                                </h3>
                                <div className="overflow-x-auto">
                                    {/* Versão somente leitura da tabela de metas */}
                                    <MetaTableReadOnly
                                        metaGeralRange={metaGeralRange}
                                        metaVendedorRange={metaVendedorRange}
                                        escala={{
                                            metaGeralRange,
                                            metaVendedorRange,
                                            valoresMeta,
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ),
                okButtonProps: {
                    style: {
                        backgroundColor: '#4CAF50',
                        borderColor: '#4CAF50',
                    },
                },
                width: 800,
            });
        });
    };

    const showDeleteConfirm = (id: string) => {
        const campaign = campaigns?.find((c: ICampaign) => c.id === id);
        if (campaign && campaign.status === 'false') {
            message.warning('Esta campanha já está desativada.');
            return;
        }

        Modal.confirm({
            title: 'Você tem certeza que deseja desativar esta campanha?',
            content: 'Esta ação não pode ser desfeita.',
            okText: 'Sim',
            okType: 'danger',
            cancelText: 'Não',
            onOk() {
                dispatch(deactivateCampaign(id)).then(() => {
                    message.success('Campanha desativada com sucesso!');
                    dispatch(fetchCampaigns());
                });
            },
            onCancel() {
                console.log('Cancelado');
            },
        });
    };

    const handleCloneCampaign = async (id: string) => {
        try {
            await dispatch(cloneCampaign(id)).unwrap();
            message.success('Campanha duplicada com sucesso!');
            dispatch(fetchCampaigns());
        } catch (error) {
            message.error('Erro ao duplicar campanha');
            console.error('Erro:', error);
        }
    };

    const columns = [
        { title: 'Nome', dataIndex: 'nome', key: 'nome' },
        { title: 'Data Inicial', dataIndex: 'datainicial', key: 'datainicial' },
        { title: 'Data Final', dataIndex: 'datafinal', key: 'datafinal' },
        { title: 'Valor Total', dataIndex: 'valor_total', key: 'valor_total' },
        { title: 'Usuário Lançamento', dataIndex: 'userlanc', key: 'userlanc' },
        { title: 'Data Lançamento', dataIndex: 'datalanc', key: 'datalanc' },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: boolean) => (status ? 'Ativo' : 'Inativo'),
        },
        {
            title: 'Ações',
            key: 'acoes',
            render: (record: ICampaign) => (
                <div className="flex items-center space-x-2">
                    {record?.status !== false && (
                        <>
                            <Eye
                                color="green"
                                onClick={() => handleViewCampaign(record?.id)}
                                className="cursor-pointer hover:scale-110 transition-transform"
                            />
                            <Edit
                                color="green"
                                onClick={() => handleEditCampaign(record.id)}
                                className="cursor-pointer hover:scale-110 transition-transform"
                            />
                            <Copy
                                color="#4CAF50"
                                onClick={() => handleCloneCampaign(record.id)}
                                className="cursor-pointer hover:scale-110 transition-transform"
                            />
                        </>
                    )}
                    <FileWarning
                        color="green"
                        onClick={() => showDeleteConfirm(record.id)}
                        className="cursor-pointer hover:scale-110 transition-transform"
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            <Form
                form={searchForm}
                layout="inline"
                onFinish={handleSearch}
                className="mb-4 p-4 bg-white rounded-md shadow-sm"
            >
                <Form.Item name="nome" className="mb-2 md:mb-0">
                    <Input placeholder="Nome da campanha" />
                </Form.Item>

                <Form.Item name="datainicial" className="mb-2 md:mb-0">
                    <DatePicker
                        placeholder="Data inicial"
                        format="DD/MM/YYYY"
                    />
                </Form.Item>

                <Form.Item name="datafinal" className="mb-2 md:mb-0">
                    <DatePicker placeholder="Data final" format="DD/MM/YYYY" />
                </Form.Item>

                <Form.Item className="mb-2 md:mb-0">
                    <Space>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{
                                backgroundColor: '#4CAF50',
                                borderColor: '#4CAF50',
                            }}
                            icon={<Search size={16} />}
                        >
                            Buscar
                        </Button>
                        <Button onClick={handleReset}>Limpar</Button>
                    </Space>
                </Form.Item>
            </Form>

            <div className="rounded-md border">
                <AntdTable
                    columns={columns}
                    dataSource={sortedCampaigns}
                    rowKey="id"
                    pagination={false}
                />
            </div>
        </div>
    );
}
