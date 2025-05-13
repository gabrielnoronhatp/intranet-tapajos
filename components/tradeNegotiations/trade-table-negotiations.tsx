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
    Modal,
    Spin,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/hooks/store';
import {
    fetchNegotiationCampaigns,
    searchNegotiationCampaigns,
    deleteNegotiationCampaign,
    INegotiationCampaign,
    fetchNegotiationById,
    fetchNegotiationItems,
    fetchNegotiationEmpresas,
    fetchNegotiationProdutos,
} from '@/hooks/slices/trade/tradeNegotiationsSlice';
import { Eye, Edit, Trash2, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useTokenRefresh from '@/hooks/useTokenRefresh';
import dayjs from 'dayjs';
import { FloatingActionButton } from '../nopaper/floating-action-button';
import axios from 'axios';

export function TableTradeNegotiations() {
    const [clientSideReady] = useState(false);
    const [searchForm] = Form.useForm();
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const refreshToken = useTokenRefresh();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [negociacaoDetalhe, setNegociacaoDetalhe] = useState<any>(null);
    const [negociacaoIdDetalhe, setNegociacaoIdDetalhe] = useState<
        number | null
    >(null);
    const [campaignsFiltered, setCampaignsFiltered] = useState<any[]>([]);

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

 

    const handleSearch = (values: any) => {
        if (!values.descricao && !values.data_inicial && !values.data_final) {
            dispatch(fetchNegotiationCampaigns());
            return;
        }

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

        console.log('Enviando parâmetros de busca:', searchParams);

        dispatch(searchNegotiationCampaigns(searchParams))
            .unwrap()
            .then((result) => {
                console.log('Resultado da busca:', result);
                if (!result || (Array.isArray(result) && result.length === 0)) {
                    message.info(
                        'Nenhuma negociação encontrada com os filtros aplicados'
                    );
                }
            })
            .catch((error) => {
                console.error('Erro ao buscar com parâmetros:', error);
              
                filtrarNegociacoesLocalmente(searchParams);
            });
    };

    const filtrarNegociacoesLocalmente = (searchParams: any) => {
        dispatch(fetchNegotiationCampaigns())
            .unwrap()
            .then((allCampaigns) => {
                if (!Array.isArray(allCampaigns)) {
                    message.error(
                        'Erro ao carregar negociações para filtro local'
                    );
                    return;
                }

                let resultadosFiltrados = [...allCampaigns];

                if (searchParams.descricao) {
                    const termoBusca = searchParams.descricao.toLowerCase();
                    resultadosFiltrados = resultadosFiltrados.filter(
                        (campaign) =>
                            campaign.descricao &&
                            campaign.descricao
                                .toLowerCase()
                                .includes(termoBusca)
                    );
                }

                // Filtro por data inicial - negociações com data_inicial >= data filtro
                if (searchParams.data_inicial) {
                    const dataInicialFiltro = dayjs(
                        searchParams.data_inicial
                    ).startOf('day');
                    resultadosFiltrados = resultadosFiltrados.filter(
                        (campaign) => {
                            if (!campaign.data_inicial) return false;
                            const dataCampanha = dayjs(
                                campaign.data_inicial
                            ).startOf('day');
                            return (
                                dataCampanha.isAfter(dataInicialFiltro) ||
                                dataCampanha.isSame(dataInicialFiltro)
                            );
                        }
                    );
                }

                // Filtro por data final - negociações com data_final <= data filtro
                if (searchParams.data_final) {
                    const dataFinalFiltro = dayjs(
                        searchParams.data_final
                    ).endOf('day');
                    resultadosFiltrados = resultadosFiltrados.filter(
                        (campaign) => {
                            if (!campaign.data_final) return false;
                            const dataCampanha = dayjs(
                                campaign.data_final
                            ).startOf('day');
                            return (
                                dataCampanha.isBefore(dataFinalFiltro) ||
                                dataCampanha.isSame(dataFinalFiltro)
                            );
                        }
                    );
                }

                console.log('Resultados filtrados:', resultadosFiltrados);
                atualizarResultadosBusca(resultadosFiltrados);
            });
    };

    const atualizarResultadosBusca = (resultados: any[]) => {
        if (resultados.length === 0) {
            message.info(
                'Nenhuma negociação encontrada com os filtros aplicados'
            );
        }

        setCampaignsFiltered(resultados);
    };

    const handleReset = () => {
        searchForm.resetFields();
        setCampaignsFiltered([]);
        dispatch(fetchNegotiationCampaigns());
    };

    const handleViewNegotiation = async (id: number) => {
        setModalVisible(true);
        setModalLoading(true);
        setNegociacaoIdDetalhe(id);
        try {
            const [negociacao, itens, empresas, produtos] = await Promise.all([
                dispatch(fetchNegotiationById(id)).unwrap(),
                dispatch(fetchNegotiationItems(id)).unwrap(),
                dispatch(fetchNegotiationEmpresas(id)).unwrap(),
                dispatch(fetchNegotiationProdutos(id)).unwrap(),
            ]);

            // Garantir que todos os dados são arrays
            const itensArray = Array.isArray(itens)
                ? itens
                : itens
                  ? [itens]
                  : [];
            const empresasArray = Array.isArray(empresas)
                ? empresas
                : empresas
                  ? [empresas]
                  : [];
            const produtosArray = Array.isArray(produtos)
                ? produtos
                : produtos
                  ? [produtos]
                  : [];

            // Organizar os itens com suas empresas e produtos correspondentes
            const itensComDetalhes = itensArray.map((item) => {
                return {
                    ...item,
                    empresas: empresasArray.filter(
                        (empresa) => empresa.id_item === item.id
                    ),
                    produtos: produtosArray.filter(
                        (produto) => produto.id_item === item.id
                    ),
                };
            });

            setNegociacaoDetalhe({
                negociacao,
                itens: itensComDetalhes,
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                message.error(
                    error.response?.data?.message ||
                        'Erro ao buscar detalhes da negociação'
                );
            } else {
                message.error('Erro ao buscar detalhes da negociação');
            }
            console.error('Erro completo:', error);
        } finally {
            setModalLoading(false);
        }
    };

    const handleEditNegotiation = (id: number) => {
        router.push(`/tradeNegotiations/edit/${id}`);
    };

    const handleDeleteNegotiation = (id: number) => {
        dispatch(deleteNegotiationCampaign(id))
            .unwrap()
            .then(() => {
                message.success('Negociação excluída com sucesso');
                dispatch(fetchNegotiationCampaigns());
            })
            .catch((err: unknown) => {
                if (axios.isAxiosError(err)) {
                    message.error(
                        err.response?.data?.message ||
                            'Erro ao excluir negociação'
                    );
                } else {
                    message.error('Erro ao excluir negociação');
                }
            });
    };

    const sortedCampaigns = Array.isArray(
        campaignsFiltered.length > 0 ? campaignsFiltered : campaigns
    )
        ? [
              ...(campaignsFiltered.length > 0 ? campaignsFiltered : campaigns),
          ].sort((a, b) => {
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
                        onClick={() => handleViewNegotiation(record.id || 0)}
                        className="cursor-pointer hover:scale-110 transition-transform"
                        size={18}
                    />
                    <Edit
                        color="#11833b"
                        onClick={() => handleEditNegotiation(record.id || 0)}
                        className="cursor-pointer hover:scale-110 transition-transform"
                        size={18}
                    />

                    <Trash2
                        color="#ff4d4f"
                        onClick={() => handleDeleteNegotiation(record.id || 0)}
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
                    <Input
                        placeholder="Descrição da negociação"
                        allowClear
                        onChange={() => {
                            if (campaignsFiltered.length > 0) {
                                // Limpar filtros se o campo for esvaziado
                                if (!searchForm.getFieldValue('descricao')) {
                                    handleReset();
                                }
                            }
                        }}
                    />
                </Form.Item>

                <Form.Item name="data_inicial" className="mb-2 md:mb-0">
                    <DatePicker
                        placeholder="Data inicial"
                        format="DD/MM/YYYY"
                        allowClear
                        onChange={(date) => {
                            console.log(
                                'Data inicial selecionada:',
                                date ? date.format('YYYY-MM-DD') : null
                            );
                            if (campaignsFiltered.length > 0 && !date) {
                                handleReset();
                            }
                        }}
                    />
                </Form.Item>

                <Form.Item name="data_final" className="mb-2 md:mb-0">
                    <DatePicker
                        placeholder="Data final"
                        format="DD/MM/YYYY"
                        allowClear
                        onChange={(date) => {
                            console.log(
                                'Data final selecionada:',
                                date ? date.format('YYYY-MM-DD') : null
                            );
                            if (campaignsFiltered.length > 0 && !date) {
                                handleReset();
                            }
                        }}
                    />
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
                        <Button
                            onClick={handleReset}
                            type={
                                campaignsFiltered.length > 0
                                    ? 'primary'
                                    : 'default'
                            }
                            danger={campaignsFiltered.length > 0}
                        >
                            Limpar Filtros
                        </Button>
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

            <Modal
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={900}
                title="Detalhes da Negociação"
            >
                {modalLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <Spin size="large" />
                    </div>
                ) : negociacaoDetalhe ? (
                    <div>
                        <h2 className="text-lg font-bold mb-2 text-green-700">
                            {negociacaoDetalhe.negociacao?.descricao}
                        </h2>
                        <div className="mb-2">
                            <b>Período:</b>{' '}
                            {negociacaoDetalhe.negociacao?.data_inicial
                                ? dayjs(
                                      negociacaoDetalhe.negociacao.data_inicial
                                  ).format('DD/MM/YYYY')
                                : '-'}{' '}
                            até{' '}
                            {negociacaoDetalhe.negociacao?.data_final
                                ? dayjs(
                                      negociacaoDetalhe.negociacao.data_final
                                  ).format('DD/MM/YYYY')
                                : '-'}
                        </div>
                        <div className="mb-2">
                            <b>Usuário:</b>{' '}
                            {negociacaoDetalhe.negociacao?.usuario || '-'}
                        </div>

                        <div className="mt-4">
                            <h3 className="text-md font-bold mb-2 text-green-600">
                                Itens da Negociação
                            </h3>
                            {negociacaoDetalhe.itens &&
                            negociacaoDetalhe.itens.length > 0 ? (
                                negociacaoDetalhe.itens.map((item: any) => (
                                    <div
                                        key={item.id}
                                        className="mb-4 border-b pb-3"
                                    >
                                        <h4 className="font-semibold">
                                            {item.descricao} (ID: {item.id})
                                        </h4>

                                        <div className="mt-2">
                                            <h5 className="font-medium">
                                                Empresas:
                                            </h5>
                                            {item.empresas &&
                                            item.empresas.length > 0 ? (
                                                <AntdTable
                                                    dataSource={item.empresas}
                                                    columns={[
                                                        {
                                                            title: 'ID',
                                                            dataIndex: 'id',
                                                            key: 'id',
                                                        },
                                                        {
                                                            title: 'Descrição',
                                                            dataIndex:
                                                                'descricao',
                                                            key: 'descricao',
                                                        },
                                                        {
                                                            title: 'Código',
                                                            dataIndex:
                                                                'id_empresa',
                                                            key: 'id_empresa',
                                                        },
                                                    ]}
                                                    size="small"
                                                    pagination={false}
                                                    rowKey="id"
                                                    className="mb-3"
                                                />
                                            ) : (
                                                <p className="text-gray-500">
                                                    Nenhuma empresa vinculada
                                                </p>
                                            )}
                                        </div>

                                        <div className="mt-2">
                                            <h5 className="font-medium">
                                                Produtos:
                                            </h5>
                                            {item.produtos &&
                                            item.produtos.length > 0 ? (
                                                <AntdTable
                                                    dataSource={item.produtos}
                                                    columns={[
                                                        {
                                                            title: 'ID',
                                                            dataIndex: 'id',
                                                            key: 'id',
                                                        },
                                                        {
                                                            title: 'Descrição',
                                                            dataIndex:
                                                                'descricao',
                                                            key: 'descricao',
                                                        },
                                                        {
                                                            title: 'Código',
                                                            dataIndex:
                                                                'id_produto',
                                                            key: 'id_produto',
                                                        },
                                                        {
                                                            title: 'Unidades',
                                                            dataIndex:
                                                                'unidades',
                                                            key: 'unidades',
                                                        },
                                                    ]}
                                                    size="small"
                                                    pagination={false}
                                                    rowKey="id"
                                                    className="mb-3"
                                                />
                                            ) : (
                                                <p className="text-gray-500">
                                                    Nenhum produto vinculado
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">
                                    Nenhum item encontrado
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div>Não foi possível carregar os detalhes.</div>
                )}
            </Modal>
        </div>
    );
}
