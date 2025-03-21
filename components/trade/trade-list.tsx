'use client';
import React, { useEffect, useState } from 'react';
import { Table as AntdTable, Modal, Input, DatePicker, Button, Space, Form } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/hooks/store';
import { ICampaign } from '@/types/Trade/ITrade';
import {
    deactivateCampaign,
    fetchCampaignById,
    fetchCampaigns,
    searchCampaigns,
} from '@/hooks/slices/trade/tradeSlice';
import { Eye, Edit, FileWarning, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useTokenRefresh from '@/hooks/useTokenRefresh';
import dayjs from 'dayjs';


export function TableTrade() {
    const [clientSideReady, setClientSideReady] = useState(false);
    const [searchForm] = Form.useForm();
    const dispatch = useDispatch();
    const router = useRouter();
    const refreshToken = useTokenRefresh();
    
    useEffect(() => {
        const initializeData = async () => {
            await refreshToken();
            dispatch(fetchCampaigns() as any);
        };
        
        initializeData();
    }, [dispatch, clientSideReady]);

    const handleSearch = (values: any) => {
        const searchParams: any = {};
        
        if (values.nome) {
            searchParams.nome = values.nome;
        }
        
        if (values.datainicial) {
            searchParams.datainicial = dayjs(values.datainicial).format('DD/MM/YYYY');
        }
        
        if (values.datafinal) {
            searchParams.datafinal = dayjs(values.datafinal).format('DD/MM/YYYY');
        }
        
        dispatch(searchCampaigns(searchParams) as any);
    };

    const handleReset = () => {
        searchForm.resetFields();
        dispatch(fetchCampaigns() as any);
    };

    const handleEditCampaign = (id: string) => {
        router.push(`/trade/edit/${id}`);
    };
    const { campaigns , currentCampaign } = useSelector(
        (state: RootState) => state.trade || {}
    );

    const handleViewCampaign = (id: string) => {
        dispatch(fetchCampaignById(id) as any).then(() => {
            Modal.info({
                title: 'Detalhes da Campanha',
                content: (
                    <div>
                        <div className="mb-4">
                            <h3 className="text-lg font-bold mb-2">Campanha</h3>
                            <p><strong>Nome:</strong> {currentCampaign?.campanha?.nome}</p>
                            <p><strong>Data Inicial:</strong> {currentCampaign?.campanha?.datainicial}</p>
                            <p><strong>Data Final:</strong> {currentCampaign?.campanha?.datafinal}</p>
                            <p><strong>Valor Total:</strong> {currentCampaign?.campanha?.valor_total}</p>
                            <p><strong>Usuário Lançamento:</strong> {currentCampaign?.campanha?.userlanc}</p>
                            <p><strong>Data Lançamento:</strong> {currentCampaign?.campanha?.datalanc}</p>
                            <p><strong>Status:</strong> {currentCampaign?.campanha?.status ? 'Ativo' : 'Inativo'}</p>
                        </div>

                        <div className="mb-4">
                            <h3 className="text-lg font-bold mb-2">Participantes</h3>
                            {currentCampaign?.participantes?.map((participante: any) => (
                                <div key={participante.id} className="mb-3 pb-2 border-b">
                                    <p><strong>Nome:</strong> {participante.nome}</p>
                                    <p><strong>Modelo:</strong> {participante.modelo}</p>
                                    <p><strong>Meta:</strong> {participante.meta}</p>
                                    <p><strong>Meta Quantidade:</strong> {participante.meta_quantidade}</p>
                                    <p><strong>Meta Valor:</strong> {participante.meta_valor}</p>
                                    <p><strong>Premiação:</strong> {participante.premiacao}</p>
                                </div>
                            ))}
                        </div>

                        <div>
                            <h3 className="text-lg font-bold mb-2">Itens</h3>
                            {currentCampaign?.itens?.map((item: any) => (
                                <div key={item.id} className="mb-2">
                                    <p><strong>Nome:</strong> {item.nome}</p>
                                    <p><strong>Métrica:</strong> {item.metrica}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ),
                okButtonProps: {
                    style: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' }
                },
                width: 600
            });
        });
    };

    const showDeleteConfirm = (id: string) => {
        Modal.confirm({
            title: 'Você tem certeza que deseja desativar esta campanha?',
            content: 'Esta ação não pode ser desfeita.',
            okText: 'Sim',
            okType: 'danger',
            cancelText: 'Não',
            onOk() {
                dispatch(deactivateCampaign(id) as any);
            },
            onCancel() {
                console.log('Cancelado');
            },
        });
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
            render: (record: any) => (
                <>
                    {record.status !== false && (
                        <>
                            <Eye
                                color="green"
                                onClick={() => handleViewCampaign(record.id)}
                                style={{ 
                                    cursor: 'pointer', 
                                    marginRight: 8,
                                    transition: 'transform 0.2s',
                                    
                                }}
                                className="hover:scale-110"
                            />
                            <Edit
                                color="green"
                                onClick={() => handleEditCampaign(record.id)}
                                style={{ 
                                    cursor: 'pointer', 
                                    marginRight: 8,
                                    transition: 'transform 0.2s'
                                }}
                                className="hover:scale-110"
                            />
                        </>
                    )}
                    <FileWarning
                        color="green"
                        onClick={() => showDeleteConfirm(record.id)}
                        style={{ 
                            cursor: 'pointer',
                            transition: 'transform 0.2s'
                        }}
                        className="hover:scale-110"
                    />
                </>
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
                    <DatePicker 
                        placeholder="Data final" 
                        format="DD/MM/YYYY"
                    />
                </Form.Item>
                
                <Form.Item className="mb-2 md:mb-0">
                    <Space>
                        <Button 
                            type="primary" 
                            htmlType="submit"
                            style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50' }}
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
                    dataSource={campaigns}
                    rowKey="nome"
                    pagination={false}
                />
            </div>
        </div>
    );
}
