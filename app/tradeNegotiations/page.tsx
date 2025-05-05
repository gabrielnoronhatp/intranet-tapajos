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
    createNegotiationContato,
    addEmpresaLocal,
    removeEmpresaLocal,
    addProdutoLocal,
    removeProdutoLocal,
    addContatoLocal,
    removeContatoLocal,
    resetLocalData,
    fetchItensObjeto,
    createItemObjeto,
    fetchFiliais,
    ICadastroItensObjeto,
    fetchNegotiationCampaignById,
    fetchNegotiationItems,
    fetchNegotiationEmpresas,
    fetchNegotiationProdutos,
    fetchNegotiationContatos,
    deleteNegotiationEmpresa,
    deleteNegotiationProduto,
    deleteNegotiationContato,
    updateNegotiationCampaign,
} from '@/hooks/slices/trade/tradeNegotiationsSlice';

import { fetchProductsByType } from '@/hooks/slices/trade/tradeSlice';
import { DeleteOutlined } from '@ant-design/icons';
import { useParams } from 'next/navigation';

const { TabPane } = Tabs;

interface IContatoTemp {
    nome: string;
    email: string;
    telefone: string;
    key: number;
    id?: number;
}

interface ILojaSelect {
    id: number;
    loja?: string;
    nome?: string;
    descricao?: string;
}

interface IFilialExtended {
    id?: number;
    idempresa?: number;
    loja?: string;
    nome?: string;
    descricao?: string;
}

interface IProdutoSelect {
    id?: number;
    idproduto?: number;
    codprod?: number;
    nome?: string;
    descricao?: string;
}

