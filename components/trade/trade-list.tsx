'use client';
import React, { useEffect } from 'react';
import { Table as AntdTable, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/hooks/store';
import { ICampaign } from '@/types/Trade/ITrade';
import {
    deactivateCampaign,
    fetchCampaignById,
    fetchCampaigns,
} from '@/hooks/slices/trade/tradeSlice';
import { Eye, Edit, FileWarning } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useTokenRefresh from '@/hooks/useTokenRefresh';

interface TableTradeProps {
    data: Array<{
        nome: string;
        datainicial: string;
        datafinal: string;
        valor_total: number;
        userlanc: string;
        datalanc: string;
        status: boolean;
    }>;
}

export function TableTrade() {
 
    const dispatch = useDispatch();
    const router = useRouter();
    const refreshToken = useTokenRefresh();

    useEffect(() => {
        refreshToken();
        dispatch(fetchCampaigns() as any);
    }, [dispatch]);

    const handleEditCampaign = (id: string) => {
        router.push(`/trade/edit/${id}`);
    };
    const { campaigns = [], currentCampaign = null } = useSelector(
        (state: RootState) => state.trade || {}
    );

    const handleViewCampaign = (id: string) => {
        dispatch(fetchCampaignById(id) as any).then(() => {
            Modal.info({
                title: 'Detalhes da Campanha',
                content: (
                    <div>
                        <strong>Campanha</strong>
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
                            <strong>Status:</strong>{' '}
                            {currentCampaign?.campanha?.status
                                ? 'Ativo'
                                : 'Inativo'}
                        </p>

                        <strong>Participantes</strong>
                        {currentCampaign?.participantes?.map(
                            (participante: any) => (
                                <div key={participante.id}>
                                    <p>
                                        <strong>Modelo:</strong>{' '}
                                        {participante.modelo}
                                    </p>
                                    <p>
                                        <strong>Meta Quantidade:</strong>{' '}
                                        {participante.meta_quantidade}
                                    </p>
                                    <p>
                                        <strong>Meta Valor:</strong>{' '}
                                        {participante.meta_valor}
                                    </p>
                                    <p>
                                        <strong>Premiação:</strong>{' '}
                                        {participante.premiacao}
                                    </p>
                                </div>
                            )
                        )}

                        <strong>Itens</strong>
                        {currentCampaign?.itens?.map((item: any) => (
                            <div key={item.id}>
                                <p>
                                    <strong>Métrica:</strong> {item.metrica}
                                </p>
                            </div>
                        ))}
                    </div>
                ),
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
                                style={{ cursor: 'pointer', marginRight: 8 }}
                            />
                            <Edit
                                color="green"
                                onClick={() => handleEditCampaign(record.id)}
                                style={{ cursor: 'pointer', marginRight: 8 }}
                            />
                        </>
                    )}
                    <FileWarning
                        color="green"
                        onClick={() => showDeleteConfirm(record.id)}
                        style={{ cursor: 'pointer' }}
                    />
                </>
            ),
        },
    ];

    return (
        <div className="rounded-md border">
            <AntdTable
                columns={columns}
                dataSource={campaigns}
                rowKey="nome"
                pagination={false}
            />
        </div>
    );
}
