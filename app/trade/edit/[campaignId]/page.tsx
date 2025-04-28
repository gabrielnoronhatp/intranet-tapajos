'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import { Input, Select, Table, message, Radio, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchCampaignById,
    updateCampaign,
    fetchProductsByType,
    fetchFiliais,
    fetchOperators,
    deleteParticipantFromCampaign,
    deleteItemFromCampaign,
    updateParticipant,
} from '@/hooks/slices/trade/tradeSlice';
import { RootState, AppDispatch } from '@/hooks/store';
import { debounce } from 'lodash';
import { useParams } from 'next/navigation';
import { MetaTable } from '@/components/trade/meta-table';
import { formatDate } from '@/lib/utils';
import { formatDateUTC } from '@/lib/utils';
import { IValorMeta, ICampaign } from '@/types/Trade/ICampaign';

import { IFilial } from '@/types/noPaper/Supplier/SupplierType';
import { Operador } from '@/types/Trade/IOperator';
import { IProduct } from '@/types/Trade/IProduct';
import { IParticipants } from '@/types/Trade/IParticipants';
import { IEscala } from '@/types/Trade/IEscala';

const { Option } = Select;

export default function CampaignEdit() {
    const dispatch = useDispatch<AppDispatch>();
    const { currentCampaign, products, operators, filiais } = useSelector(
        (state: RootState) => state.trade
    );
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [operadores, setOperadores] = useState<IParticipants[]>([]);
    const [marcaProdutos, setMarcaProdutos] = useState<IProduct[]>([]);
    const [tipoOperador, setTipoOperador] = useState('teleoperador');
    const [tipoMarcaProduto, setTipoMarcaProduto] = useState('marca');
    const [productName, setProductName] = useState('');
    const [selectedOperador, setSelectedOperador] = useState('');
    const [premiacao, setPremiacao] = useState('');
    const [campaignName, setCampaignName] = useState('');
    const [idempresa, setIdempresa] = useState<number | string>('');
    const [tipoMeta, setTipoMeta] = useState('VALOR');
    const [meta_valor, setMetaValor] = useState<number | string>('');
    const user = useSelector((state: RootState) => state.auth.user);
    const params = useParams();
    const campaignId = params?.campaignId as string;
    const [datainicial, setDatainicial] = useState('');
    const [datafinal, setDatafinal] = useState('');
    const [valorTotal, setValorTotal] = useState<number | string>(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [participantToDelete, setParticipantToDelete] =
        useState<IParticipants | null>(null);
    const [isItemModalVisible, setIsItemModalVisible] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const [escalaProcessada, setEscalaProcessada] = useState<IEscala | null>(
        null
    );
    const [escalaData, setEscalaData] = useState<IEscala[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingParticipant, setEditingParticipant] =
        useState<IParticipants | null>(null);

    useEffect(() => {
        if (campaignId) {
            dispatch(fetchCampaignById(campaignId));
            dispatch(fetchFiliais());
        }
    }, [dispatch, campaignId, productName]);

    useEffect(() => {
        if (currentCampaign) {
            setCampaignName(currentCampaign.campanha?.nome || '');
            setIdempresa(currentCampaign.campanha?.idempresa || '');

            setDatainicial(currentCampaign.campanha?.datainicial || '');
            setDatafinal(currentCampaign.campanha?.datafinal || '');
            setValorTotal(currentCampaign.campanha?.valor_total || 0);
            setOperadores(currentCampaign.participantes || []);
            setMetaValor(currentCampaign.campanha?.meta_valor || '');
            setMarcaProdutos(currentCampaign.itens || []);
            setTipoMeta(currentCampaign.campanha?.tipo_meta || 'VALOR');

            if (currentCampaign.escala && currentCampaign.escala.length > 0) {
                const escalaData = currentCampaign.escala;
                let metaGeralRange: string[] = [];
                let metaVendedorRange: string[] = [];
                let valoresMeta: IValorMeta[] = [];

                const primeiraLinha = escalaData.find(
                    (item: IEscala) => item.linha === ''
                );
                if (primeiraLinha) {
                    const usesCol = Object.keys(primeiraLinha).some(
                        (key) =>
                            key.startsWith('col') && !key.startsWith('coluna')
                    );
                    const columnPrefix = usesCol ? 'col' : 'coluna';

                    metaVendedorRange = Object.keys(primeiraLinha)
                        .filter((key) => key.startsWith(columnPrefix))
                        .map((key) => primeiraLinha[key]);
                }

                const outrasLinhas = escalaData.filter(
                    (item: IEscala) =>
                        item.linha !== '' && item.linha !== undefined
                );
                metaGeralRange = outrasLinhas
                    .map((item: IEscala) => item.linha)
                    .filter(
                        (linha) => linha !== undefined && linha !== null
                    ) as string[];

                valoresMeta = [];
                outrasLinhas.forEach((linha: IEscala, idxLinha: number) => {
                    metaVendedorRange.forEach((_, idxCol: number) => {
                        const usesCol = Object.keys(linha).some(
                            (key) =>
                                key.startsWith('col') &&
                                !key.startsWith('coluna')
                        );
                        const columnPrefix = usesCol ? 'col' : 'coluna';

                        const colKey = `${columnPrefix}${idxCol + 1}`;
                        if (linha[colKey] !== undefined) {
                            valoresMeta.push({
                                idMetaGeral: idxLinha + 1,
                                idMetaVendedor: idxCol + 1,
                                celValordaMeta: parseFloat(linha[colKey]),
                            });
                        }
                    });
                });

                setEscalaProcessada({
                    metaGeralRange,
                    metaVendedorRange,
                    valoresMeta,
                });
            }
        }
    }, [currentCampaign]);

    const handleAddOperador = () => {
        if (!tipoMeta) {
            message.error(
                'Por favor, selecione uma métrica antes de adicionar um operador.'
            );
            return;
        }

        if (isEditing && editingParticipant) {
            const metaValorNumber = parseFloat(String(meta_valor));

            const updatedParticipant: Partial<IParticipants> = {
                meta: tipoMeta,
                meta_valor: tipoMeta === 'VALOR' ? metaValorNumber : 0,
                meta_quantidade:
                    tipoMeta === 'QUANTIDADE' ? metaValorNumber : 0,
                premiacao: String(premiacao),
                tipo_meta: tipoMeta,
                idcampanha_distribuicao: Number(campaignId),
                modelo: editingParticipant.modelo,
                idparticipante: editingParticipant.idparticipante,
                nome: editingParticipant.nome,
                tipo: editingParticipant.tipo,
                label: editingParticipant.label,
                metrica: tipoMeta,
            };

            // Log para debug
           

            dispatch(
                updateParticipant({
                    campaignId,
                    participantId: editingParticipant.idparticipante,
                    participantData: updatedParticipant,
                })
            )
                .unwrap()
                .then(() => {
                    message.success('Participante atualizado com sucesso!');
                    setSelectedOperador('');
                    setMetaValor('');
                    setPremiacao('');
                    setIsEditing(false);
                    setEditingParticipant(null);
                })
                .catch((error) => {
                    message.error(
                        `Erro ao atualizar participante: ${error.message}`
                    );
                });
            return;
        }

        if (selectedOperador && meta_valor && premiacao) {
            const operatorFound =
                tipoOperador === 'teleoperador'
                    ? operators?.find(
                          (op: Operador) => op.nome === selectedOperador
                      )
                    : operators?.find(
                          (op: Operador) => op.nome === selectedOperador
                      );

            if (!operatorFound) {
                message.error('Operador não encontrado!');
                return;
            }

            const idparticipante =
                tipoOperador === 'teleoperador'
                    ? Number(operatorFound.matricula)
                    : Number(operatorFound.codusur);

            const metaValorNumber = parseFloat(String(meta_valor));

            const participante: Partial<IParticipants> = {
                modelo:
                    tipoOperador === 'teleoperador' ? 'teleoperador' : 'RCA',
                meta: tipoMeta,
                idparticipante,
                meta_valor: tipoMeta === 'VALOR' ? metaValorNumber : 0,
                meta_quantidade:
                    tipoMeta === 'QUANTIDADE' ? metaValorNumber : 0,
                premiacao,
                tipo_meta: tipoMeta,
                nome: selectedOperador,
                tipo: tipoOperador,
                id: 0,
                label: selectedOperador,
                idcampanha_distribuicao: 0,
                metrica: tipoMeta,
            };

           
            setOperadores([...operadores, participante as IParticipants]);
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
        descricao: string,
        iditem: number,
        codmarca: number
    ) => {
        if (nome) {
            const newProduct: IProduct = {
                iditem: iditem,
                nome,
                codprod,
                descricao,
                id: iditem,
                codmarca: String(codmarca),
                metrica: tipoMarcaProduto,
                label: nome,
                value: codprod,
                marca: nome,
            };

            setMarcaProdutos([...marcaProdutos, newProduct]);
            setProductName('');
        } else {
            message.error('Preencha o nome antes de adicionar!');
        }
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
            dispatch(
                fetchProductsByType({
                    busca: searchTerm,
                    type: tipoMarcaProduto as 'produto' | 'marca',
                })
            );
        }, 300),
        [dispatch, tipoMarcaProduto]
    );

    const handleUpdateCampaign = async () => {
        const campaignData: Partial<ICampaign> = {
            nome: campaignName,
            idempresa: idempresa,
            datainicial: formatDateUTC(datainicial),
            datafinal: formatDateUTC(datafinal),
            valor_total: Number(valorTotal),
            meta_valor: Number(meta_valor),
            tipo_meta: tipoMeta,
            userlanc: user?.username || '',
            datalanc: formatDate(new Date().toISOString()),
            status: 'active',
            participantes: operadores,
            itens: marcaProdutos,
            escala: escalaData,
            id: Number(campaignId),
            idcampanha_distribuicao:
                currentCampaign?.campanha?.idcampanha_distribuicao || 0,
        };

        const camposAusentes = [];
        if (!campaignData.nome) camposAusentes.push('Nome da campanha');
        if (!campaignData.datainicial) camposAusentes.push('Data inicial');
        if (!campaignData.datafinal) camposAusentes.push('Data final');
        if (!campaignData.valor_total) camposAusentes.push('Valor total');
        if (!campaignData.idempresa) camposAusentes.push('Filial (idempresa)');

        if (camposAusentes.length > 0) {
            message.error(
                `Campos obrigatórios ausentes: ${camposAusentes.join(', ')}`
            );
            return;
        }

        try {
            const payload = {
                id: campaignId,
                data: {
                    ...campaignData,
                    operators: [],
                    campaigns: [],
                    products: [],
                    filiais: [],
                    campanha: {} as ICampaign,
                } as ICampaign,
            };

            await dispatch(updateCampaign(payload));
            message.success('Campanha atualizada com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar campanha:', error);
            message.error('Erro ao atualizar campanha');
        }
    };

    const handleSearchFilial = () => {
        dispatch(fetchFiliais());
    };

    const showDeleteConfirm = (participant: IParticipants) => {
        setParticipantToDelete(participant);
        setIsModalVisible(true);
    };

    const handleDeleteParticipant = () => {
        if (participantToDelete) {
            dispatch(
                deleteParticipantFromCampaign({
                    campaignId,
                    participantId: participantToDelete.idparticipante,
                })
            );
            setOperadores(
                operadores.filter(
                    (op: IParticipants) =>
                        op.idparticipante !== participantToDelete.idparticipante
                )
            );
            setIsModalVisible(false);
            setParticipantToDelete(null);
        }
    };

    const showDeleteItemConfirm = (itemId: number) => {
        setItemToDelete(itemId);
        setIsItemModalVisible(true);
    };

    const handleConfirmDeleteItem = () => {
        if (itemToDelete !== null) {
            dispatch(
                deleteItemFromCampaign({
                    campaignId,
                    id: itemToDelete,
                })
            )
                .then(() => {
                    setMarcaProdutos(
                        marcaProdutos.filter(
                            (item: IProduct) => item.id !== itemToDelete
                        )
                    );
                    setIsItemModalVisible(false);
                    setItemToDelete(null);
                })
                .catch((error: unknown) => {
                    console.error('Erro ao remover item:', error);
                    message.error('Erro ao remover item');
                });
        }
    };

    const handleCancelDelete = () => {
        setIsModalVisible(false);
        setParticipantToDelete(null);
    };

    const handleCancelDeleteItem = () => {
        setIsItemModalVisible(false);
        setItemToDelete(null);
    };

    const handleEscalaSubmit = (formattedMetas: IEscala[]) => {
        setEscalaData(formattedMetas);
    };

    const handleEditParticipant = (participant: IParticipants) => {
        setIsEditing(true);
        setEditingParticipant(participant);
        setSelectedOperador(participant.nome);
        setTipoOperador(
            participant.modelo === 'teleoperador' ? 'teleoperador' : 'vendedor'
        );
        setTipoMeta(participant.tipo_meta || 'VALOR');
        setMetaValor(
            participant.tipo_meta === 'VALOR'
                ? participant.meta_valor
                : participant.meta_quantidade
        );
        setPremiacao(participant.premiacao);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditingParticipant(null);
        setSelectedOperador('');
        setMetaValor('');
        setPremiacao('');
    };

    useEffect(() => {
    }, [filiais]);

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
                                value={idempresa}
                                onChange={(value) => {
                                    setIdempresa(value);
                                }}
                                onSearch={handleSearchFilial}
                                filterOption={false}
                            >
                                {(filiais || []).map((filial: IFilial) => {
                                    return (
                                        <Option
                                            key={filial.fantasia}
                                            value={filial.fantasia}
                                        >
                                            {filial.fantasia}
                                        </Option>
                                    );
                                })}
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
                                    onSelect={(
                                        value,
                                        option: { value: string; label: string }
                                    ) => {
                                        setSelectedOperador(option.label);
                                    }}
                                    options={(operators || []).map(
                                        (operator: Operador) => ({
                                            value:
                                                tipoOperador === 'teleoperador'
                                                    ? operator.matricula
                                                    : operator.codusur,
                                            label: operator.nome,
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
                                        const formattedValue =
                                            inputValue.replace(',', '.');
                                        setMetaValor(formattedValue);
                                    }}
                                />
                                <Input
                                    placeholder="Premiação"
                                    className="flex-1"
                                    value={premiacao}
                                    onChange={(e) => {
                                        const inputValue = e.target.value;
                                        const formattedValue =
                                            inputValue.replace(',', '.');
                                        setPremiacao(formattedValue);
                                    }}
                                />
                                <Button
                                    className="bg-green-500 hover:bg-green-600"
                                    onClick={handleAddOperador}
                                >
                                    {isEditing ? 'Atualizar' : 'Adicionar'}
                                </Button>
                                {isEditing && (
                                    <Button
                                        className="bg-gray-400 hover:bg-gray-500"
                                        onClick={handleCancelEdit}
                                    >
                                        Cancelar
                                    </Button>
                                )}
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
                                        render: (record: IParticipants) => {
                                            const value =
                                                record.tipo_meta === 'VALOR'
                                                    ? record.meta_valor
                                                    : record.meta_quantidade;

                                            return value !== undefined
                                                ? value.toLocaleString('pt-BR')
                                                : '0';
                                        },
                                    },
                                    {
                                        title: 'Premiação',
                                        dataIndex: 'premiacao',
                                        key: 'premiacao',
                                        render: (text: string) =>
                                            parseFloat(text).toLocaleString(
                                                'pt-BR'
                                            ),
                                    },
                                    {
                                        title: 'Tipo',
                                        dataIndex: 'modelo',
                                        key: 'modelo',
                                    },
                                    {
                                        title: 'Ação',
                                        key: 'acao',
                                        render: (_, record) => (
                                            <div className="flex space-x-2">
                                                <Button
                                                    className="bg-blue-500 hover:bg-blue-600 p-1"
                                                    onClick={() =>
                                                        handleEditParticipant(
                                                            record
                                                        )
                                                    }
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="w-4 h-4"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                                        />
                                                    </svg>
                                                </Button>
                                                <Button
                                                    className="bg-red-500 hover:bg-red-600"
                                                    onClick={() =>
                                                        showDeleteConfirm(
                                                            record
                                                        )
                                                    }
                                                >
                                                    Remover
                                                </Button>
                                            </div>
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
                                    onSelect={(
                                        value: string,
                                        option: IProduct
                                    ) => {
                                        handleAddMarcaProduto(
                                            option.label,
                                            String(option.value),
                                            option.label,
                                            Number(option.value),
                                            Number(option.value)
                                        );
                                    }}
                                    options={(products || []).map(
                                        (product: IProduct) =>
                                            ({
                                                value:
                                                    tipoMarcaProduto ===
                                                    'produto'
                                                        ? product.codprod
                                                        : product.codmarca,
                                                label:
                                                    tipoMarcaProduto ===
                                                    'produto'
                                                        ? product.descricao
                                                        : product.marca,
                                                codprod: product.codprod,
                                                descricao: product.descricao,
                                            }) as IProduct
                                    )}
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
                                        render: (_, record: IProduct) => (
                                            <Button
                                                className="bg-red-500 hover:bg-red-600"
                                                onClick={() =>
                                                    showDeleteItemConfirm(
                                                        record.id
                                                    )
                                                }
                                            >
                                                Remover
                                            </Button>
                                        ),
                                    },
                                ]}
                                rowKey="iditem"
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
                                    onChange={(e) =>
                                        setDatainicial(e.target.value)
                                    }
                                />
                                <Input
                                    type="date"
                                    className="flex-1"
                                    value={datafinal}
                                    onChange={(e) =>
                                        setDatafinal(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded shadow">
                            <h2 className="text-lg font-bold text-green-600">
                                Valor da Meta Geral
                            </h2>
                            <Input
                                type="number"
                                placeholder="Meta Geral"
                                value={valorTotal}
                                onChange={(e) => {
                                    const inputValue = e.target.value;

                                    setValorTotal(Number(inputValue));
                                }}
                            />
                        </div>

                        <div className="bg-white p-4 rounded shadow">
                            <h2 className="text-lg font-bold text-green-600">
                                Escala
                            </h2>
                            <MetaTable
                                isEditing={true}
                                campaignId={campaignId}
                                escala={
                                    escalaProcessada && {
                                        metaGeralRange:
                                            escalaProcessada.metaGeralRange ||
                                            [],
                                        metaVendedorRange:
                                            escalaProcessada.metaVendedorRange ||
                                            [],
                                        valoresMeta:
                                            escalaProcessada.valoresMeta || [],
                                    }
                                }
                                onEscalaSubmit={handleEscalaSubmit}
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

            <Modal
                title="Confirmar Remoção de Participante"
                visible={isModalVisible}
                onOk={handleDeleteParticipant}
                onCancel={handleCancelDelete}
                okText="Sim"
                cancelText="Não"
                okButtonProps={{
                    style: { backgroundColor: 'green', borderColor: 'green' },
                }}
            >
                <p>Tem certeza de que deseja remover este participante?</p>
            </Modal>

            <Modal
                title="Confirmar Remoção de Item"
                visible={isItemModalVisible}
                onOk={handleConfirmDeleteItem}
                onCancel={handleCancelDeleteItem}
                okText="Sim"
                cancelText="Não"
                okButtonProps={{
                    style: { backgroundColor: 'green', borderColor: 'green' },
                }}
            >
                <p>Tem certeza de que deseja remover este item?</p>
            </Modal>
        </div>
    );
}
