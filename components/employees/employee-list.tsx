'use client';

import React, { useState } from 'react';
import { Table as AntdTable, Input } from 'antd';

interface Employee {
    nome: string;
    vaga: string;
    periodo: string;
    primeiraExperiencia: boolean;
    idade: number;
}

const initialData: Employee[] = [
    {
        nome: 'João Silva',
        vaga: 'Desenvolvedor',
        periodo: 'Integral',
        primeiraExperiencia: true,
        idade: 25,
    },
    {
        nome: 'Maria Oliveira',
        vaga: 'Designer',
        periodo: 'Parcial',
        primeiraExperiencia: false,
        idade: 30,
    },
];

export function EmployeeList() {
    const [data] = useState<Employee[]>(initialData);
    const [filters, setFilters] = useState({
        nome: '',
        vaga: '',
        periodo: '',
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const filteredData = data.filter((employee) =>
        Object.keys(filters).every((key) =>
            employee[key as keyof Employee]
                .toString()
                .toLowerCase()
                .includes(filters[key as keyof typeof filters].toLowerCase())
        )
    );

    const columns = [
        { title: 'Nome', dataIndex: 'nome', key: 'nome' },
        { title: 'Vaga', dataIndex: 'vaga', key: 'vaga' },
        { title: 'Período', dataIndex: 'periodo', key: 'periodo' },
        {
            title: 'Primeira Experiência',
            dataIndex: 'primeiraExperiencia',
            key: 'primeiraExperiencia',
            render: (text: boolean) => (text ? 'Sim' : 'Não'),
        },
        { title: 'Idade', dataIndex: 'idade', key: 'idade' },
    ];

    return (
        <div className="rounded-md border bg-card p-4">
            <div className="mb-4 grid grid-cols-3 gap-4">
                <Input
                    placeholder="Filtrar por Nome"
                    name="nome"
                    value={filters.nome}
                    onChange={handleFilterChange}
                />
                <Input
                    placeholder="Filtrar por Vaga"
                    name="vaga"
                    value={filters.vaga}
                    onChange={handleFilterChange}
                />
                <Input
                    placeholder="Filtrar por Período"
                    name="periodo"
                    value={filters.periodo}
                    onChange={handleFilterChange}
                />
            </div>
            <AntdTable
                columns={columns}
                dataSource={filteredData}
                rowKey="nome"
            />
        </div>
    );
}
