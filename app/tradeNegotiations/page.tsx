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
    deleteNegotiationItem,
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
        dispatch(fetchNegotiationCampaigns());
        dispatch(fetchItensObjeto());
        dispatch(fetchProductsByType({ busca: '', type: 'produto' }));
        dispatch(fetchFiliais());
        if (id) {
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

            const campanhaResult = await dispatch(
                fetchNegotiationCampaignById(negociacaoId)
            ).unwrap();

            if (campanhaResult) {
                setDescricao(campanhaResult.descricao || '');
                setDataInicial(campanhaResult.data_inicial || '');
                setDataFinal(campanhaResult.data_final || '');
            } else {
                message.error(
                    'Não foi possível carregar os dados da negociação'
                );
                return;
            }

            const itensResult = await dispatch(
                fetchNegotiationItems(negociacaoId)
            ).unwrap();

            const itensArray = Array.isArray(itensResult)
                ? itensResult
                : itensResult
                  ? [itensResult]
                  : [];

            if (itensArray.length === 0) {
                setIsLoading(false);
                return;
            }

            const todasEmpresasResult = await dispatch(
                fetchNegotiationEmpresas(negociacaoId)
            ).unwrap();

            const todosProdutosResult = await dispatch(
                fetchNegotiationProdutos(negociacaoId)
            ).unwrap();

            const tabelasTemp = [];
            let novoNextTableId = nextTableId;

            for (const item of itensArray) {
                const novaTabela = {
                    id: novoNextTableId,
                    descricao: item.descricao || '',
                    id_item_objeto: item.id_objeto || 0,
                    id_item_negociacao: item.id,
                };

                tabelasTemp.push(novaTabela);

                setActiveTabKeys((prev) => ({
                    ...prev,
                    [novaTabela.id]: 'loja',
                }));

                const empresasDoItem = Array.isArray(todasEmpresasResult)
                    ? todasEmpresasResult.filter(
                          (emp) => emp.id_item === item.id
                      )
                    : [];

                for (const empresa of empresasDoItem) {
                    const empresaLocalFormat = {
                        ...empresa,
                        id_item: novaTabela.id,
                    };
                    dispatch(addEmpresaLocal(empresaLocalFormat));
                }

                const produtosDoItem = Array.isArray(todosProdutosResult)
                    ? todosProdutosResult.filter(
                          (prod) => prod.id_item === item.id
                      )
                    : [];

                for (const produto of produtosDoItem) {
                    const produtoLocalFormat = {
                        ...produto,
                        id_item: novaTabela.id,
                    };
                    dispatch(addProdutoLocal(produtoLocalFormat));
                }

                novoNextTableId++;
            }

            setTables(tabelasTemp);
            setNextTableId(novoNextTableId);

            try {
                const contatosResult = await dispatch(
                    fetchNegotiationContatos(negociacaoId)
                ).unwrap();

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
        const empresasDoItem = getEmpresasDoItem(tableId);
        const jaExiste = empresasDoItem.some((e) => e.id_empresa === filialId);

        if (jaExiste) {
            message.warning('Esta loja já foi adicionada a este item.');
            setSelectedLoja(null);
            return;
        }

        const novaEmpresa = {
            id_negociacao: negociacaoId || 0,
            id_item: tableId,
            id_item_original: tableId,
            id_empresa: filialId,
            descricao: filialLoja,
        };

        dispatch(addEmpresaLocal(novaEmpresa));
        setSelectedLoja(null);

        message.success('Loja adicionada com sucesso!');
    };

    const handleAddProduto = (tableId: number) => {
        if (!selectedProduto) {
            message.error('Por favor, selecione um produto.');
            return;
        }

        if (!produtoInput.unidades || produtoInput.unidades <= 0) {
            message.error('Por favor, informe uma quantidade válida.');
            return;
        }

        const produtosDoItem = getProdutosDoItem(tableId);
        const jaExiste = produtosDoItem.some(
            (p) => p.id_produto === selectedProduto?.codprod
        );

        if (jaExiste) {
            message.warning('Este produto já foi adicionado a este item.');
            setSelectedProduto(null);
            setProdutoInput({ unidades: 0, valor: 0 });
            return;
        }

        const novoProduto = {
            id_negociacao: negociacaoId || 0,
            id_item: tableId,
            id_item_original: tableId,
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
        if (!id) return;

        if (isEditMode && id > 0) {
            dispatch(deleteNegotiationEmpresa(id))
                .then(() => {
                    message.success('Loja removida com sucesso!');
                })
                .catch((error) => {
                    console.error('Erro ao remover loja:', error);
                    message.error('Erro ao remover loja. Tente novamente.');
                });
        }

        dispatch(removeEmpresaLocal(id));
    };

    const handleRemoveProduto = (id?: number) => {
        if (!id) return;

        if (isEditMode && id > 0) {
            dispatch(deleteNegotiationProduto(id))
                .then(() => {
                    message.success('Produto removido com sucesso!');
                })
                .catch((error) => {
                    console.error('Erro ao remover produto:', error);
                    message.error('Erro ao remover produto. Tente novamente.');
                });
        }

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
            dispatch(deleteNegotiationContato(id))
                .then(() => {
                    message.success('Contato removido com sucesso!');
                })
                .catch((error) => {
                    console.error('Erro ao remover contato:', error);
                    message.error('Erro ao remover contato. Tente novamente.');
                });
        }

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

            let currentNegociacaoId = negociacaoId;

            if (isEditMode) {
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
            } else {
                const negociationData = {
                    descricao: descricao,
                    data_inicial: dataInicialFormatted,
                    data_final: dataFinalFormatted,
                    usuario: user?.username || 'Usuário',
                };

                const result = await dispatch(
                    createNegotiationCampaign(negociationData)
                ).unwrap();

                currentNegociacaoId = result.id;
                setNegociacaoId(currentNegociacaoId);
            }

            const tabelasAtualizadas = [...tables];
            const mapaDeIds = new Map();

            for (let i = 0; i < tabelasAtualizadas.length; i++) {
                const tabela = tabelasAtualizadas[i];
                const idItemNegociacao = tabela.id_item_negociacao || 0;
                let idItemReal = idItemNegociacao;

                if (!idItemReal) {
                    const itemData = {
                        id_negociacao: currentNegociacaoId as number,
                        id_objeto: tabela.id_item_objeto || 0,
                        descricao: tabela.descricao,
                    };

                    try {
                        const itemResult = await dispatch(
                            createNegotiationItem(itemData)
                        ).unwrap();

                        idItemReal = itemResult.id;

                        mapaDeIds.set(tabela.id, idItemReal);
                        tabelasAtualizadas[i] = {
                            ...tabela,
                            id_item_negociacao: idItemReal,
                        };

                        produtosArray.forEach((produto, idx) => {
                            if (
                                produto.id_item === tabela.id ||
                                produto.id_item_original === tabela.id
                            ) {
                                produtosArray[idx] = {
                                    ...produto,
                                    id_item: idItemReal,
                                };
                            }
                        });

                        empresasArray.forEach((empresa, idx) => {
                            if (
                                empresa.id_item === tabela.id ||
                                empresa.id_item_original === tabela.id
                            ) {
                                empresasArray[idx] = {
                                    ...empresa,
                                    id_item: idItemReal,
                                };
                            }
                        });
                    } catch (erro) {
                        console.error(`Erro ao criar item ${i + 1}:`, erro);
                    }
                } else {
                    mapaDeIds.set(tabela.id, idItemReal);
                }
            }

            await new Promise((resolve) => setTimeout(resolve, 500));

            for (let i = 0; i < tabelasAtualizadas.length; i++) {
                const tabela = tabelasAtualizadas[i];
                const idLocalTabela = tabela.id;
                const idItemReal = mapaDeIds.get(idLocalTabela);

                if (!idItemReal) {
                    console.error(
                        `ID real não encontrado para a tabela ${idLocalTabela}. Pulando...`
                    );
                    continue;
                }

                const empresasDoItem = getEmpresasDoItem(idLocalTabela);

                for (const empresa of empresasDoItem) {
                    if (!empresa.id || empresa.id < 0) {
                        const empresaData = {
                            ...empresa,
                            id_negociacao: currentNegociacaoId as number,
                            id_item: idItemReal,
                        };
                        await dispatch(
                            createNegotiationEmpresa(empresaData)
                        ).unwrap();
                    }
                }

                const produtosDoItem = getProdutosDoItem(idLocalTabela);

                for (const produto of produtosDoItem) {
                    if (!produto.id || produto.id < 0) {
                        const produtoData = {
                            ...produto,
                            id_negociacao: currentNegociacaoId as number,
                            id_item: idItemReal,
                        };
                        await dispatch(
                            createNegotiationProduto(produtoData)
                        ).unwrap();
                    }
                }

                await new Promise((resolve) => setTimeout(resolve, 300));
            }

            for (const contato of contatosTemp) {
                if (!contato.id) {
                    const contatoData = {
                        id_negociacao: currentNegociacaoId as number,
                        nome: contato.nome,
                        email: contato.email,
                        telefone: contato.telefone,
                    };

                    try {
                        await dispatch(
                            createNegotiationContato(contatoData)
                        ).unwrap();
                    } catch (erro) {
                        console.error('Erro ao salvar contato:', erro);
                    }
                }
            }

            message.success(
                `Negociação ${isEditMode ? 'atualizada' : 'cadastrada'} com sucesso!`
            );

            setTimeout(() => {
                window.location.href = '/tradeNegotiations/list';
            }, 1000);
        } catch (error) {
            console.error('Erro ao salvar negociação:', error);
            message.error('Erro ao processar negociação. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const getEmpresasDoItem = (tableId: number) => {
        const empresasFiltradas = empresasArray.filter(
            (empresa) =>
                empresa.id_item === tableId ||
                empresa.id_item_original === tableId
        );
        return empresasFiltradas;
    };

    const getProdutosDoItem = (tableId: number) => {
        const produtosFiltrados = produtosArray.filter(
            (produto) =>
                produto.id_item === tableId ||
                produto.id_item_original === tableId
        );
        return produtosFiltrados;
    };

    const handleRemoveTable = async (tableId: number) => {
        const tableToRemove = tables.find((table) => table.id === tableId);

        if (isEditMode && tableToRemove?.id_item_negociacao) {
            try {
                await dispatch(
                    deleteNegotiationItem(tableToRemove.id_item_negociacao)
                ).unwrap();
                message.success('Item deletado com sucesso!');
            } catch (error) {
                console.error('Erro ao deletar item:', error);
                message.error('Erro ao deletar item. Tente novamente.');
                return;
            }
        }

        setTables(tables.filter((table) => table.id !== tableId));
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
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-md font-bold text-green-600 mb-3">
                                                Item: {tabela.descricao} (#
                                                {tabela.id})
                                            </h3>
                                            <AntButton
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() =>
                                                    handleRemoveTable(tabela.id)
                                                }
                                            />
                                        </div>

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
                                                                setSelectedLoja(
                                                                    {
                                                                        id:
                                                                            filialSelecionada.idempresa ||
                                                                            0,
                                                                        loja: filialSelecionada.loja,
                                                                        nome: filialSelecionada.nome,
                                                                    }
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
