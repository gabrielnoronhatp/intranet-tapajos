'use client';
import React, { useEffect, useState } from 'react';
import {
    Table as AntdTable,
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
    fetchNegotiationCampaigns,
    searchNegotiationCampaigns,
    deleteNegotiationCampaign,
    INegotiationCampaign,
} from '@/hooks/slices/trade/tradeNegotiationsSlice';
import { Eye, Edit, Trash2, Search, Copy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useTokenRefresh from '@/hooks/useTokenRefresh';
import dayjs from 'dayjs';
import { FloatingActionButton } from '../nopaper/floating-action-button';

export function TableTradeNegotiations() {
    const [clientSideReady] = useState(false);
    const [searchForm] = Form.useForm();
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const refreshToken = useTokenRefresh();

    const {
        campaigns = [],
        loading,
        error,
    } = useSelector(
        (state: RootState) => state.tradeNegotiations || { campaigns: [] }
    );

    useEffect(() => {
        const initializeData = async () => {
            await refreshToken();
            dispatch(fetchNegotiationCampaigns());
        };

        initializeData();
    }, [dispatch, clientSideReady]);

    useEffect(() => {
        if (error) {
            message.error(`Erro ao carregar negociações: ${error}`);
        }
    }, [error]);

    const handleSearch = (values: any) => {
        const searchParams: any = {};

        if (values.descricao) {
            searchParams.descricao = values.descricao;
        }

        if (values.data_inicial) {
            searchParams.data_inicial = dayjs(values.data_inicial).format(
                'YYYY-MM-DD'
            );
        }

        if (values.data_final) {
            searchParams.data_final = dayjs(values.data_final).format(
                'YYYY-MM-DD'
            );
        }

        dispatch(searchNegotiationCampaigns(searchParams));
    };

    const handleReset = () => {
        searchForm.resetFields();
        dispatch(fetchNegotiationCampaigns());
    };

    const handleViewNegotiation = (id: number) => {
        router.push(`/trade/negotiations/view/${id}`);
    };

    const handleEditNegotiation = (id: number) => {
        router.push(`/trade/negotiations/edit/${id}`);
    };

    const handleDeleteNegotiation = (id: number) => {
        dispatch(deleteNegotiationCampaign(id))
            .unwrap()
            .then(() => {
                message.success('Negociação excluída com sucesso');
                dispatch(fetchNegotiationCampaigns());
            })
            .catch((err) => {
                message.error(`Erro ao excluir negociação: ${err}`);
            });
    };

    const handleDuplicateNegotiation = (record: INegotiationCampaign) => {
        message.info('Funcionalidade de duplicação será implementada em breve');
        console.log('Duplicando negociação:', record.id, record.descricao);
    };

    const sortedCampaigns = Array.isArray(campaigns)
        ? [...campaigns].sort((a, b) => {
              if (!a?.id || !b?.id) return 0;
              return b.id - a.id;
          })
        : [];

    const columns = [
        {
            title: 'Descrição',
            dataIndex: 'descricao',
            key: 'descricao',
            sorter: (a: INegotiationCampaign, b: INegotiationCampaign) =>
                (a.descricao || '').localeCompare(b.descricao || ''),
        },
        {
            title: 'Data Inicial',
            dataIndex: 'data_inicial',
            key: 'data_inicial',
            render: (date: string) =>
                date ? dayjs(date).format('DD/MM/YYYY') : '-',
            sorter: (a: INegotiationCampaign, b: INegotiationCampaign) => {
                if (!a.data_inicial || !b.data_inicial) return 0;
                return (
                    dayjs(a.data_inicial).unix() - dayjs(b.data_inicial).unix()
                );
            },
        },
        {
            title: 'Data Final',
            dataIndex: 'data_final',
            key: 'data_final',
            render: (date: string) =>
                date ? dayjs(date).format('DD/MM/YYYY') : '-',
            sorter: (a: INegotiationCampaign, b: INegotiationCampaign) => {
                if (!a.data_final || !b.data_final) return 0;
                return dayjs(a.data_final).unix() - dayjs(b.data_final).unix();
            },
        },
        {
            title: 'Usuário',
            dataIndex: 'usuario',
            key: 'usuario',
        },
        {
            title: 'Última Atualização',
            dataIndex: 'last_update',
            key: 'last_update',
            render: (date: string) =>
                date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '-',
            sorter: (a: INegotiationCampaign, b: INegotiationCampaign) => {
                if (!a.last_update || !b.last_update) return 0;
                return (
                    dayjs(a.last_update).unix() - dayjs(b.last_update).unix()
                );
            },
        },
        {
            title: 'Ações',
            key: 'acoes',
            render: (record: INegotiationCampaign) => (
                <div className="flex items-center space-x-2">
                    <Eye
                        color="#11833b"
                        onClick={() => handleViewNegotiation(record.id)}
                        className="cursor-pointer hover:scale-110 transition-transform"
                        size={18}
                    />
                    <Edit
                        color="#11833b"
                        onClick={() => handleEditNegotiation(record.id)}
                        className="cursor-pointer hover:scale-110 transition-transform"
                        size={18}
                    />
                    <Copy
                        color="#11833b"
                        onClick={() => handleDuplicateNegotiation(record)}
                        className="cursor-pointer hover:scale-110 transition-transform"
                        size={18}
                    />
                    <Trash2
                        color="#ff4d4f"
                        onClick={() => handleDeleteNegotiation(record.id)}
                        className="cursor-pointer hover:scale-110 transition-transform"
                        size={18}
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
                <Form.Item name="descricao" className="mb-2 md:mb-0">
                    <Input placeholder="Descrição da negociação" />
                </Form.Item>

                <Form.Item name="data_inicial" className="mb-2 md:mb-0">
                    <DatePicker
                        placeholder="Data inicial"
                        format="DD/MM/YYYY"
                    />
                </Form.Item>

                <Form.Item name="data_final" className="mb-2 md:mb-0">
                    <DatePicker placeholder="Data final" format="DD/MM/YYYY" />
                </Form.Item>

                <Form.Item className="mb-2 md:mb-0">
                    <Space>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{
                                backgroundColor: '#11833b',
                                borderColor: '#11833b',
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
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showTotal: (total) => `Total de ${total} registros`,
                    }}
                    locale={{
                        emptyText: 'Nenhuma negociação encontrada',
                    }}
                />
                <FloatingActionButton href="/tradeNegotiations" />
            </div>
        </div>
    );
}
