'use client';
import React, { useState } from 'react';
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
    import { Button } from "@/components/ui/button";
    import { Input, Select, Table, message, Radio} from 'antd';

const { Option } = Select;

export default function CampaignRegistration() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [operadores, setOperadores] = useState<Array<{ nome: string, meta: string, premiacao: string, tipo: string }>>([]);
    const [marcaProdutos, setMarcaProdutos] = useState<Array<{ nome: string }>>([]);
    const [tipoOperador, setTipoOperador] = useState('teleoperador');

    const handleAddOperador = (nome: string, meta: string, premiacao: string) => {
        if (nome && meta && premiacao) {
            setOperadores([...operadores, { nome, meta, premiacao, tipo: tipoOperador }]);
        } else {
            message.error("Preencha todos os campos antes de adicionar!");
        }
    };

    const handleAddMarcaProduto = (nome: string) => {
        if (nome) {
            setMarcaProdutos([...marcaProdutos, { nome }]);
        } else {
            message.error("Preencha o nome antes de adicionar!");
        }
    };

    const handleRemoveOperador = (index: number) => {
        setOperadores(operadores.filter((_, i) => i !== index));
    };

    const handleRemoveMarcaProduto = (index: number) => {
        setMarcaProdutos(marcaProdutos.filter((_, i) => i !== index));
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <Sidebar isOpen={isSidebarOpen} />

            <main className={`pt-16 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
                <div className="p-4">
                    <h1 className="text-xl font-bold text-green-600 mb-4">Cadastro de Campanhas Trade Marketing</h1>

                    <div className="max-w-3xl mx-auto space-y-4">
                        <div className="bg-white p-4 rounded shadow">
                            <h2 className="text-lg font-bold text-green-600">Detalhes da Campanha</h2>
                            <Input placeholder="Nome da Campanha" className="mb-2" />
                            <Select placeholder="Filial" className="w-full mb-2">
                                <Option value="0001-CD Manaus">0001-CD Manaus</Option>
                                <Option value="0003-CD Porto Velho">0003-CD Porto Velho</Option>
                                <Option value="0004-CD Belém">0004-CD Belém</Option>
                                <Option value="0008-CD Boa Vista">0008-CD Boa Vista</Option>
                            </Select>
                        </div>

                        <div className="bg-white p-4 rounded shadow">
                            <h2 className="text-lg font-bold text-green-600">Adicionar Teleoperador/Vendedor</h2>
                            <div className="flex gap-2 mb-2">
                                <Radio.Group
                                    value={tipoOperador}
                                    onChange={(e) => setTipoOperador(e.target.value)}
                                    className="flex space-x-4"
                                >
                                    <Radio value="teleoperador" id="teleoperador" />
                                    <label htmlFor="teleoperador" className="text-sm">
                                        Teleoperador
                                    </label>
                                    <Radio value="vendedor" id="vendedor" />
                                    <label htmlFor="vendedor" className="text-sm">
                                        Vendedor
                                    </label>
                                </Radio.Group>
                            </div>
                            <div className="flex gap-2 mb-2">
                                <Input placeholder="Nome" className="flex-1" />
                                <Input placeholder="Meta" className="flex-1" />
                                <Input placeholder="Premiação" className="flex-1" />
                                <Button className="bg-green-500 hover:bg-green-600" onClick={() => handleAddOperador("Nome", "Meta", "Premiação")}>Adicionar</Button>
                            </div>
                            <Table dataSource={operadores} columns={[
                                { title: 'Nome', dataIndex: 'nome', key: 'nome' },
                                { title: 'Meta', dataIndex: 'meta', key: 'meta' },
                                { title: 'Premiação', dataIndex: 'premiacao', key: 'premiacao' },
                                { title: 'Tipo', dataIndex: 'tipo', key: 'tipo' },
                                {
                                    title: 'Ação', key: 'acao', render: (_, __, index) => (
                                        <Button className="bg-red-500 hover:bg-red-600" onClick={() => handleRemoveOperador(index)}>Remover</Button>
                                    )
                                }
                            ]} rowKey="nome" pagination={false} />
                        </div>

                        <div className="bg-white p-4 rounded shadow">
                            <h2 className="text-lg font-bold text-green-600">Adicionar Marca/Produto</h2>
                            <div className="flex gap-2 mb-2">
                                <Input placeholder="Nome" className="flex-1" />
                                <Button className="bg-green-500 hover:bg-green-600" onClick={() => handleAddMarcaProduto("Nome")}>Adicionar</Button>
                            </div>
                            <Table dataSource={marcaProdutos} columns={[
                                { title: 'Nome', dataIndex: 'nome', key: 'nome' },
                                {
                                    title: 'Ação', key: 'acao', render: (_, __, index) => (
                                        <Button className="bg-red-500 hover:bg-red-600" onClick={() => handleRemoveMarcaProduto(index)}>Remover</Button>
                                    )
                                }
                            ]} rowKey="nome" pagination={false} />
                        </div>

                        <div className="bg-white p-4 rounded shadow">
                            <h2 className="text-lg font-bold text-green-600">Período da Campanha</h2>
                            <div className="flex gap-2">
                                <Input type="date" className="flex-1" />
                                <Input type="date" className="flex-1" />
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded shadow">
                            <h2 className="text-lg font-bold text-green-600">Valor da Meta Geral</h2>
                            <Input placeholder="Meta Geral" />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <Button className="bg-green-500 hover:bg-green-600">Salvar Campanha</Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
