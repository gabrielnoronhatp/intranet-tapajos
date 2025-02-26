'use client';
import React from 'react';
import { Table as AntdTable } from 'antd';

interface TableTradeProps {
    data: Array<{
        nome: string;
        meta: string;
        premiacaoAcao: string;
    }>;
}

export function TableTrade({ data }: TableTradeProps) {
    const columns = [
        { title: 'Nome', dataIndex: 'nome', key: 'nome' },
        { title: 'Meta', dataIndex: 'meta', key: 'meta' },
        { title: 'Premiação Ação', dataIndex: 'premiacaoAcao', key: 'premiacaoAcao' },
    ];

    return (
        <div className="rounded-md border">
            <AntdTable
                columns={columns}
                dataSource={data}
                rowKey="nome"
                pagination={false}
            />
        </div>
    );
}