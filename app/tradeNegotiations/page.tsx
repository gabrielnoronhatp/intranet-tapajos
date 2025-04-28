'use client';
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import { Input, Select, Table, message, Tabs } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/hooks/store';
import {
    createNegotiationCampaign,
    fetchNegotiationCampaigns,
} from '@/hooks/slices/trade/tradeNegotiations';

const { TabPane } = Tabs;

export default function NegotiationsRegistration() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [tables, setTables] = useState([1]);
    const [contacts, setContacts] = useState<
        { nome: string; email: string; celular: string; key: number }[]
    >([]);
    const [contactInput, setContactInput] = useState({
        nome: '',
        email: '',
        celular: '',
    });

    // Estado para armazenar a aba ativa para cada tabela
    const [activeTabKeys, setActiveTabKeys] = useState<Record<number, string>>({});

    const [descricao, setDescricao] = useState('');
    const [dataInicial, setDataInicial] = useState('');
    const [dataFinal, setDataFinal] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { error } = useSelector(
        (state: RootState) => state.tradeNegotiations
    );

    useEffect(() => {
        dispatch(fetchNegotiationCampaigns());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            message.error(`Erro: ${error}`);
        }
    }, [error]);

    const addTable = () => {
        const newTableNumber = tables.length + 1;
        setTables([...tables, newTableNumber]);
        // Define a aba padrão para a nova tabela como 'loja'
        setActiveTabKeys(prev => ({
            ...prev,
            [newTableNumber]: 'loja'
        }));
    };

    // Função para alterar a aba ativa de uma tabela específica
    const handleTabChange = (tabNumber: number, activeKey: string) => {
        setActiveTabKeys(prev => ({
            ...prev,
            [tabNumber]: activeKey
        }));
    };

    const addContact = () => {
        if (!contactInput.nome) {
            message.error('Nome é obrigatório para adicionar um contato');
            return;
        }

        setContacts([...contacts, { ...contactInput, key: contacts.length }]);
        setContactInput({ nome: '', email: '', celular: '' });
    };

    // Função para salvar a negociação
    const handleSubmit = async () => {
        if (!descricao || !dataInicial || !dataFinal) {
            message.error('Por favor, preencha todos os campos obrigatórios');
            return;
        }

        try {
            setIsLoading(true);

            const dataInicialFormatted = dataInicial.includes('T')
                ? dataInicial.split('T')[0]
                : dataInicial;

            const dataFinalFormatted = dataFinal.includes('T')
                ? dataFinal.split('T')[0]
                : dataFinal;

            const negociationData = {
                descricao: descricao,
                data_inicial: dataInicialFormatted,
                data_final: dataFinalFormatted,
                usuario: user?.username || 'Usuário',
            };

            await dispatch(createNegotiationCampaign(negociationData)).unwrap();
            message.success('Negociação cadastrada com sucesso!');

            // Limpar os campos após salvar
            setDescricao('');
            setDataInicial('');
            setDataFinal('');
        } catch (error) {
            console.error('Erro ao salvar negociação:', error);
            message.error('Erro ao cadastrar negociação. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
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
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                            />
                            <div className="">
                                <h2 className="text-lg font-bold text-green-600">
                                    Período da Negociação
                                </h2>
                                <div className="flex gap-2">
                                    <Input
                                        type="date"
                                        className="flex-1"
                                        value={dataInicial}
                                        onChange={(e) =>
                                            setDataInicial(e.target.value)
                                        }
                                    />
                                    <Input
                                        type="date"
                                        className="flex-1"
                                        value={dataFinal}
                                        onChange={(e) =>
                                            setDataFinal(e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        {tables.map((tableNumber) => (
                            <div
                                key={tableNumber}
                                className="bg-white p-4 rounded shadow"
                            >
                                <h2 className="text-lg font-bold text-green-600 mb-3">
                                    Objeto da Campanha #{tableNumber}
                                </h2>
                                
                                <Tabs 
                                    activeKey={activeTabKeys[tableNumber] || 'loja'}
                                    onChange={(key) => handleTabChange(tableNumber, key)}
                                    className="mb-3"
                                >
                                    <TabPane tab="Loja" key="loja">
                                        <div className="flex gap-2 mb-2">
                                            <Select
                                                showSearch
                                                className="flex-1"
                                                placeholder="Buscar loja..."
                                            >
                                            </Select>
                                            <Button className="bg-green-500 hover:bg-green-600">
                                                Adicionar
                                            </Button>
                                        </div>
                                        <Table
                                            dataSource={[]}
                                            columns={[
                                                {
                                                    title: 'Nome da Loja',
                                                    dataIndex: 'nome',
                                                    key: 'nome',
                                                },
                                                { 
                                                    title: 'Código', 
                                                    dataIndex: 'codigo',
                                                    key: 'codigo' 
                                                },
                                                {
                                                    title: 'Meta',
                                                    dataIndex: 'meta',
                                                    key: 'meta',
                                                },
                                                {
                                                    title: 'Premiação',
                                                    dataIndex: 'premiacao',
                                                    key: 'premiacao',
                                                },
                                                { 
                                                    title: 'Ação', 
                                                    key: 'acao' 
                                                },
                                            ]}
                                            rowKey="id"
                                            pagination={false}
                                        />
                                    </TabPane>
                                    <TabPane tab="Produtos" key="produtos">
                                        <div className="flex gap-2 mb-2">
                                            <Select
                                                showSearch
                                                className="flex-1"
                                                placeholder="Buscar produto..."
                                            >
                                            </Select>
                                            <Button className="bg-green-500 hover:bg-green-600">
                                                Adicionar
                                            </Button>
                                        </div>
                                        <Table
                                            dataSource={[]}
                                            columns={[
                                                {
                                                    title: 'Produto',
                                                    dataIndex: 'nome',
                                                    key: 'nome',
                                                },
                                                { 
                                                    title: 'Código', 
                                                    dataIndex: 'codigo',
                                                    key: 'codigo' 
                                                },
                                                {
                                                    title: 'Quantidade',
                                                    dataIndex: 'quantidade',
                                                    key: 'quantidade',
                                                },
                                                {
                                                    title: 'Valor',
                                                    dataIndex: 'valor',
                                                    key: 'valor',
                                                },
                                                { 
                                                    title: 'Ação', 
                                                    key: 'acao' 
                                                },
                                            ]}
                                            rowKey="id"
                                            pagination={false}
                                        />
                                    </TabPane>
                                </Tabs>
                            </div>
                        ))}
                        <Button
                            onClick={addTable}
                            className="bg-blue-500 hover:bg-blue-600 mt-4"
                        >
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
                                    onChange={(e) =>
                                        setContactInput({
                                            ...contactInput,
                                            nome: e.target.value,
                                        })
                                    }
                                    className="flex-1"
                                />
                                <Input
                                    placeholder="Email"
                                    value={contactInput.email}
                                    onChange={(e) =>
                                        setContactInput({
                                            ...contactInput,
                                            email: e.target.value,
                                        })
                                    }
                                    className="flex-1"
                                />
                                <Input
                                    placeholder="Número de Celular"
                                    value={contactInput.celular}
                                    onChange={(e) =>
                                        setContactInput({
                                            ...contactInput,
                                            celular: e.target.value,
                                        })
                                    }
                                    className="flex-1"
                                />
                                <Button
                                    onClick={addContact}
                                    className="bg-green-500 hover:bg-green-600"
                                >
                                    Adicionar Contato
                                </Button>
                            </div>
                            <Table
                                dataSource={contacts}
                                columns={[
                                    {
                                        title: 'Nome',
                                        dataIndex: 'nome',
                                        key: 'nome',
                                    },
                                    {
                                        title: 'Email',
                                        dataIndex: 'email',
                                        key: 'email',
                                    },
                                    {
                                        title: 'Número de Celular',
                                        dataIndex: 'celular',
                                        key: 'celular',
                                    },
                                ]}
                                rowKey="key"
                                pagination={false}
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button
                                className="bg-green-500 hover:bg-green-600"
                                onClick={handleSubmit}
                                disabled={isLoading}
                            >
                                {isLoading
                                    ? 'Salvando...'
                                    : 'Salvar Negociação'}
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
