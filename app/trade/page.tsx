'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import { Input, Select, Table, message, Radio } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
    createCampaign,
    setCurrentCampaign,
    fetchFiliais,
    fetchOperators,
    fetchProductsByType,
} from '@/hooks/slices/trade/tradeSlice';
import { AppDispatch, RootState } from '@/hooks/store';
import { debounce } from 'lodash';
import { MetaTable } from '@/components/trade/meta-table';
import { formatDateUTC } from '@/lib/utils';

import { IFilial } from '@/types/noPaper/Supplier/SupplierType';
import { Operador } from '@/types/Trade/IOperator';
import { Escala, IEscala } from '@/types/Trade/IEscala';
import { ICampaign } from '@/types/Trade/ICampaign';
import { IProduct } from '@/types/Trade/IProduct';

const { Option } = Select;

export default function CampaignRegistration() {
    const dispatch = useDispatch<AppDispatch>();

    const { currentCampaign, operators, filiais, products } = useSelector(
        (state: RootState) => state.trade
    );
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [operadores, setOperadores] = useState<Operador[]>([]);

    const [marcaProdutos, setMarcaProdutos] = useState<
        Array<{ nome: string; codprod: string; descricao: string }>
    >([]);
    const [tipoOperador, setTipoOperador] = useState('teleoperador');
    const [tipoMarcaProduto, setTipoMarcaProduto] = useState('marca');
    const [productName, setProductName] = useState('');
    const [selectedOperador, setSelectedOperador] = useState('');
    const [premiacao, setPremiacao] = useState('');
    const [campaignName, setCampaignName] = useState('');
    const [idempresa, setIdempresa] = useState('');
    const [tipoMeta, setTipoMeta] = useState('VALOR');
    const [meta_valor, setMetaValor] = useState('');
    const user = useSelector((state: RootState) => state.auth.user);
    const [escalaData, setEscalaData] = useState<Escala[]>([]);

    useEffect(() => {
        dispatch(fetchFiliais());
    }, [productName]);

    const handleAddOperador = () => {
        if (selectedOperador && meta_valor && premiacao) {
            const idparticipante =
                tipoOperador === 'teleoperador'
                    ? operators?.find(
                          (op: Operador) => op.nome === selectedOperador
                      )?.matricula
                    : operators?.find(
                          (op: Operador) => op.nome === selectedOperador
                      )?.codusur;

            if (!idparticipante) {
                message.error('Operador não encontrado!');
                return;
            }

            const participante = {
                modelo:
                    tipoOperador === 'teleoperador' ? 'teleoperador' : 'RCA',
                meta: tipoMeta,
                idparticipante,
                meta_valor: tipoMeta === 'VALOR' ? parseFloat(meta_valor) : 0,
                meta_quantidade:
                    tipoMeta === 'QUANTIDADE' ? parseFloat(meta_valor) : 0,
                premiacao,
                tipo_meta: tipoMeta,
            };

            setOperadores([
                ...operadores,
                {
                    ...participante,
                    nome: selectedOperador,
                    tipo: tipoOperador,
                    matricula: idparticipante,
                    codusur: idparticipante,
                },
            ]);
            setSelectedOperador('');
            setMetaValor('');
            setPremiacao('');
        } else {
            message.error('Preencha todos os campos antes de adicionar!');
        }
    };

    const handleAddMarcaProduto = (
        nome: string,
        codprod: string,
        descricao: string
    ) => {
        if (nome) {
            setMarcaProdutos([...marcaProdutos, { nome, codprod, descricao }]);
            setProductName(nome || '');
        } else {
            message.error('Preencha o nome antes de adicionar!');
        }
    };

    const handleRemoveOperador = (index: number) => {
        setOperadores(
            operadores.filter((_: Operador, i: number) => i !== index)
        );
    };

    const handleRemoveMarcaProduto = (index: number) => {
        setMarcaProdutos(
            marcaProdutos.filter(
                (
                    _: { nome: string; codprod: string; descricao: string },
                    i: number
                ) => i !== index
            )
        );
    };

    const handleSearchOperador = (searchTerm: string) => {
        if (searchTerm) {
            const type =
                tipoOperador === 'teleoperador' ? 'operador' : 'vendedor';
            dispatch(fetchOperators({ busca: searchTerm, type }));
        } else {
            message.error('Digite o nome para buscar!');
        }
    };
    const handleSearchProduto = useCallback(
        debounce((searchTerm: string) => {
            if (searchTerm) {
                const type =
                    tipoMarcaProduto === 'produto' ? 'produto' : 'marca';
                dispatch(fetchProductsByType({ busca: searchTerm, type }));
            } else {
                message.error('Digite o nome para buscar!');
            }
        }, 300),
        [dispatch, tipoMarcaProduto]
    );

    const handleEscalaSubmit = (formattedMetas: Escala[]) => {
        setEscalaData(formattedMetas as unknown as Escala[]);
    };

    const handleSaveCampaign = async () => {
        const campaignData = {
            nome: campaignName,
            idempresa,
            datainicial: formatDateUTC(currentCampaign?.datainicial || ''),
            datafinal: formatDateUTC(currentCampaign?.datafinal || ''),
            valor_total: currentCampaign?.valor_total,
            userlanc: user?.username,
            datalanc: formatDate(new Date().toISOString()),
            status: true,
            participantes: operadores.map((op: Operador) => ({
                modelo: op.modelo,
                nome: op.nome,
                meta: tipoMeta,
                idparticipante: op.idparticipante,
                meta_valor: op.meta_valor.toString(),
                meta_quantidade: op.meta_quantidade,
                premiacao: op.premiacao,
            })),
            itens: marcaProdutos.map((produto) => ({
                metrica: tipoMarcaProduto,
                iditem: produto.codprod,
                nome: produto.nome,
            })),
            escala: escalaData,
        };

        if (
            !campaignData.nome ||
            !campaignData.datainicial ||
            !campaignData.datafinal ||
            !campaignData.valor_total
        ) {
            console.error('Campos obrigatórios ausentes');
            return;
        }

        try {
            await dispatch(
                createCampaign(campaignData as unknown as ICampaign)
            );
            message.success('Campanha criada com sucesso!');
        } catch (error) {
            console.error('Erro ao criar campanha:', error);
            message.error('Erro ao criar campanha');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleSetState = (field: string, value: string) => {
        dispatch(setCurrentCampaign({ [field]: value }));
    };

    const handleSearchFilial = () => {
        dispatch(fetchFiliais());
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <Sidebar isOpen={isSidebarOpen} />

            <main
                className={`pt-16 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}
            >
                <div className="p-4">
                    <h1 className="text-xl font-bold text-green-600 mb-4">
                        Cadastro de Campanhas Trade Marketing
                    </h1>

                    <div className="max-w-3xl mx-auto space-y-4">
                        <div className="bg-white p-4 rounded shadow">
                            <h2 className="text-lg font-bold text-green-600">
                                Detalhes da Campanha
                            </h2>
                            <Input
                                placeholder="Nome da Campanha"
                                value={campaignName}
                                onChange={(e) =>
                                    setCampaignName(e.target.value)
                                }
                                className="mb-2"
                            />
                            <Select
                                showSearch
                                placeholder="Filial"
                                className="w-full mb-2"
                                value={idempresa}
                                onChange={(value) => setIdempresa(value)}
                                onSearch={handleSearchFilial}
                                filterOption={false}
                            >
                                {filiais?.map((filial: IFilial) => (
                                    <Option
                                        key={filial.fantasia}
                                        value={filial.fantasia}
                                    >
                                        {filial.fantasia}
                                    </Option>
                                ))}
                            </Select>
                        </div>

                        <div className="bg-white p-4 rounded shadow">
                            <h2 className="text-lg font-bold text-green-600">
                                Adicionar Teleoperador/Vendedor
                            </h2>
                            <div className="flex gap-2 mb-2">
                                <Radio.Group
                                    value={tipoOperador}
                                    onChange={(e) =>
                                        setTipoOperador(e.target.value)
                                    }
                                    className="flex space-x-4"
                                >
                                    <Radio
                                        value="teleoperador"
                                        id="teleoperador"
                                    />
                                    <label
                                        htmlFor="teleoperador"
                                        className="text-sm"
                                    >
                                        Teleoperador
                                    </label>
                                    <Radio value="vendedor" id="vendedor" />
                                    <label
                                        htmlFor="vendedor"
                                        className="text-sm"
                                    >
                                        Vendedor
                                    </label>
                                </Radio.Group>
                            </div>
                            <div className="flex gap-2 mb-2">
                                <Radio.Group
                                    value={tipoMeta}
                                    onChange={(e) =>
                                        setTipoMeta(e.target.value)
                                    }
                                    className="flex space-x-4"
                                >
                                    <Radio value="VALOR" id="valor" />
                                    <label htmlFor="valor" className="text-sm">
                                        Valor
                                    </label>
                                    <Radio value="QUANTIDADE" id="quantidade" />
                                    <label
                                        htmlFor="quantidade"
                                        className="text-sm"
                                    >
                                        Quantidade
                                    </label>
                                </Radio.Group>
                            </div>
                            <div className="flex gap-2 mb-2">
                                <Select
                                    showSearch
                                    className="flex-1"
                                    placeholder={`Buscar ${tipoOperador}...`}
                                    defaultActiveFirstOption={false}
                                    filterOption={false}
                                    onSearch={handleSearchOperador}
                                    onSelect={(_, option) => {
                                        setSelectedOperador(option.nome);
                                    }}
                                    options={(operators || []).map(
                                        (operator: Operador) => ({
                                            value:
                                                tipoOperador === 'teleoperador'
                                                    ? operator.matricula
                                                    : operator.codusur,
                                            label: operator.nome,
                                            nome: operator.nome,
                                        })
                                    )}
                                />
                            </div>
                            <div className="flex gap-2 mb-2">
                                <Input
                                    placeholder="Nome"
                                    className="flex-1"
                                    value={selectedOperador}
                                    onChange={(e) =>
                                        setSelectedOperador(e.target.value)
                                    }
                                    disabled
                                />
                                <Input
                                    placeholder="Meta"
                                    className="flex-1"
                                    value={meta_valor}
                                    onChange={(e) => {
                                        const inputValue = e.target.value;

                                        setMetaValor(inputValue);
                                    }}
                                />
                                <Input
                                    placeholder="Premiação"
                                    className="flex-1"
                                    value={premiacao}
                                    onChange={(e) => {
                                        const inputValue = e.target.value;

                                        setPremiacao(inputValue);
                                    }}
                                />
                                <Button
                                    className="bg-green-500 hover:bg-green-600"
                                    onClick={handleAddOperador}
                                >
                                    Adicionar
                                </Button>
                            </div>
                            <Table
                                dataSource={operadores}
                                columns={[
                                    {
                                        title: 'Nome',
                                        dataIndex: 'nome',
                                        key: 'nome',
                                    },
                                    {
                                        title: 'Meta',
                                        key: 'meta',
                                        render: (record: Operador) => {
                                            const value =
                                                record.tipo_meta === 'VALOR'
                                                    ? record.meta_valor
                                                    : record.meta_quantidade;
                                            return parseFloat(
                                                value.toString()
                                            ).toLocaleString('pt-BR');
                                        },
                                    },
                                    {
                                        title: 'Premiação',
                                        dataIndex: 'premiacao',
                                        key: 'premiacao',
                                        render: (text: string) =>
                                            parseFloat(
                                                text.toString()
                                            ).toLocaleString('pt-BR'),
                                    },
                                    {
                                        title: 'Tipo',
                                        dataIndex: 'tipo',
                                        key: 'tipo',
                                    },
                                    {
                                        title: 'Ação',
                                        key: 'acao',
                                        render: (_, __, index) => (
                                            <Button
                                                className="bg-red-500 hover:bg-red-600"
                                                onClick={() =>
                                                    handleRemoveOperador(index)
                                                }
                                            >
                                                Remover
                                            </Button>
                                        ),
                                    },
                                ]}
                                rowKey="idparticipante"
                                pagination={false}
                            />
                        </div>

                        <div className="bg-white p-4 rounded shadow">
                            <h2 className="text-lg font-bold text-green-600">
                                Adicionar Marca/Produto
                            </h2>

                            <div className="flex gap-2 mb-2">
                                <Radio.Group
                                    value={tipoMarcaProduto}
                                    onChange={(e) =>
                                        setTipoMarcaProduto(e.target.value)
                                    }
                                    className="flex space-x-4"
                                >
                                    <Radio value="marca" id="marca" />
                                    <label htmlFor="marca" className="text-sm">
                                        Marca
                                    </label>
                                    <Radio value="produto" id="produto" />
                                    <label
                                        htmlFor="produto"
                                        className="text-sm"
                                    >
                                        Produto
                                    </label>
                                </Radio.Group>
                            </div>
                            <div className="flex gap-2 mb-2">
                                <Select
                                    showSearch
                                    className="flex-1"
                                    placeholder={`Buscar ${tipoMarcaProduto}...`}
                                    defaultActiveFirstOption={false}
                                    filterOption={false}
                                    onSearch={handleSearchProduto}
                                    onSelect={(_, option) => {
                                        handleAddMarcaProduto(
                                            option.label as string,
                                            option.value as string,
                                            option.label as string
                                        );
                                    }}
                                    options={(products || []).map(
                                        (product: IProduct) => ({
                                            value:
                                                tipoMarcaProduto === 'produto'
                                                    ? product.codprod
                                                    : product.codmarca,
                                            label:
                                                tipoMarcaProduto === 'produto'
                                                    ? product.descricao
                                                    : product.marca,
                                        })
                                    )}
                                />
                            </div>
                            <Table
                                dataSource={marcaProdutos}
                                columns={[
                                    {
                                        title: 'Código',
                                        dataIndex: 'codprod',
                                        key: 'codprod',
                                    },
                                    {
                                        title: 'Descrição',
                                        dataIndex: 'descricao',
                                        key: 'descricao',
                                    },
                                    {
                                        title: 'Ação',
                                        key: 'acao',
                                        render: (_, __, index) => (
                                            <Button
                                                className="bg-red-500 hover:bg-red-600"
                                                onClick={() =>
                                                    handleRemoveMarcaProduto(
                                                        index
                                                    )
                                                }
                                            >
                                                Remover
                                            </Button>
                                        ),
                                    },
                                ]}
                                rowKey="nome"
                                pagination={false}
                            />
                        </div>

                        <div className="bg-white p-4 rounded shadow">
                            <h2 className="text-lg font-bold text-green-600">
                                Período da Campanha
                            </h2>
                            <div className="flex gap-2">
                                <Input
                                    type="date"
                                    className="flex-1"
                                    value={currentCampaign?.datainicial}
                                    onChange={(e) =>
                                        handleSetState(
                                            'datainicial',
                                            e.target.value
                                        )
                                    }
                                />
                                <Input
                                    type="date"
                                    className="flex-1"
                                    value={currentCampaign?.datafinal}
                                    onChange={(e) =>
                                        handleSetState(
                                            'datafinal',
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded shadow">
                            <h2 className="text-lg font-bold text-green-600">
                                Valor da Meta Geral
                            </h2>
                            <Input
                                placeholder="Meta Geral"
                                value={currentCampaign?.valor_total}
                                onChange={(e) => {
                                    const inputValue = e.target.value;

                                    handleSetState('valor_total', inputValue);
                                }}
                            />
                        </div>

                        <div className="bg-white p-4 rounded shadow">
                            <h2 className="text-lg font-bold text-green-600">
                                Escala
                            </h2>
                            <MetaTable
                                isEditing={true}
                                onEscalaSubmit={(formattedMetas: IEscala[]) => {
                                    handleEscalaSubmit(
                                        formattedMetas as unknown as Escala[]
                                    );
                                }}
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button
                                className="bg-green-500 hover:bg-green-600"
                                onClick={handleSaveCampaign}
                            >
                                Salvar Campanha
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
