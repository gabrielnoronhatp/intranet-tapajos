'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import { Input, Select, Table, message, Radio } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchCampaignById,
    updateCampaign,
    setCurrentCampaign,
    updateField,
    fetchProducts,
    fetchOperators,
    fetchFiliais,
} from '@/hooks/slices/trade/tradeSlice';
import { RootState } from '@/hooks/store';
import { debounce } from 'lodash';
import { useParams, useRouter } from 'next/navigation';

const { Option } = Select;

export default function CampaignEdit() {
    const dispatch = useDispatch();
    const { currentCampaign, products, operators, filiais } = useSelector(
        (state: RootState) => state.trade
    );
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [operadores, setOperadores] = useState<any>([]);
    const [marcaProdutos, setMarcaProdutos] = useState<
        Array<{ nome: string; codprod: string; descricao: string }>
    >([]);
    const [tipoOperador, setTipoOperador] = useState('teleoperador');
    const [tipoMarcaProduto, setTipoMarcaProduto] = useState('marca');
    const [productName, setProductName] = useState('');
    const [selectedOperador, setSelectedOperador] = useState('');
    const [meta, setMeta] = useState('');
    const [premiacao, setPremiacao] = useState('');
    const [campaignName, setCampaignName] = useState('');
    const [filial, setFilial] = useState('');
    const [tipoMeta, setTipoMeta] = useState('VALOR');
    const [meta_valor, setMetaValor] = useState('');
    const user = useSelector((state: RootState) => state.auth.user);
    const params = useParams();
    const campaignId = params?.campaignId as string;
    const [datainicial, setDatainicial] = useState('');
    const [datafinal, setDatafinal] = useState('');
    const [valorTotal, setValorTotal] = useState(0);

    useEffect(() => {
        if (campaignId) {
            dispatch(fetchCampaignById(campaignId) as any);
            dispatch(fetchFiliais('') as any);
        }
    }, [dispatch, campaignId]);

    useEffect(() => {
        if (currentCampaign) {
            setCampaignName(currentCampaign.campanha?.nome || '');
            setFilial(currentCampaign.campanha?.filial || '');
            setDatainicial(currentCampaign.campanha?.datainicial || '');
            setDatafinal(currentCampaign.campanha?.datafinal || '');
            setValorTotal(currentCampaign.campanha?.valor_total || 0);
            setOperadores(currentCampaign.participantes);
            setMetaValor(currentCampaign.campanha?.meta_valor);
            setMarcaProdutos(currentCampaign.itens);
            setTipoMeta(currentCampaign.campanha?.tipoMeta);
        }
    }, [currentCampaign]);

    const handleAddOperador = () => {
        if (selectedOperador && meta_valor && premiacao) {
            const idparticipante =
                tipoOperador === 'teleoperador'
                    ? operators.find((op) => op.nome === selectedOperador)
                          ?.matricula
                    : operators.find((op) => op.nome === selectedOperador)
                          ?.codusur;

            if (!idparticipante) {
                message.error('Operador não encontrado!');
                return;
            }

            const participante = {
                modelo:
                    tipoOperador === 'teleoperador' ? 'teleoperador' : 'RCA',
                meta: tipoMeta,
                idparticipante,
                meta_valor: parseFloat(meta_valor),
                meta_quantidade: meta_valor,
                premiacao,
                tipo_meta: tipoMeta,
            };

            setOperadores([
                ...operadores,
                { ...participante, nome: selectedOperador, tipo: tipoOperador },
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
            setProductName('');
        } else {
            message.error('Preencha o nome antes de adicionar!');
        }
    };

    const handleRemoveOperador = (index: number) => {
        setOperadores(operadores.filter((_: any, i: any) => i !== index));
    };

    const handleRemoveMarcaProduto = (index: number) => {
        setMarcaProdutos(marcaProdutos.filter((_: any, i: any) => i !== index));
    };

    const handleSearchOperador = (searchTerm: string) => {
        if (searchTerm) {
            const type =
                tipoOperador === 'teleoperador' ? 'teleoperador' : 'vendedor';
            dispatch(fetchOperators({ productName: searchTerm, type }) as any);
        } else {
            message.error('Digite o nome para buscar!');
        }
    };

    const handleSearchProduto = useCallback(
        debounce((searchTerm: string) => {
            dispatch(
                fetchProducts({
                    productName: searchTerm,
                    type: tipoMarcaProduto,
                }) as any
            );
        }, 300),
        [dispatch, tipoMarcaProduto]
    );

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleUpdateCampaign = async () => {
        const campaignData = {
            nome: campaignName,
            filial,
            datainicial: formatDate(datainicial),
            datafinal: formatDate(datafinal),
            valor_total: valorTotal,
            userlanc: user?.username,
            datalanc: formatDate(new Date().toISOString()),
            status: true,
            participantes: operadores.map((op: any) => ({
                modelo: op.modelo,
                meta: tipoMeta,
                idparticipante: op.idparticipante,
                meta_valor: op.meta_valor.toString(),
                meta_quantidade: op.meta_quantidade,
                premiacao: op.premiacao,
            })),
            itens: marcaProdutos.map((produto) => ({
                metrica: tipoMarcaProduto,
                iditem: produto.codprod,
            })),
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
                updateCampaign({
                    id: campaignId as string,
                    data: campaignData,
                }) as any
            );
            message.success('Campanha atualizada com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar campanha:', error);
            message.error('Erro ao atualizar campanha');
        }
    };

    const handleSetState = (field: any, value: any) => {
        dispatch(setCurrentCampaign({ [field]: value }));
    };

    const handleSearchFilial = (value: string) => {
        dispatch(fetchFiliais(value) as any);
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
                        Edição de Campanhas Trade Marketing
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
                                value={filial}
                                onChange={(value) => setFilial(value)}
                                onSearch={handleSearchFilial}
                                filterOption={false}
                            >
                                {filiais.map((filial: any) => (
                                    <Option
                                        key={filial.idempresa}
                                        value={filial.idempresa}
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
                                    onSelect={(value: string, option: any) => {
                                        setSelectedOperador(option.label);
                                    }}
                                    options={operators.map((operator: any) => ({
                                        value:
                                            tipoOperador === 'teleoperador'
                                                ? operator.matricula
                                                : operator.codusur,
                                        label: operator.nome,
                                    }))}
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
                                    onChange={(e) =>
                                        setMetaValor(e.target.value)
                                    }
                                />
                                <Input
                                    placeholder="Premiação"
                                    className="flex-1"
                                    value={premiacao}
                                    onChange={(e) =>
                                        setPremiacao(e.target.value)
                                    }
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
                                        dataIndex: 'meta_valor',
                                        key: 'meta_valor',
                                    },
                                    {
                                        title: 'Premiação',
                                        dataIndex: 'premiacao',
                                        key: 'premiacao',
                                    },
                                    {
                                        title: 'Tipo',
                                        dataIndex: 'modelo',
                                        key: 'modelo',
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
                                    onSelect={(value: string, option: any) => {
                                        handleAddMarcaProduto(
                                            option.label,
                                            option.value,
                                            option.label
                                        );
                                    }}
                                    options={products?.map((product: any) => ({
                                        value:
                                            tipoMarcaProduto === 'produto'
                                                ? product.codprod
                                                : product.codmarca,
                                        label:
                                            tipoMarcaProduto === 'produto'
                                                ? product.descricao
                                                : product.marca,
                                        codprod: product.codprod,
                                        descricao: product.descricao,
                                    }))}
                                />
                            </div>
                            <Table
                                dataSource={marcaProdutos}
                                columns={[
                                    {
                                        title: 'Código',
                                        dataIndex: 'iditem',
                                        key: 'iditem',
                                    },
                                    {
                                        title: 'Descrição',
                                        dataIndex: 'nome',
                                        key: 'nome',
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
                                    value={datainicial}
                                    onChange={(e) => setDatainicial(e.target.value)}
                                />
                                <Input
                                    type="date"
                                    className="flex-1"
                                    value={datafinal}
                                    onChange={(e) => setDatafinal(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded shadow">
                            <h2 className="text-lg font-bold text-green-600">
                                Valor da Meta Geral
                            </h2>
                            <Input
                                placeholder="Meta Geral"
                                value={valorTotal}
                                onChange={(e) => setValorTotal(Number(e.target.value))}
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <Button
                                className="bg-green-500 hover:bg-green-600"
                                onClick={handleUpdateCampaign}
                            >
                                Atualizar Campanha
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
