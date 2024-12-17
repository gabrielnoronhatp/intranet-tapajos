"use client";

import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { SelectField } from "@/components/nopaper/select-field";
import { FormSection } from "@/components/nopaper/form-section";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFornecedores,
  fetchFiliais,
  fetchContasGerenciais,
  fetchCentrosCusto,
} from "@/hooks/slices/noPaperSlice";
import { CentroCusto } from "@/types/Order/CentroCustoType";
import {
  submitOrder,
  prepareOrderData,
  setOrderState,
} from "@/hooks/slices/orderSlice";
import { FilialSelect } from "@/components/FilialSelect";
import { FornecedorSelect } from "@/components/FornecedorSelect";
import { Item } from "@/types/Order/OrderTypes";

export default function NoPaper() {
  const dispatch = useDispatch();

  const {
    isSidebarOpen,
    ramo,
    tipoLancamento,
    formaPagamento,
    open,
    selectedFornecedor,
    quantidadeProdutos,
    installments,
    installmentDates,
    valorTotal,
    isViewOpen,
    selectedFilial,
    filialOpen,
    notaFiscal,
    serie,
    valorImposto,
    observacao,
    user,
    dtavista,
    banco,
    agencia,
    conta,
    dtdeposito,
    tipopix,
    chavepix,
    datapix,
    contaOP,
  } = useSelector((state: any) => state.order);

  const {
    fornecedores,
    filiais,
    contasGerenciais,
    centrosCustoOptions,
    loading,
    error,
  } = useSelector((state: any) => state.noPaper);
  const orderData = useSelector((state: any) => state.order.orderData);
  const [itens, setItens] = useState<Item[]>([
    { descricao: "", valor: 0, centroCusto: [] },
  ]);
  const [centrosCusto, setCentrosCusto] = useState<CentroCusto[]>([
    { centroCusto: "", valor: 0 },
  ]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSetState = (field: keyof any, value: any) => {
    dispatch(setOrderState({ [field]: value }));
  };

  const handleQuantidadeProdutosChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const quantidade = parseInt(e.target.value, 10);
    handleSetState("quantidadeProdutos", quantidade);
    const newItens = Array.from(
      { length: quantidade },
      (_, index) => itens[index] || { descricao: "", valor: 0, centroCusto: [] }
    );
    setItens(newItens);
    calculateValorTotal(newItens);
  };

  const handleCentrosCustoNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const numCentros = parseInt(e.target.value, 10);
    if (numCentros < 1) {
      console.error("Número de centros de custo deve ser pelo menos 1.");
      return;
    }
    setCentrosCusto((prevCentrosCusto) => {
      const newCentrosCusto = Array.from(
        { length: numCentros },
        (_, index) => prevCentrosCusto[index] || { centroCusto: "", valor: 0 }
      );
      return newCentrosCusto;
    });
  };

  const handleCentrosCustoChange = (
    index: number,
    field: "centroCusto" | "valor",
    value: any
  ) => {
    setCentrosCusto((prevCentrosCusto) => {
      const newCentrosCusto = [...prevCentrosCusto];
      if (field === "centroCusto") {
        newCentrosCusto[index] = {
          ...newCentrosCusto[index],
          centroCusto: value as string,
        };
      } else {
        newCentrosCusto[index] = {
          ...newCentrosCusto[index],
          valor: value,
        };
      }
      return newCentrosCusto;
    });
  };

  const handleFormaPagamentoChange = (value: string) => {
    handleSetState("formaPagamento", value);
    if (value !== "boleto") {
      handleSetState("installments", 1);
      handleSetState("installmentDates", []);
    }
  };

  const handleInstallmentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numInstallments = parseInt(e.target.value, 10);
    handleSetState("installments", numInstallments);
    handleSetState("installmentDates", Array(numInstallments).fill(""));
  };

  const handleInstallmentDateChange = (index: number, date: string) => {
    const newDates = [...installmentDates];
    newDates[index] = date;
    handleSetState("installmentDates", newDates);
  };

  const handleItensChange = (
    index: number,
    field: "descricao" | "valor" | "centroCusto",
    value: string
  ) => {
    setItens((prevItens) => {
      const updatedItens = prevItens.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            [field]: field === "valor" ? parseFloat(value) : value,
          };
        }
        return item;
      });
      return updatedItens;
    });
  };

  const calculateValorTotal = (itensToCalculate = itens) => {
    const total = itensToCalculate.reduce(
      (acc: number, item: Item) => acc + (item.valor || 0),
      0
    );
    handleSetState("valorTotal", total - valorImposto);
  };

  const calculateProportionalCentrosCusto = () => {
    const totalItemValue = itens.reduce((acc, item) => acc + item.valor, 0);
    const valueToDistribute = totalItemValue - valorImposto;

    setCentrosCusto((prevCentrosCusto) => {
      return prevCentrosCusto.map((centro, index) => {
        const proportion = centro.valor / totalItemValue;
        return {
          ...centro,
          valor: proportion * valueToDistribute,
        };
      });
    });
  };

  const toggleView = () => {
    handleSetState("isViewOpen", !isViewOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    if (!ramo) newErrors.ramo = "O campo Ramo é obrigatório.";
    if (!tipoLancamento)
      newErrors.tipoLancamento = "O campo Tipo Lançamento é obrigatório.";
    if (!centrosCusto.length)
      newErrors.centrosCusto = "O campo Centro de Custo é obrigatório.";
    if (!formaPagamento)
      newErrors.formaPagamento = "O campo Forma de Pagamento é obrigatório.";
    if (!notaFiscal)
      newErrors.notaFiscal = "O campo Nota Fiscal é obrigatório.";
    if (!serie) newErrors.serie = "O campo Série é obrigatório.";
    if (!selectedFornecedor)
      newErrors.selectedFornecedor = "O campo Fornecedor é obrigatório.";
    if (!selectedFilial)
      newErrors.selectedFilial = "O campo Filial é obrigatório.";
    if (!quantidadeProdutos || quantidadeProdutos <= 0)
      newErrors.quantidadeProdutos =
        "O campo Quantidade de Produtos é obrigatório.";
    if (!itens.every((item) => item.descricao && item.valor > 0))
      newErrors.itens = "Todos os itens devem ter descrição e valor.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    dispatch(
      prepareOrderData({
        itens,
        centrosCusto,
        valorImposto,
        ramo,
        notaFiscal,
        installments,
        contaOP,
        selectedFornecedor,
        selectedFilial,
        serie,
        formaPagamento,
        quantidadeProdutos,
        dtavista,
        banco,
        agencia,
        conta,
        dtdeposito,
        installmentDates,
        observacao,
        tipopix,
        chavepix,
        datapix,
        tipoLancamento,
        user,
      })
    );

    if (orderData) {
      try {
        await dispatch(submitOrder(orderData) as any);
      } catch (error) {
        console.error("Erro ao enviar a ordem:", error);
      }
    }
  };

  const formattedOptions = centrosCustoOptions.map((item: any) => ({
    value: item.centrocusto,
    label: item.centrocusto,
  }));

  useEffect(() => {
    dispatch(fetchFornecedores() as any);
    dispatch(fetchFiliais() as any);
    dispatch(fetchContasGerenciais() as any);
    dispatch(fetchCentrosCusto() as any);
  }, [dispatch]);

  useEffect(() => {
    calculateProportionalCentrosCusto();
  }, [itens, valorImposto]);

  useEffect(() => {
    calculateValorTotal(itens);
  }, [itens, valorImposto]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        onToggleSidebar={() => handleSetState("isSidebarOpen", !isSidebarOpen)}
      />
      <Sidebar isOpen={isSidebarOpen} />

      <main
        className={`pt-16 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <div className="p-4">
          <h1 className="text-xl font-bold text-primary mb-4">
            Lançamento NoPaper
          </h1>

          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormSection title="Dados de Origem da Nota Fiscal">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <SelectField
                      label="Selecione o Ramo"
                      value={ramo}
                      onChange={(value: string) =>
                        handleSetState("ramo", value)
                      }
                      options={[
                        { value: "distribuicao", label: "DISTRIBUIÇÃO" },
                        { value: "varejo", label: "VAREJO" },
                      ]}
                    />
                    {errors.ramo && (
                      <p className="text-red-500 text-xs">{errors.ramo}</p>
                    )}

                    {ramo === "distribuicao" && (
                      <SelectField
                        label="Tipo Lançamento"
                        value={tipoLancamento}
                        onChange={(value: string) =>
                          handleSetState("tipoLancamento", value)
                        }
                        options={[
                          { value: "servico", label: "SERVIÇO" },
                          { value: "usoconsumo", label: "USO E CONSUMO" },
                        ]}
                      />
                    )}
                    {errors.tipoLancamento && (
                      <p className="text-red-500 text-xs">
                        {errors.tipoLancamento}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div>
                      <FilialSelect
                        loading={loading}
                        error={error}
                        filialOpen={filialOpen}
                        selectedFilial={selectedFilial}
                        filiais={filiais}
                        handleSetState={handleSetState}
                      />
                      {errors.selectedFilial && (
                        <p className="text-red-500 text-xs">
                          {errors.selectedFilial}
                        </p>
                      )}
                    </div>

                    <div>
                      <FornecedorSelect
                        open={open}
                        selectedFornecedor={selectedFornecedor}
                        fornecedores={fornecedores}
                        handleSetState={handleSetState}
                      />
                      {errors.selectedFornecedor && (
                        <p className="text-red-500 text-xs">
                          {errors.selectedFornecedor}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <Label className="text-xs font-semibold text-primary uppercase">
                      Número da Nota Fiscal
                    </Label>
                    <Input
                      placeholder="Nota"
                      value={notaFiscal}
                      onChange={(e) =>
                        handleSetState("notaFiscal", e.target.value)
                      }
                    />
                    {errors.notaFiscal && (
                      <p className="text-red-500 text-xs">
                        {errors.notaFiscal}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-primary uppercase">
                      Série
                    </Label>
                    <Input
                      placeholder="Serie"
                      value={serie}
                      onChange={(e) => handleSetState("serie", e.target.value)}
                    />
                    {errors.serie && (
                      <p className="text-red-500 text-xs">{errors.serie}</p>
                    )}
                  </div>
                </div>
              </FormSection>

              {/* Dados Financeiros */}
              <FormSection title="Dados Financeiros">
                <div className="space-y-2">
                  <SelectField
                    label="Escolha a Forma de Pagamento"
                    value={formaPagamento}
                    onChange={handleFormaPagamentoChange}
                    options={[
                      { value: "avista", label: "À VISTA" },
                      { value: "deposito", label: "DEPÓSITO" },
                      { value: "boleto", label: "BOLETO" },
                      { value: "pix", label: "PIX" },
                    ]}
                  />
                  {errors.formaPagamento && (
                    <p className="text-red-500 text-xs">
                      {errors.formaPagamento}
                    </p>
                  )}

                  {formaPagamento === "avista" && (
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-primary uppercase">
                        Data de Vencimento
                      </Label>
                      <Input
                        type="date"
                        value={dtavista}
                        onChange={(e) =>
                          handleSetState("dtavista", e.target.value)
                        }
                        className="form-control"
                      />
                    </div>
                  )}

                  {formaPagamento === "deposito" && (
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-primary uppercase">
                        Banco
                      </Label>
                      <Input
                        type="text"
                        value={banco}
                        onChange={(e) =>
                          handleSetState("banco", e.target.value)
                        }
                        placeholder="Banco"
                        className="form-control"
                      />
                      {errors.banco && (
                        <p className="text-red-500 text-xs">{errors.banco}</p>
                      )}
                      <Label className="text-xs font-semibold text-primary uppercase">
                        Agência
                      </Label>
                      <Input
                        type="text"
                        value={agencia}
                        onChange={(e) =>
                          handleSetState("agencia", e.target.value)
                        }
                        placeholder="Agência"
                        className="form-control"
                      />
                      {errors.agencia && (
                        <p className="text-red-500 text-xs">{errors.agencia}</p>
                      )}
                      <Label className="text-xs font-semibold text-primary uppercase">
                        Conta
                      </Label>
                      <Input
                        type="text"
                        value={conta}
                        onChange={(e) =>
                          handleSetState("conta", e.target.value)
                        }
                        placeholder="Conta"
                        className="form-control"
                      />
                      {errors.conta && (
                        <p className="text-red-500 text-xs">{errors.conta}</p>
                      )}
                      <Label className="text-xs font-semibold text-primary uppercase">
                        Data de Depósito
                      </Label>
                      <Input
                        type="date"
                        value={dtdeposito}
                        onChange={(e) =>
                          handleSetState("dtdeposito", e.target.value)
                        }
                        className="form-control"
                      />
                    </div>
                  )}

                  {formaPagamento === "boleto" && (
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-primary uppercase">
                        Número de Parcelas
                      </Label>
                      <Input
                        type="number"
                        value={installments}
                        onChange={handleInstallmentsChange}
                        min={1}
                        max={12}
                        className="form-control"
                      />
                      {Array.from({ length: installments }).map((_, index) => (
                        <div key={index} className="space-y-1">
                          <Label className="text-xs font-semibold text-primary uppercase">
                            Data de Vencimento {index + 1}
                          </Label>
                          <Input
                            type="date"
                            value={installmentDates[index]}
                            onChange={(e) =>
                              handleInstallmentDateChange(index, e.target.value)
                            }
                            className="form-control"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {formaPagamento === "pix" && (
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-primary uppercase">
                        Tipo de Chave PIX
                      </Label>
                      <SelectField
                        value={tipopix}
                        onChange={(value: string) =>
                          handleSetState("tipopix", value)
                        }
                        options={[
                          { value: "cpf/cnpj", label: "CPF/CNPJ" },
                          { value: "telefone", label: "Telefone" },
                          { value: "email", label: "E-mail" },
                          { value: "aleatoria", label: "Aleatória" },
                        ]}
                        label=""
                      />
                      <Label className="text-xs font-semibold text-primary uppercase">
                        Chave PIX
                      </Label>
                      <Input
                        type="text"
                        value={chavepix}
                        onChange={(e) =>
                          handleSetState("chavepix", e.target.value)
                        }
                        placeholder="Insira a Chave PIX"
                        className="form-control"
                      />
                      <Label className="text-xs font-semibold text-primary uppercase">
                        Data de Pagamento PIX
                      </Label>
                      <Input
                        type="date"
                        value={datapix}
                        onChange={(e) =>
                          handleSetState("datapix", e.target.value)
                        }
                        className="form-control"
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-primary uppercase">
                    Conta Gerencial
                  </Label>
                  <SelectField
                    value={contaOP}
                    onChange={(value: string) =>
                      handleSetState("contaOP", value)
                    }
                    options={contasGerenciais.map((conta: any) => ({
                      value: conta.conta,
                      label: conta.conta,
                    }))}
                    label=""
                  />
                </div>
                {errors.contaOP && (
                  <p className="text-red-500 text-xs">{errors.contaOP}</p>
                )}
              </FormSection>

              <FormSection title="Dados de itens e Imposto">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-primary uppercase">
                    Itens da Nota
                  </Label>
                  <Input
                    type="number"
                    value={quantidadeProdutos}
                    onChange={handleQuantidadeProdutosChange}
                    min={1}
                    className="form-control"
                  />
                  {errors.quantidadeProdutos && (
                    <p className="text-red-500 text-xs">
                      {errors.quantidadeProdutos}
                    </p>
                  )}
                  {itens.map((item: Item, index: number) => (
                    <div key={index} className="space-y-1">
                      <Label className="text-xs font-semibold text-primary uppercase">
                        Insira a Descrição e Valor do Item: {index + 1}
                      </Label>
                      <Input
                        type="text"
                        value={item.descricao}
                        onChange={(e) =>
                          handleItensChange(index, "descricao", e.target.value)
                        }
                        placeholder="Insira a Descrição do Item"
                        className="form-control"
                      />
                      {errors.itens && (
                        <p className="text-red-500 text-xs">{errors.itens}</p>
                      )}
                      <Input
                        type="number"
                        value={item.valor}
                        onChange={(e) =>
                          handleItensChange(index, "valor", e.target.value)
                        }
                        placeholder="Insira o Valor do Item"
                        min={0.01}
                        step={0.01}
                        className="form-control"
                      />
                      {errors.itens && (
                        <p className="text-red-500 text-xs">{errors.itens}</p>
                      )}
                    </div>
                  ))}

                  <Label className="text-xs font-semibold text-primary uppercase">
                    Valor do Imposto
                  </Label>
                  <Input
                    type="number"
                    value={valorImposto}
                    onChange={(e) =>
                      handleSetState("valorImposto", parseFloat(e.target.value))
                    }
                    min={0}
                    className="form-control"
                  />
                </div>
              </FormSection>

              {/* Centro de Custo */}
              <FormSection title="Centro de Custo">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-primary uppercase">
                    Número de Centros de Custo
                  </Label>
                  <Input
                    type="number"
                    value={centrosCusto.length}
                    onChange={handleCentrosCustoNumberChange}
                    min={1}
                    className="form-control"
                  />
                </div>
                {errors.centrosCusto && (
                  <p className="text-red-500 text-xs">{errors.centrosCusto}</p>
                )}
                {centrosCusto.map((centro: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <Label className="text-xs font-semibold text-primary uppercase">
                      Centro de Custo {index + 1}
                    </Label>
                    <SelectField
                      label=""
                      value={centro.centroCusto || ""}
                      onChange={(value: string) =>
                        handleCentrosCustoChange(index, "centroCusto", value)
                      }
                      options={formattedOptions}
                    />
                    {errors.centrosCusto && (
                      <p className="text-red-500 text-xs">
                        {errors.centrosCusto}
                      </p>
                    )}
                    <Input
                      type="number"
                      value={centro.valor}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (!isNaN(value)) {
                          handleCentrosCustoChange(index, "valor", value);
                        }
                      }}
                      placeholder="Valor"
                      className="form-control"
                    />
                    {errors.centrosCusto && (
                      <p className="text-red-500 text-xs">
                        {errors.centrosCusto}
                      </p>
                    )}
                  </div>
                ))}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-primary uppercase">
                    Valor Total dos Itens
                  </Label>
                  <Input
                    type="number"
                    disabled
                    value={valorTotal}
                    readOnly
                    className="form-control"
                  />
                </div>
              </FormSection>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Lançar Ordem de Pagamento
                </Button>
              </div>
            </form>
          </div>
        </div>
        {isViewOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm">
              <h2 className="text-lg font-bold mb-2">Visualização</h2>

              <Button
                onClick={toggleView}
                className="mt-2 bg-primary hover:bg-primary/90"
              >
                Fechar
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
