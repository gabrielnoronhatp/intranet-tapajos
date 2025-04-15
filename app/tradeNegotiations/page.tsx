'use client';
import React, { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import { Input, Select, Table } from 'antd';



export default function NegotiationsRegistration() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [tables, setTables] = useState([1]);
    const [contacts, setContacts] = useState<{ nome: string; email: string; celular: string; key: number }[]>([]);
    const [contactInput, setContactInput] = useState({ nome: '', email: '', celular: '' });

    const addTable = () => {
        setTables([...tables, tables.length + 1]);
    };

    const addContact = () => {
        setContacts([...contacts, { ...contactInput, key: contacts.length }]);
        setContactInput({ nome: '', email: '', celular: '' });
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <Sidebar isOpen={isSidebarOpen} />

            <main className="pt-16 transition-all duration-300 ml-20">
                <div className="p-4">
                    <h1 className="text-xl font-bold text-green-600 mb-4">
                        Cadastro de Negociações Trade Marketing
                    </h1>

                    <div className="max-w-3xl mx-auto space-y-4">
                        <div className="bg-white p-4 rounded shadow">
                            <h2 className="text-lg font-bold text-green-600">
                                Detalhes da Negociação
                            </h2>
                            <Input
                                placeholder="Nome da Negociação"
                                className="mb-2"
                            />
                            <div className="">
                                <h2 className="text-lg font-bold text-green-600">
                                    Período da Negociação
                                </h2>
                                <div className="flex gap-2">
                                    <Input type="date" className="flex-1" />
                                    <Input type="date" className="flex-1" />
                                </div>
                            </div>
                        </div>

                        {tables.map((tableNumber) => (
                            <div key={tableNumber} className="bg-white p-4 rounded shadow">
                                <h2 className="text-lg font-bold text-green-600">
                                    Objeto da Campanha #{tableNumber}
                                </h2>
                                <div className="flex gap-2 mb-2">
                                    <Select
                                        showSearch
                                        className="flex-1"
                                        placeholder="Buscar operador..."
                                    >
                                        {/* Options would be populated here */}
                                    </Select>
                                </div>
                                <Button className="bg-green-500 hover:bg-green-600">
                                    Adicionar
                                </Button>
                                <Table
                                    dataSource={[]}
                                    columns={[
                                        { title: 'Nome', dataIndex: 'nome', key: 'nome' },
                                        { title: 'Meta', key: 'meta' },
                                        { title: 'Premiação', dataIndex: 'premiacao', key: 'premiacao' },
                                        { title: 'Tipo', dataIndex: 'tipo', key: 'tipo' },
                                        { title: 'Ação', key: 'acao' },
                                    ]}
                                    rowKey="idparticipante"
                                    pagination={false}
                                />
                            </div>
                        ))}
                        <Button onClick={addTable} className="bg-blue-500 hover:bg-blue-600 mt-4">
                            Adicionar Nova Tabela
                        </Button>

                        {/* Tabela de Contatos */}
                        <div className="bg-white p-4 rounded shadow mt-4">
                            <h2 className="text-lg font-bold text-green-600">
                                Contatos
                            </h2>
                            <div className="flex gap-2 mb-2">
                                <Input
                                    placeholder="Nome"
                                    value={contactInput.nome}
                                    onChange={(e) => setContactInput({ ...contactInput, nome: e.target.value })}
                                    className="flex-1"
                                />
                                <Input
                                    placeholder="Email"
                                    value={contactInput.email}
                                    onChange={(e) => setContactInput({ ...contactInput, email: e.target.value })}
                                    className="flex-1"
                                />
                                <Input
                                    placeholder="Número de Celular"
                                    value={contactInput.celular}
                                    onChange={(e) => setContactInput({ ...contactInput, celular: e.target.value })}
                                    className="flex-1"
                                />
                                <Button onClick={addContact} className="bg-green-500 hover:bg-green-600">
                                    Adicionar Contato
                                </Button>
                            </div>
                            <Table
                                dataSource={contacts}
                                columns={[
                                    { title: 'Nome', dataIndex: 'nome', key: 'nome' },
                                    { title: 'Email', dataIndex: 'email', key: 'email' },
                                    { title: 'Número de Celular', dataIndex: 'celular', key: 'celular' },
                                ]}
                                rowKey="key"
                                pagination={false}
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button className="  bg-green-500 hover:bg-green-600">
                                Gerar
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