export default function NegotiationsRegistration() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [tables, setTables] = useState<
        {
            id: number;
            descricao: string;
            id_item_objeto?: number;
            id_item_negociacao?: number;
        }[]
    >([]);
    const [nextTableId, setNextTableId] = useState(1);
    const [contatosTemp, setContatosTemp] = useState<IContatoTemp[]>([]);
    const [contatoInput, setContatoInput] = useState({
        nome: '',
        email: '',
        telefone: '',
    });

    const [activeTabKeys, setActiveTabKeys] = useState<Record<number, string>>(
        {}
    );
    const [itemDescricao, setItemDescricao] = useState('');
    const [itemSigla, setItemSigla] = useState('');
    const [showNewItemInput, setShowNewItemInput] = useState(false);
    const [selectedItem, setSelectedItem] =
        useState<ICadastroItensObjeto | null>(null);
    const [selectedLoja, setSelectedLoja] = useState<ILojaSelect | null>(null);
    const [selectedProduto, setSelectedProduto] =
        useState<IProdutoSelect | null>(null);
    const [produtoInput, setProdutoInput] = useState({
        unidades: 0,
        valor: 0,
    });

    const [descricao, setDescricao] = useState('');
    const [dataInicial, setDataInicial] = useState('');
    const [dataFinal, setDataFinal] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [negociacaoId, setNegociacaoId] = useState<number | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const {
        error,
        empresas = [],
        produtos = [],
        itensObjeto = [],
        filiais = [],
    } = useSelector((state: RootState) => state.tradeNegotiations);
    const { products = [] } = useSelector((state: RootState) => state.trade);

    const empresasArray = Array.isArray(empresas) ? empresas : [];
    const produtosArray = Array.isArray(produtos) ? produtos : [];
    const itensObjetoArray = Array.isArray(itensObjeto) ? itensObjeto : [];
    const productsArray = Array.isArray(products) ? products : [];
    const filiaisArray = Array.isArray(filiais)
        ? (filiais as IFilialExtended[])
        : [];
    const params = useParams();
    const id = params.tradeNegotiationsId;
    useEffect(() => {
        console.log('Componente inicializado, props ID:', id);
        dispatch(fetchNegotiationCampaigns());
        dispatch(fetchItensObjeto());
        dispatch(fetchProductsByType({ busca: '', type: 'produto' }));
        dispatch(fetchFiliais());
        if (id) {
            console.log(
                'Modo de edição ativado, carregando dados para ID:',
                id
            );
            setIsEditMode(true);
            setNegociacaoId(Number(id));
            carregarDadosEdicao(Number(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (error) {
            message.error(`Erro: ${error}`);
        }
    }, [error]);

    const carregarDadosEdicao = async (negociacaoId: number) => {
        try {
            setIsLoading(true);
            console.log(
                'Iniciando carregamento de dados para edição, ID:',
                negociacaoId
            );

            console.log('Disparando fetchNegotiationCampaignById...');
            const campanhaResult = await dispatch(
                fetchNegotiationCampaignById(negociacaoId)
            ).unwrap();
            console.log(
                'Dados da campanha carregados:',
                JSON.stringify(campanhaResult)
            );

            if (campanhaResult) {
                console.log(
                    'Atualizando campos do formulário com dados da campanha...'
                );
                console.log('Descrição:', campanhaResult.descricao);
                console.log('Data Inicial:', campanhaResult.data_inicial);
                console.log('Data Final:', campanhaResult.data_final);

                setDescricao(campanhaResult.descricao || '');
                setDataInicial(campanhaResult.data_inicial || '');
                setDataFinal(campanhaResult.data_final || '');

                setTimeout(() => {
                    console.log('Valores atualizados:');
                    console.log('Descrição (state):', descricao);
                    console.log('Data Inicial (state):', dataInicial);
                    console.log('Data Final (state):', dataFinal);
                }, 100);
            } else {
                message.error(
                    'Não foi possível carregar os dados da negociação'
                );
                return;
            }

            // Carregar os itens da negociação
            const itensResult = await dispatch(
                fetchNegotiationItems(negociacaoId)
            ).unwrap();
            console.log('Itens da negociação carregados:', itensResult);

            if (
                !itensResult ||
                !Array.isArray(itensResult) ||
                itensResult.length === 0
            ) {
                console.warn('Nenhum item encontrado para esta negociação');
                setIsLoading(false);
                return;
            }

            const tabelasTemp = [];
            let novoNextTableId = nextTableId;

            // Para cada item, vamos criar uma tabela correspondente
            for (const item of itensResult) {
                console.log('Processando item:', item);

                const novaTabela = {
                    id: novoNextTableId,
                    descricao: item.descricao || '',
                    id_item_objeto: item.id_objeto || 0,
                    id_item_negociacao: item.id, // ID real do item na base
                };

                tabelasTemp.push(novaTabela);

                // Configurar a tab ativa para este item
                setActiveTabKeys((prev) => ({
                    ...prev,
                    [novaTabela.id]: 'loja',
                }));

                // Carregar empresas deste item
                try {
                    const empresasResult = await dispatch(
                        fetchNegotiationEmpresas({
                            negociacaoId,
                            itemId: item.id,
                        })
                    ).unwrap();

                    console.log('Empresas do item carregadas:', empresasResult);

                    // Mapear empresas para o formato da store
                    if (empresasResult && Array.isArray(empresasResult)) {
                        for (const empresa of empresasResult) {
                            const empresaLocalFormat = {
                                ...empresa,
                                id_item: novaTabela.id, // ID local, não o do banco
                            };
                            dispatch(addEmpresaLocal(empresaLocalFormat));
                        }
                    }
                } catch (error) {
                    console.error('Erro ao carregar empresas do item:', error);
                }

                // Carregar produtos deste item
                try {
                    const produtosResult = await dispatch(
                        fetchNegotiationProdutos({
                            negociacaoId,
                            itemId: item.id,
                        })
                    ).unwrap();

                    console.log('Produtos do item carregados:', produtosResult);

                    // Mapear produtos para o formato da store
                    if (produtosResult && Array.isArray(produtosResult)) {
                        for (const produto of produtosResult) {
                            const produtoLocalFormat = {
                                ...produto,
                                id_item: novaTabela.id, // ID local, não o do banco
                            };
                            dispatch(addProdutoLocal(produtoLocalFormat));
                        }
                    }
                } catch (error) {
                    console.error('Erro ao carregar produtos do item:', error);
                }

                novoNextTableId++;
            }

            console.log('Tabelas criadas:', tabelasTemp);
            setTables(tabelasTemp);
            setNextTableId(novoNextTableId);

            // Carregar contatos da negociação
            try {
                const contatosResult = await dispatch(
                    fetchNegotiationContatos(negociacaoId)
                ).unwrap();
                console.log('Contatos carregados:', contatosResult);

                if (contatosResult && Array.isArray(contatosResult)) {
                    setContatosTemp(
                        contatosResult.map((contato, index) => ({
                            nome: contato.nome || '',
                            email: contato.email || '',
                            telefone: contato.telefone || '',
                            key: index,
                            id: contato.id,
                        }))
                    );
                }
            } catch (error) {
                console.error('Erro ao carregar contatos:', error);
            }
        } catch (error) {
            console.error('Erro geral ao carregar dados para edição:', error);
            message.error('Erro ao carregar dados. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddItem = () => {
        if (selectedItem) {
            const newItem = {
                id: nextTableId,
                descricao: selectedItem.descricao,
                id_item_objeto: selectedItem.id,
            };
            setTables([...tables, newItem]);
            setNextTableId(nextTableId + 1);
            setActiveTabKeys((prev) => ({
                ...prev,
                [newItem.id]: 'loja',
            }));
            setSelectedItem(null);
        } else if (showNewItemInput) {
            if (!itemDescricao || !itemSigla) {
                message.error(
                    'Por favor, preencha todos os campos do novo item.'
                );
                return;
            }

            const itemData = {
                descricao: itemDescricao,
                sigla: itemSigla,
                usuario: user?.username || 'Usuário',
            };

            dispatch(createItemObjeto(itemData))
                .unwrap()
                .then((result) => {
                    const newItem = {
                        id: nextTableId,
                        descricao: result.descricao,
                        id_item_objeto: result.id,
                    };
                    setTables([...tables, newItem]);
                    setNextTableId(nextTableId + 1);
                    setActiveTabKeys((prev) => ({
                        ...prev,
                        [newItem.id]: 'loja',
                    }));
                    message.success('Item adicionado com sucesso!');

                    setItemDescricao('');
                    setItemSigla('');
                    setShowNewItemInput(false);
                })
                .catch(() => {
                    message.error('Erro ao adicionar item. Tente novamente.');
                });
        } else {
            message.error('Por favor, selecione um item ou crie um novo.');
        }
    };

    const toggleNewItemInput = () => {
        setShowNewItemInput(!showNewItemInput);
        setSelectedItem(null);
        setItemDescricao('');
        setItemSigla('');
    };

    const handleTabChange = (tabNumber: number, activeKey: string) => {
        setActiveTabKeys((prev) => ({
            ...prev,
            [tabNumber]: activeKey,
        }));
    };

    const handleAddEmpresa = (
        filialId: number,
        filialLoja: string,
        tableId: number
    ) => {
        const novaEmpresa = {
            id_negociacao: negociacaoId || 0,
            id_item: tableId,
            id_empresa: filialId,
            descricao: filialLoja,
        };

        console.log('Adicionando empresa:', novaEmpresa);

        dispatch(addEmpresaLocal(novaEmpresa));
        setSelectedLoja(null);

        message.success('Loja adicionada com sucesso!');
    };

    const handleAddProduto = (tableId: number) => {
        console.log('Adicionando produto:', selectedProduto);
        if (!selectedProduto) {
            message.error('Por favor, selecione um produto.');
            return;
        }

        if (!produtoInput.unidades || produtoInput.unidades <= 0) {
            message.error('Por favor, informe uma quantidade válida.');
            return;
        }

        const novoProduto = {
            id_negociacao: negociacaoId || 0,
            id_item: tableId,
            id_produto: selectedProduto?.codprod as number,
            descricao: selectedProduto.descricao || selectedProduto.nome || '',
            unidades: produtoInput.unidades,
        };

        dispatch(addProdutoLocal(novoProduto));
        setSelectedProduto(null);
        setProdutoInput({ unidades: 0, valor: 0 });
        message.success('Produto adicionado com sucesso!');
    };

    const handleRemoveEmpresa = (id?: number) => {
        console.log('id empresa', id);
        if (!id) return;

        if (isEditMode && id > 0) {
            // Remover da API se estiver em modo edição e for um registro existente
            dispatch(deleteNegotiationEmpresa(id))
                .then(() => {
                    message.success('Loja removida com sucesso!');
                })
                .catch((error) => {
                    console.error('Erro ao remover loja:', error);
                    message.error('Erro ao remover loja. Tente novamente.');
                });
        }

        // Remover localmente de qualquer forma
        dispatch(removeEmpresaLocal(id));
    };

    const handleRemoveProduto = (id?: number) => {
        if (!id) return;

        if (isEditMode && id > 0) {
            // Remover da API se estiver em modo edição e for um registro existente
            dispatch(deleteNegotiationProduto(id))
                .then(() => {
                    message.success('Produto removido com sucesso!');
                })
                .catch((error) => {
                    console.error('Erro ao remover produto:', error);
                    message.error('Erro ao remover produto. Tente novamente.');
                });
        }

        // Remover localmente de qualquer forma
        dispatch(removeProdutoLocal(id));
    };

    const addContact = () => {
        if (!contatoInput.nome) {
            message.error('Nome é obrigatório para adicionar um contato');
            return;
        }

        const newContact = {
            ...contatoInput,
            telefone: contatoInput.telefone || '',
            key: contatosTemp.length,
        };
        setContatosTemp([...contatosTemp, newContact]);

        if (negociacaoId) {
            dispatch(
                addContatoLocal({
                    id_negociacao: negociacaoId,
                    nome: contatoInput.nome,
                    email: contatoInput.email,
                    telefone: contatoInput.telefone || '',
                })
            );
        }

        setContatoInput({ nome: '', email: '', telefone: '' });
    };

    const handleRemoveContato = (key: number, id?: number) => {
        if (isEditMode && id) {
            // Remover da API se estiver em modo edição e for um registro existente
            dispatch(deleteNegotiationContato(id))
                .then(() => {
                    message.success('Contato removido com sucesso!');
                })
                .catch((error) => {
                    console.error('Erro ao remover contato:', error);
                    message.error('Erro ao remover contato. Tente novamente.');
                });
        }

        // Remover localmente
        setContatosTemp(contatosTemp.filter((c) => c.key !== key));
        dispatch(removeContatoLocal(key));
    };

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

            if (isEditMode) {
                // Atualizar a negociação existente
                const negociationData = {
                    descricao: descricao,
                    data_inicial: dataInicialFormatted,
                    data_final: dataFinalFormatted,
                    usuario: user?.username || 'Usuário',
                };

                await dispatch(
                    updateNegotiationCampaign({
                        id: negociacaoId as number,
                        data: negociationData,
                    })
                ).unwrap();

                // Processar alterações em itens, empresas e produtos
                for (const tabela of tables) {
                    const idItemNegociacao = tabela.id_item_negociacao || 0;
                    let idItem = idItemNegociacao;

                    if (!idItemNegociacao) {
                        // Se é um novo item, criar na API
                        const itemData = {
                            id_negociacao: negociacaoId as number,
                            id_objeto: tabela.id_item_objeto || 0,
                            descricao: tabela.descricao,
                        };

                        const itemResult = await dispatch(
                            createNegotiationItem(itemData)
                        ).unwrap();
                        idItem = itemResult.id;
                    }

                    // Processar empresas deste item (novas adições foram feitas na store)
                    const empresasDoItem = empresasArray.filter(
                        (empresa) =>
                            empresa.id_item === tabela.id && !empresa.id
                    );

                    for (const empresa of empresasDoItem) {
                        const empresaData = {
                            id_negociacao: negociacaoId as number,
                            id_item: idItem,
                            id_empresa: empresa.id_empresa,
                            descricao: empresa.descricao,
                        };
                        await dispatch(
                            createNegotiationEmpresa(empresaData)
                        ).unwrap();
                    }

                    // Processar produtos deste item (novas adições)
                    const produtosDoItem = produtosArray.filter(
                        (produto) =>
                            produto.id_item === tabela.id && !produto.id
                    );

                    for (const produto of produtosDoItem) {
                        const produtoData = {
                            id_negociacao: negociacaoId as number,
                            id_item: idItem,
                            id_produto: produto.id_produto,
                            descricao: produto.descricao,
                            unidades: produto.unidades,
                        };
                        await dispatch(
                            createNegotiationProduto(produtoData)
                        ).unwrap();
                    }
                }

                // Processar novos contatos (sem ID)
                const novosContatos = contatosTemp.filter(
                    (contato) => !contato.id
                );

                for (const contato of novosContatos) {
                    const contatoData = {
                        id_negociacao: negociacaoId as number,
                        nome: contato.nome,
                        email: contato.email,
                        telefone: contato.telefone,
                    };
                    await dispatch(
                        createNegotiationContato(contatoData)
                    ).unwrap();
                }

                message.success('Negociação atualizada com sucesso!');
            } else {
                // Código existente para criação de nova negociação
                const negociationData = {
                    descricao: descricao,
                    data_inicial: dataInicialFormatted,
                    data_final: dataFinalFormatted,
                    usuario: user?.username || 'Usuário',
                };

                const result = await dispatch(
                    createNegotiationCampaign(negociationData)
                ).unwrap();

                const idNegociacao = result.id;
                setNegociacaoId(idNegociacao);

                for (const tabela of tables) {
                    if (!idNegociacao) continue;

                    const itemData = {
                        id_negociacao: idNegociacao,
                        id_objeto: tabela.id_item_objeto || 0,
                        descricao: tabela.descricao,
                    };

                    const itemResult = await dispatch(
                        createNegotiationItem(itemData)
                    ).unwrap();

                    const idItem = itemResult.id;

                    const empresasDoItem = empresasArray.filter(
                        (empresa) => empresa.id_item === tabela.id
                    );

                    for (const empresa of empresasDoItem) {
                        const empresaData = {
                            id_negociacao: idNegociacao,
                            id_item: idItem,
                            id_empresa: empresa.id_empresa,
                            descricao: empresa.descricao,
                        };
                        await dispatch(
                            createNegotiationEmpresa(empresaData)
                        ).unwrap();
                    }

                    const produtosDoItem = produtosArray.filter(
                        (produto) => produto.id_item === tabela.id
                    );

                    for (const produto of produtosDoItem) {
                        const produtoData = {
                            id_negociacao: idNegociacao,
                            id_item: idItem,
                            id_produto: produto.id_produto,
                            descricao: produto.descricao,
                            unidades: produto.unidades,
                        };
                        await dispatch(
                            createNegotiationProduto(produtoData)
                        ).unwrap();
                    }
                }

                for (const contato of contatosTemp) {
                    const contatoData = {
                        id_negociacao: idNegociacao,
                        nome: contato.nome,
                        email: contato.email,
                        telefone: contato.telefone,
                    };
                    await dispatch(
                        createNegotiationContato(contatoData)
                    ).unwrap();
                }

                message.success('Negociação cadastrada com sucesso!');
            }
            setDescricao('');
            setDataInicial('');
            setDataFinal('');
            setTables([]);
            setContatosTemp([]);
            dispatch(resetLocalData());
        } catch (error) {
            console.error('Erro ao salvar negociação:', error);
            message.error('Erro ao processar negociação. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

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
                            </div>

                            <div className="mb-4">
                                {!showNewItemInput ? (
                                    <div className="flex gap-2">
                                        <Select
                                            showSearch
                                            className="flex-1"
                                            placeholder="Selecione um item..."
                                            value={selectedItem?.id}
                                            onChange={(value) => {
                                                const item =
                                                    itensObjetoArray.find(
                                                        (i) => i.id === value
                                                    );
                                                setSelectedItem(item || null);
                                            }}
                                            filterOption={(input, option) =>
                                                (option?.label ?? '')
                                                    .toLowerCase()
                                                    .includes(
                                                        input.toLowerCase()
                                                    )
                                            }
                                            options={itensObjetoArray.map(
                                                (item) => ({
                                                    value: item.id,
                                                    label: `${item.sigla} - ${item.descricao}`,
                                                })
                                            )}
                                        />
                                        <Button
                                            onClick={toggleNewItemInput}
                                            className="bg-blue-500 hover:bg-blue-600"
                                        >
                                            Novo Item
                                        </Button>
                                        <Button
                                            onClick={handleAddItem}
                                            className="bg-green-500 hover:bg-green-600"
                                            disabled={!selectedItem}
                                        >
                                            Adicionar Item
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Descrição do Item"
                                                value={itemDescricao}
                                                onChange={(e) =>
                                                    setItemDescricao(
                                                        e.target.value
                                                    )
                                                }
                                                className="flex-1"
                                            />
                                            <Input
                                                placeholder="Sigla"
                                                value={itemSigla}
                                                onChange={(e) =>
                                                    setItemSigla(e.target.value)
                                                }
                                                className="w-24"
                                            />
                                        </div>
                                        <div className="flex gap-2 justify-end">
                                            <Button
                                                onClick={toggleNewItemInput}
                                                className="bg-gray-200 hover:bg-gray-300"
                                            >
                                                Cancelar
                                            </Button>
                                            <Button
                                                onClick={handleAddItem}
                                                className="bg-green-500 hover:bg-green-600"
                                                disabled={
                                                    !itemDescricao || !itemSigla
                                                }
                                            >
                                                Salvar Item
                                            </Button>
                                        </div>
                                    </div>
                                )}
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
                                                                value: filial.idempresa,
                                                                label: filial.loja,
                                                            })
                                                        )}
                                                        onChange={(value) => {
                                                            const filialSelecionada =
                                                                filiaisArray.find(
                                                                    (f) =>
                                                                        f.idempresa ===
                                                                        value
                                                                );
                                                            if (
                                                                filialSelecionada
                                                            ) {
                                                                console.log(
                                                                    'Filial selecionada:',
                                                                    filialSelecionada
                                                                );
                                                                setSelectedLoja(
                                                                    filialSelecionada
                                                                );
                                                            }
                                                        }}
                                                        value={null}
                                                    />

                                                    <Button
                                                        className="bg-green-500 hover:bg-green-600"
                                                        disabled={!selectedLoja}
                                                        onClick={() => {
                                                            if (selectedLoja) {
                                                                handleAddEmpresa(
                                                                    selectedLoja.id,
                                                                    selectedLoja.loja ||
                                                                        selectedLoja.nome ||
                                                                        '',
                                                                    tabela.id
                                                                );
                                                            }
                                                        }}
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
                                                        options={productsArray.map(
                                                            (produto) => ({
                                                                value: produto.codprod,
                                                                label:
                                                                    produto.descricao ||
                                                                    produto.nome ||
                                                                    String(
                                                                        produto.id
                                                                    ),
                                                            })
                                                        )}
                                                        onChange={(value) => {
                                                            const produtoSelecionado =
                                                                productsArray.find(
                                                                    (p) =>
                                                                        String(
                                                                            p.codprod
                                                                        ) ===
                                                                        String(
                                                                            value
                                                                        )
                                                                );
                                                            // Converter para o formato IProdutoSelect
                                                            if (
                                                                produtoSelecionado
                                                            ) {
                                                                const produtoFormatado: IProdutoSelect =
                                                                    {
                                                                        id: produtoSelecionado.id,
                                                                        idproduto:
                                                                            produtoSelecionado.id,
                                                                        codprod:
                                                                            Number(
                                                                                produtoSelecionado.codprod
                                                                            ),
                                                                        nome: produtoSelecionado.nome,
                                                                        descricao:
                                                                            produtoSelecionado.descricao,
                                                                    };
                                                                setSelectedProduto(
                                                                    produtoFormatado
                                                                );
                                                                console.log(
                                                                    'Produto selecionado e convertido:',
                                                                    produtoFormatado
                                                                );
                                                            } else {
                                                                setSelectedProduto(
                                                                    null
                                                                );
                                                            }
                                                        }}
                                                        value={
                                                            selectedProduto?.codprod ||
                                                            null
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
                                    value={contatoInput.nome}
                                    onChange={(e) =>
                                        setContatoInput({
                                            ...contatoInput,
                                            nome: e.target.value,
                                        })
                                    }
                                    className="flex-1"
                                />
                                <Input
                                    placeholder="Email"
                                    value={contatoInput.email}
                                    onChange={(e) =>
                                        setContatoInput({
                                            ...contatoInput,
                                            email: e.target.value,
                                        })
                                    }
                                    className="flex-1"
                                />
                                <Input
                                    placeholder="Número de Telefone"
                                    value={contatoInput.telefone}
                                    onChange={(e) =>
                                        setContatoInput({
                                            ...contatoInput,
                                            telefone: e.target.value,
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
                                dataSource={contatosTemp}
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
                                        title: 'Telefone',
                                        dataIndex: 'telefone',
                                        key: 'telefone',
                                    },
                                    {
                                        title: 'Ação',
                                        key: 'acao',
                                        render: (_, record) => (
                                            <AntButton
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() => {
                                                    handleRemoveContato(
                                                        record.key,
                                                        record.id
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
        </div>
    );
}
