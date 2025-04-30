'use client';
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import {
    Input,
    Select,
    Table,
    message,
    Tabs,
    Modal,
    Form,
    InputNumber,
    Button as AntButton,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/hooks/store';
import {
    createNegotiationCampaign,
    fetchNegotiationCampaigns,
    createNegotiationItem,
    createNegotiationEmpresa,
    createNegotiationProduto,
    fetchFiliais,
    fetchProdutos,
    addEmpresaLocal,
    removeEmpresaLocal,
    addProdutoLocal,
    removeProdutoLocal,
    resetLocalData,
} from '@/hooks/slices/trade/tradeNegotiationsSlice';
import {
    INegociacaoEmpresa,
    INegociacaoProduto,
    IFilial,
    IProduto,
} from '@/types/Trade/TradeNegotiations/ITradeNegotiations';
import { DeleteOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

export default function NegotiationsRegistration() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [tables, setTables] = useState<{ id: number; descricao: string }[]>(
        []
    );
    const [nextTableId, setNextTableId] = useState(1);
    const [contacts, setContacts] = useState<
        { nome: string; email: string; celular: string; key: number }[]
    >([]);
    const [contactInput, setContactInput] = useState({
        nome: '',
        email: '',
        celular: '',
    });

    const [activeTabKeys, setActiveTabKeys] = useState<Record<number, string>>(
        {}
    );
    const [itemDescricao, setItemDescricao] = useState('');
    const [isItemModalVisible, setIsItemModalVisible] = useState(false);

    // Estados para loja selecionada
    const [selectedLoja, setSelectedLoja] = useState<IFilial | null>(null);
    const [lojaInput, setLojaInput] = useState({
        meta: 0,
        premiacao: '',
    });

    // Estados para produto selecionado
    const [selectedProduto, setSelectedProduto] = useState<IProduto | null>(
        null
    );
    const [produtoInput, setProdutoInput] = useState({
        unidades: 0,
        valor: 0,
    });

    const [descricao, setDescricao] = useState('');
    const [dataInicial, setDataInicial] = useState('');
    const [dataFinal, setDataFinal] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [negociacaoId, setNegociacaoId] = useState<number | null>(null);

    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const {
        error,
        filiais = [],
        produtosCatalogo = [],
        empresas = [],
        produtos = [],
    } = useSelector((state: RootState) => state.tradeNegotiations);

    const filiaisArray = Array.isArray(filiais) ? filiais : [];
    const produtosCatalogoArray = Array.isArray(produtosCatalogo)
        ? produtosCatalogo
        : [];
    const empresasArray = Array.isArray(empresas) ? empresas : [];
    const produtosArray = Array.isArray(produtos) ? produtos : [];

    useEffect(() => {
        dispatch(fetchNegotiationCampaigns());
        dispatch(fetchFiliais());
        dispatch(fetchProdutos());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            message.error(`Erro: ${error}`);
        }
    }, [error]);

    const showItemModal = () => {
        setItemDescricao('');
        setIsItemModalVisible(true);
    };

    const handleItemModalCancel = () => {
        setIsItemModalVisible(false);
    };

    const handleAddItem = () => {
        if (!itemDescricao) {
            message.error('Por favor, insira uma descrição para o item.');
            return;
        }

        if (!negociacaoId) {
        
            const newItem = {
                id: nextTableId,
                descricao: itemDescricao,
            };
            setTables([...tables, newItem]);
            setNextTableId(nextTableId + 1);
            setActiveTabKeys((prev) => ({
                ...prev,
                [newItem.id]: 'loja',
            }));
        } else {
            dispatch(
                createNegotiationItem({
                    id_negociacao: negociacaoId,
                    descricao: itemDescricao,
                })
            )
                .unwrap()
                .then((result) => {
                    const newItem = {
                        id: result.id,
                        descricao: result.descricao,
                    };
                    setTables([...tables, newItem]);
                    setActiveTabKeys((prev) => ({
                        ...prev,
                        [newItem.id]: 'loja',
                    }));
                    message.success('Item adicionado com sucesso!');
                })
                .catch(() => {
                    message.error('Erro ao adicionar item. Tente novamente.');
                });
        }

        setIsItemModalVisible(false);
    };

    const handleTabChange = (tabNumber: number, activeKey: string) => {
        setActiveTabKeys((prev) => ({
            ...prev,
            [tabNumber]: activeKey,
        }));
    };

    // Adicionar nova empresa ao item
    const handleAddEmpresa = (tableId: number) => {
        if (!selectedLoja) {
            message.error('Por favor, selecione uma loja.');
            return;
        }

        const novaEmpresa: INegociacaoEmpresa = {
            id_negociacao: negociacaoId || 0,
            id_item: tableId,
            id_empresa: selectedLoja.id,
            descricao: selectedLoja.descricao,
            meta: lojaInput.meta,
            premiacao: lojaInput.premiacao,
        };

        if (negociacaoId) {
            // Se a negociação já existe, envia para API
            dispatch(createNegotiationEmpresa(novaEmpresa))
                .unwrap()
                .then(() => {
                    message.success('Loja adicionada com sucesso!');
                    setSelectedLoja(null);
                    setLojaInput({ meta: 0, premiacao: '' });
                })
                .catch(() => {
                    message.error('Erro ao adicionar loja. Tente novamente.');
                });
        } else {
            // Caso contrário, adiciona localmente
            dispatch(addEmpresaLocal(novaEmpresa));
            setSelectedLoja(null);
            setLojaInput({ meta: 0, premiacao: '' });
        }
    };

    // Adicionar novo produto ao item
    const handleAddProduto = (tableId: number) => {
        if (!selectedProduto) {
            message.error('Por favor, selecione um produto.');
            return;
        }

        const novoProduto: INegociacaoProduto = {
            id_negociacao: negociacaoId || 0,
            id_item: tableId,
            id_produto: selectedProduto.id,
            descricao: selectedProduto.descricao,
            unidades: produtoInput.unidades,
            valor: produtoInput.valor,
        };

        if (negociacaoId) {
            // Se a negociação já existe, envia para API
            dispatch(createNegotiationProduto(novoProduto))
                .unwrap()
                .then(() => {
                    message.success('Produto adicionado com sucesso!');
                    setSelectedProduto(null);
                    setProdutoInput({ unidades: 0, valor: 0 });
                })
                .catch(() => {
                    message.error(
                        'Erro ao adicionar produto. Tente novamente.'
                    );
                });
        } else {
            // Caso contrário, adiciona localmente
            dispatch(addProdutoLocal(novoProduto));
            setSelectedProduto(null);
            setProdutoInput({ unidades: 0, valor: 0 });
        }
    };

    // Remover empresa da lista
    const handleRemoveEmpresa = (id?: number) => {
        if (id) {
            dispatch(removeEmpresaLocal(id));
        }
    };

    // Remover produto da lista
    const handleRemoveProduto = (id?: number) => {
        if (id) {
            dispatch(removeProdutoLocal(id));
        }
    };

    const addContact = () => {
        if (!contactInput.nome) {
            message.error('Nome é obrigatório para adicionar um contato');
            return;
        }

        setContacts([...contacts, { ...contactInput, key: contacts.length }]);
        setContactInput({ nome: '', email: '', celular: '' });
    };

    // Salvar a negociação completa
    const handleSubmit = async () => {
        if (!descricao || !dataInicial || !dataFinal) {
            message.error('Por favor, preencha todos os campos obrigatórios');
            return;
        }

        if (tables.length === 0) {
            message.error('Por favor, adicione pelo menos um item à campanha');
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

            // Primeiro, criar a negociação principal
            const negociationData = {
                descricao: descricao,
                data_inicial: dataInicialFormatted,
                data_final: dataFinalFormatted,
                usuario: user?.username || 'Usuário',
            };

            const result = await dispatch(
                createNegotiationCampaign(negociationData)
            ).unwrap();
            setNegociacaoId(result.id);

            // Depois, salvar cada item
            for (const tabela of tables) {
                // Se não temos ID de negociação, algo deu errado
                if (!result.id) continue;

                const itemData = {
                    id_negociacao: result.id,
                    descricao: tabela.descricao,
                };

                const itemResult = await dispatch(
                    createNegotiationItem(itemData)
                ).unwrap();

                // Agora salvar as empresas relacionadas a este item
                const empresasDoItem = empresasArray.filter(
                    (empresa) => empresa.id_item === tabela.id
                );
                for (const empresa of empresasDoItem) {
                    const empresaData: INegociacaoEmpresa = {
                        id_negociacao: result.id,
                        id_item: itemResult.id,
                        id_empresa: empresa.id_empresa,
                        descricao: empresa.descricao,
                        meta: empresa.meta,
                        premiacao: empresa.premiacao,
                    };
                    await dispatch(
                        createNegotiationEmpresa(empresaData)
                    ).unwrap();
                }

                // E os produtos relacionados a este item
                const produtosDoItem = produtosArray.filter(
                    (produto) => produto.id_item === tabela.id
                );
                for (const produto of produtosDoItem) {
                    const produtoData: INegociacaoProduto = {
                        id_negociacao: result.id,
                        id_item: itemResult.id,
                        id_produto: produto.id_produto,
                        descricao: produto.descricao,
                        unidades: produto.unidades,
                        valor: produto.valor,
                    };
                    await dispatch(
                        createNegotiationProduto(produtoData)
                    ).unwrap();
                }
            }

            message.success('Negociação cadastrada com sucesso!');
            // Limpar os estados após o cadastro bem-sucedido
            setDescricao('');
            setDataInicial('');
            setDataFinal('');
            setTables([]);
            setContacts([]);
            dispatch(resetLocalData());
        } catch (error) {
            console.error('Erro ao salvar negociação:', error);
            message.error('Erro ao cadastrar negociação. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    // Filtrar empresas e produtos relacionados a um determinado item
    const getEmpresasDoItem = (itemId: number) => {
        return empresasArray.filter((empresa) => empresa.id_item === itemId);
    };

    const getProdutosDoItem = (itemId: number) => {
        return produtosArray.filter((produto) => produto.id_item === itemId);
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

                        <div className="bg-white p-4 rounded shadow">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold text-green-600">
                                    Itens da Campanha
                                </h2>
                                <Button
                                    onClick={showItemModal}
                                    className="bg-green-500 hover:bg-green-600"
                                >
                                    Adicionar Item
                                </Button>
                            </div>

                            {tables.length === 0 ? (
                                <div className="text-center py-4 text-gray-500">
                                    Nenhum item adicionado. Clique em "Adicionar
                                    Item" para começar.
                                </div>
                            ) : (
                                tables.map((tabela) => (
                                    <div
                                        key={tabela.id}
                                        className="bg-white p-4 rounded shadow mb-4 border border-gray-200"
                                    >
                                        <h3 className="text-md font-bold text-green-600 mb-3">
                                            Item: {tabela.descricao} (#
                                            {tabela.id})
                                        </h3>

                                        <Tabs
                                            activeKey={
                                                activeTabKeys[tabela.id] ||
                                                'loja'
                                            }
                                            onChange={(key) =>
                                                handleTabChange(tabela.id, key)
                                            }
                                            className="mb-3"
                                        >
                                            <TabPane tab="Loja" key="loja">
                                                <div className="flex gap-2 mb-2">
                                                    <Select
                                                        showSearch
                                                        className="flex-1"
                                                        placeholder="Buscar loja..."
                                                        filterOption={(
                                                            input,
                                                            option
                                                        ) =>
                                                            (
                                                                option?.label ??
                                                                ''
                                                            )
                                                                .toLowerCase()
                                                                .includes(
                                                                    input.toLowerCase()
                                                                )
                                                        }
                                                        options={filiaisArray.map(
                                                            (filial) => ({
                                                                value: filial.id,
                                                                label: `${filial.codigo} - ${filial.descricao}`,
                                                            })
                                                        )}
                                                        onChange={(value) => {
                                                            const loja =
                                                                filiaisArray.find(
                                                                    (f) =>
                                                                        f.id ===
                                                                        value
                                                                );
                                                            setSelectedLoja(
                                                                loja || null
                                                            );
                                                        }}
                                                        value={selectedLoja?.id}
                                                    />

                                                    <Button
                                                        className="bg-green-500 hover:bg-green-600"
                                                        onClick={() =>
                                                            handleAddEmpresa(
                                                                tabela.id
                                                            )
                                                        }
                                                    >
                                                        Adicionar
                                                    </Button>
                                                </div>
                                                <Table
                                                    dataSource={getEmpresasDoItem(
                                                        tabela.id
                                                    )}
                                                    columns={[
                                                        {
                                                            title: 'Nome da Loja',
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

                                                        {
                                                            title: 'Ação',
                                                            key: 'acao',
                                                            render: (
                                                                _,
                                                                record
                                                            ) => (
                                                                <AntButton
                                                                    danger
                                                                    icon={
                                                                        <DeleteOutlined />
                                                                    }
                                                                    onClick={() =>
                                                                        handleRemoveEmpresa(
                                                                            record.id
                                                                        )
                                                                    }
                                                                />
                                                            ),
                                                        },
                                                    ]}
                                                    rowKey={(record) =>
                                                        record.id?.toString() ||
                                                        Math.random().toString()
                                                    }
                                                    pagination={false}
                                                />
                                            </TabPane>
                                            <TabPane
                                                tab="Produtos"
                                                key="produtos"
                                            >
                                                <div className="flex gap-2 mb-2">
                                                    <Select
                                                        showSearch
                                                        className="flex-1"
                                                        placeholder="Buscar produto..."
                                                        filterOption={(
                                                            input,
                                                            option
                                                        ) =>
                                                            (
                                                                option?.label ??
                                                                ''
                                                            )
                                                                .toLowerCase()
                                                                .includes(
                                                                    input.toLowerCase()
                                                                )
                                                        }
                                                        options={produtosCatalogoArray.map(
                                                            (produto) => ({
                                                                value: produto.id,
                                                                label: `${produto.codigo} - ${produto.descricao}`,
                                                            })
                                                        )}
                                                        onChange={(value) => {
                                                            const produto =
                                                                produtosCatalogoArray.find(
                                                                    (p) =>
                                                                        p.id ===
                                                                        value
                                                                );
                                                            setSelectedProduto(
                                                                produto || null
                                                            );
                                                        }}
                                                        value={
                                                            selectedProduto?.id
                                                        }
                                                    />
                                                    <InputNumber
                                                        placeholder="Unidades"
                                                        value={
                                                            produtoInput.unidades
                                                        }
                                                        onChange={(value) =>
                                                            setProdutoInput({
                                                                ...produtoInput,
                                                                unidades:
                                                                    value || 0,
                                                            })
                                                        }
                                                        className="w-24"
                                                    />

                                                    <Button
                                                        className="bg-green-500 hover:bg-green-600"
                                                        onClick={() =>
                                                            handleAddProduto(
                                                                tabela.id
                                                            )
                                                        }
                                                    >
                                                        Adicionar
                                                    </Button>
                                                </div>
                                                <Table
                                                    dataSource={getProdutosDoItem(
                                                        tabela.id
                                                    )}
                                                    columns={[
                                                        {
                                                            title: 'Produto',
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
                                                            title: 'Quantidade',
                                                            dataIndex:
                                                                'unidades',
                                                            key: 'unidades',
                                                        },
                                                        {
                                                            title: 'Valor',
                                                            dataIndex: 'valor',
                                                            key: 'valor',
                                                            render: (valor) =>
                                                                `R$ ${valor?.toFixed(2) || '0.00'}`,
                                                        },
                                                        {
                                                            title: 'Ação',
                                                            key: 'acao',
                                                            render: (
                                                                _,
                                                                record
                                                            ) => (
                                                                <AntButton
                                                                    danger
                                                                    icon={
                                                                        <DeleteOutlined />
                                                                    }
                                                                    onClick={() =>
                                                                        handleRemoveProduto(
                                                                            record.id
                                                                        )
                                                                    }
                                                                />
                                                            ),
                                                        },
                                                    ]}
                                                    rowKey={(record) =>
                                                        record.id?.toString() ||
                                                        Math.random().toString()
                                                    }
                                                    pagination={false}
                                                />
                                            </TabPane>
                                        </Tabs>
                                    </div>
                                ))
                            )}
                        </div>

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
                                    {
                                        title: 'Ação',
                                        key: 'acao',
                                        render: (_, record) => (
                                            <AntButton
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() => {
                                                    setContacts(
                                                        contacts.filter(
                                                            (c) =>
                                                                c.key !==
                                                                record.key
                                                        )
                                                    );
                                                }}
                                            />
                                        ),
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

            <Modal
                title="Adicionar Item"
                open={isItemModalVisible}
                onOk={handleAddItem}
                onCancel={handleItemModalCancel}
                okText="Adicionar"
                cancelText="Cancelar"
            >
                <Form layout="vertical">
                    <Form.Item
                        label="Descrição do Item"
                        required
                        rules={[
                            {
                                required: true,
                                message:
                                    'Por favor, informe a descrição do item',
                            },
                        ]}
                    >
                        <Input
                            placeholder="Ex: Campanha de Inverno, Promoção de Verão, etc."
                            value={itemDescricao}
                            onChange={(e) => setItemDescricao(e.target.value)}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
