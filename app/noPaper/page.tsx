"use client";

import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { SelectField } from "@/components/nopaper/select-field";
import { FormSection } from "@/components/nopaper/form-section";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { Eye } from "lucide-react";

// Define a type for centrosCusto
interface CentroCusto {
  centroCusto: string;
  valor: number;
}

// Define a type for the items
interface Item {
  descricao: string;
  valor: number;
  centroCusto: CentroCusto[];
}

export default function NoPaper() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [ramo, setRamo] = useState("distribuicao");
  const [tipoLancamento, setTipoLancamento] = useState("servico");
  const [formaPagamento, setFormaPagamento] = useState("avista");
  const [fornecedores, setFornecedores] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [selectedFornecedor, setSelectedFornecedor] = useState<any>(null);
  const [quantidadeProdutos, setQuantidadeProdutos] = useState(1);
  const [centrosCusto, setCentrosCusto] = useState<CentroCusto[]>([]);
  const [installments, setInstallments] = useState(1);
  const [installmentDates, setInstallmentDates] = useState<string[]>([]);
  const [valorTotal, setValorTotal] = useState(0);
  const [itens, setItens] = useState<Item[]>([{ descricao: '', valor: 0, centroCusto: [] }]);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [filiais, setFiliais] = useState<any>([]);
  const [selectedFilial, setSelectedFilial] = useState<any>(null);
  const [filialOpen, setFilialOpen] = useState(false);
  const [notaFiscal, setNotaFiscal] = useState("");
  const [serie, setSerie] = useState("");
  const [valorImposto, setValorImposto] = useState(0);
  const [observacao, setObservacao] = useState("");
  const [user, setUser] = useState("");
  const [dtavista, setDtavista] = useState("");
  const [banco, setBanco] = useState("");
  const [agencia, setAgencia] = useState("");
  const [conta, setConta] = useState("");
  const [dtdeposito, setDtdeposito] = useState("");
  const [tipopix, setTipopix] = useState("");
  const [chavepix, setChavepix] = useState("");
  const [datapix, setDatapix] = useState("");
  const [contasGerenciais, setContasGerenciais] = useState<any[]>([]);
  const [centrosCustoOptions, setCentrosCustoOptions] = useState<any[]>([]);
  const [contaOP, setContaOP] = useState("");

  useEffect(() => {
    const fetchFornecedores = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/fornec_dist?q=1');
        const data = await response.json();
        setFornecedores(data);
      } catch (error) {
        console.error('Error fetching fornecedores:', error);
      }
    };
    fetchFornecedores();
  }, []);

  useEffect(() => {
    const fetchFiliais = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/dadoslojas');
        const data = await response.json();
        setFiliais(data);
      } catch (error) {
        console.error('Error fetching filiais:', error);
      }
    };
    fetchFiliais();
  }, []);

  useEffect(() => {
    const fetchContasGerenciais = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/dadoscontager');
        const data = await response.json();
        setContasGerenciais(data);
      } catch (error) {
        console.error('Error fetching contas gerenciais:', error);
      }
    };
    fetchContasGerenciais();
  }, []);

  useEffect(() => {
    const fetchCentrosCusto = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/dadosccusto');
        const data = await response.json();
        setCentrosCustoOptions(data);
      } catch (error) {
        console.error('Error fetching centros de custo:', error);
      }
    };
    fetchCentrosCusto();
  }, []);

  const FilialSelect = () => (
    <div>
      <Label className="text-xs font-semibold text-primary uppercase">
        Selecione a Filial que Pagará
      </Label>
      <Popover open={filialOpen} onOpenChange={setFilialOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={filialOpen}
            className="justify-between w-full"
          >
            {selectedFilial ? selectedFilial.loja : "Selecione uma filial..."}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <div className="max-h-[200px] overflow-auto">
            {filiais.map((filial: any) => (
              <div
                key={filial.loja}
                className="px-4 py-2 hover:bg-primary/10 cursor-pointer"
                onClick={() => {
                  setSelectedFilial(filial);
                  setFilialOpen(false);
                }}
              >
                {filial.loja}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );

  const FornecedorSelect = () => (
    <div className="flex flex-col space-y-1.5">
      <Label className="text-xs font-semibold text-primary uppercase">
        Selecione o Parceiro
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
          >
            {selectedFornecedor ? selectedFornecedor.fornecedor : "Selecione um fornecedor..."}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <div className="max-h-[200px] overflow-auto">
            {fornecedores.map((fornecedor:any) => (
              <div
                key={fornecedor}
                className="px-4 py-2 hover:bg-primary/10 cursor-pointer"
                onClick={() => {
                  setSelectedFornecedor(fornecedor);
                  setOpen(false);
                }}
              >
                {fornecedor.fornecedor}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );

  const handleQuantidadeProdutosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantidade = parseInt(e.target.value, 10);
    setQuantidadeProdutos(quantidade);
    const newItens = Array.from({ length: quantidade }, (_, index) => (
      itens[index] || { descricao: '', valor: 0, centroCusto: [] }
    ));
    setItens(newItens);
    calculateValorTotal(newItens);
  };

  const handleCentrosCustoNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numCentros = parseInt(e.target.value, 10);
    if (numCentros < 1) {
      console.error("Número de centros de custo deve ser pelo menos 1.");
      return;
    }
    const newCentrosCusto = Array.from({ length: numCentros }, (_, index) => (
      centrosCusto[index] || { centroCusto: '', valor: 0 }
    ));
    setCentrosCusto(newCentrosCusto);
  };

  const handleCentrosCustoChange = (index: number, field: 'centroCusto' | 'valor', value: string | number) => {
    const newCentrosCusto = [...centrosCusto];
    if (field === 'centroCusto') {
      newCentrosCusto[index][field] = value as string;
    } else {
      newCentrosCusto[index][field] = value as number;
    }
    setCentrosCusto(newCentrosCusto);
  };

  const handleFormaPagamentoChange = (value: string) => {
    setFormaPagamento(value);
    if (value !== 'boleto') {
      setInstallments(1);
      setInstallmentDates([]);
    }
  };

  const handleInstallmentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numInstallments = parseInt(e.target.value, 10);
    setInstallments(numInstallments);
    setInstallmentDates(Array(numInstallments).fill(''));
  };

  const handleInstallmentDateChange = (index: number, date: string) => {
    const newDates = [...installmentDates];
    newDates[index] = date;
    setInstallmentDates(newDates);
  };

  const handleItensChange = (index: number, field: keyof Item, value: any) => {
    const newItens = [...itens];
    if (field === 'centroCusto') {
      newItens[index][field] = value as CentroCusto[];
    } else if (field === 'valor') {
      newItens[index][field] = value as number;
    } else {
      newItens[index][field] = value as string;
    }
    setItens(newItens);
  };

  const calculateValorTotal = (itensToCalculate = itens) => {
    const total = itensToCalculate.reduce((acc, item) => acc + (item.valor || 0), 0);
    setValorTotal(total);
  };

  useEffect(() => {
    calculateValorTotal();
  }, [centrosCusto]);

  const toggleView = () => {
    setIsViewOpen(!isViewOpen);
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!itens || itens.length === 0) {
    console.error("Itens are not defined or empty.");
    return;
  }

  
  const produtosOP = itens.map(item => {
    const centroCusto = item.centroCusto;

   
    const centroCustoFormatado = typeof centroCusto === 'string'
      ? [{ centrocusto: centroCusto, valor: item.valor || 0 }]
      : centroCusto;

    return {
      produto: item.descricao,
      valor: item.valor,
      centroCusto: centroCustoFormatado,
    };
  });

  
  const totalProdutos = produtosOP.reduce((acc, produto) => acc + produto.valor, 0);
  const totalCentrosCusto = centrosCusto.reduce((acc, ccusto) => acc + ccusto.valor, 0);

  if (totalProdutos !== totalCentrosCusto) {
    const diferenca = totalProdutos - totalCentrosCusto;

 
    produtosOP.forEach(produto => {
      produto.valor -= diferenca / produtosOP.length; 
    });

   
    centrosCusto.forEach(ccusto => {
      ccusto.valor += diferenca / centrosCusto.length; 
    });
  }

  const orderData = {
    dtlanc: new Date().toISOString(),
    ramoOP: ramo,
    notaOP: notaFiscal,
    qtparcelasOP: installments,
    contagerencialOP: contaOP,
    fornecedorOP: selectedFornecedor?.fornecedor || "",
    lojaOP: selectedFilial?.loja || "",
    serieOP: serie,
    metodoOP: formaPagamento,
    qtitensOP: quantidadeProdutos,
    valorimpostoOP: valorImposto,
    dtavistaOP: dtavista,
    bancoOP: banco,
    agenciaOP: agencia,
    contaOP: conta,
    dtdepositoOP: dtdeposito,
    parcelasOP: installmentDates.map(date => ({ parcela: date })),
    produtosOP: produtosOP,
    observacaoOP: observacao,
    tipopixOP: tipopix,
    chavepixOP: chavepix,
    datapixOP: datapix,
    opcaoLancOP: tipoLancamento,
    ccustoOP: centrosCusto.map(centro => ({
      centrocusto: centro.centroCusto,
      valor: centro.valor
    })),
    userOP: user,
  };

  console.log("Order Data:", orderData);

  try {
    const response = await fetch("http://localhost:3001/api/cadastrar-ordem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error("Failed to submit order");
    }

    const result = await response.json();
    console.log("Order submitted successfully:", result);
  } catch (error) {
    console.error("Error submitting order:", error);
  }
};


  return (
    <div className="min-h-screen bg-background">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
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
              {/* Dados de Origem */}
              <FormSection title="Dados de Origem da Nota Fiscal">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <SelectField
                      label="Selecione o Ramo"
                      value={ramo}
                      onChange={setRamo}
                      options={[
                        { value: "distribuicao", label: "DISTRIBUIÇÃO" },
                        { value: "varejo", label: "VAREJO" },
                      ]}
                    />
                    
                    {ramo === "distribuicao" && (
                      <SelectField
                        label="Tipo Lançamento"
                        value={tipoLancamento}
                        onChange={setTipoLancamento}
                        options={[
                          { value: "servico", label: "SERVIÇO" },
                          { value: "usoconsumo", label: "USO E CONSUMO" },
                        ]}
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <div>
                    <FilialSelect />
                    </div>

                    <div>
                      <FornecedorSelect />
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
                      onChange={(e) => setNotaFiscal(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-primary uppercase">
                      Série
                    </Label>
                    <Input
                      placeholder="Serie"
                      value={serie}
                      onChange={(e) => setSerie(e.target.value)}
                    />
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

                  {formaPagamento === 'avista' && (
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-primary uppercase">
                        Data de Vencimento
                      </Label>
                      <Input
                        type="date"
                        value={dtavista}
                        onChange={(e) => setDtavista(e.target.value)}
                        className="form-control"
                      />
                    </div>
                  )}

                  {formaPagamento === 'deposito' && (
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-primary uppercase">
                        Banco
                      </Label>
                      <Input
                        type="text"
                        value={banco}
                        onChange={(e) => setBanco(e.target.value)}
                        placeholder="Banco"
                        className="form-control"
                      />
                      <Label className="text-xs font-semibold text-primary uppercase">
                        Agência
                      </Label>
                      <Input
                        type="text"
                        value={agencia}
                        onChange={(e) => setAgencia(e.target.value)}
                        placeholder="Agência"
                        className="form-control"
                      />
                      <Label className="text-xs font-semibold text-primary uppercase">
                        Conta
                      </Label>
                      <Input
                        type="text"
                        value={conta}
                        onChange={(e) => setConta(e.target.value)}
                        placeholder="Conta"
                        className="form-control"
                      />
                      <Label className="text-xs font-semibold text-primary uppercase">
                        Data de Depósito
                      </Label>
                      <Input
                        type="date"
                        value={dtdeposito}
                        onChange={(e) => setDtdeposito(e.target.value)}
                        className="form-control"
                      />
                    </div>
                  )}

                  {formaPagamento === 'boleto' && (
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
                            onChange={(e) => handleInstallmentDateChange(index, e.target.value)}
                            className="form-control"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {formaPagamento === 'pix' && (
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-primary uppercase">
                        Tipo de Chave PIX
                      </Label>
                      <SelectField
                        value={tipopix}
                        onChange={setTipopix}
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
                        onChange={(e) => setChavepix(e.target.value)}
                        placeholder="Insira a Chave PIX"
                        className="form-control"
                      />
                      <Label className="text-xs font-semibold text-primary uppercase">
                        Data de Pagamento PIX
                      </Label>
                      <Input
                        type="date"
                        value={datapix}
                        onChange={(e) => setDatapix(e.target.value)}
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
                    onChange={setContaOP}
                    options={contasGerenciais.map(conta => ({ value: conta.conta, label: conta.conta }))}
                    label=""
                  />
                </div>
              </FormSection>

              {/* Dados de itens e Imposto */}
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

                  {itens.map((item, index) => (
                    <div key={index} className="space-y-1">
                      <Label className="text-xs font-semibold text-primary uppercase">
                        Insira a Descrição e Valor do Item: {index + 1}
                      </Label>
                      <Input
                        type="text"
                        value={item.descricao}
                        onChange={(e) => handleItensChange(index, 'descricao', e.target.value)}
                        placeholder="Insira a Descrição do Item"
                        className="form-control"
                      />
                      <Input
                        type="number"
                        value={item.valor}
                        onChange={(e) => handleItensChange(index, 'valor', parseFloat(e.target.value))}
                        placeholder="Insira o Valor do Item"
                        min={0.01}
                        step={0.01}
                        className="form-control"
                      />
                      <SelectField
                        value={item.centroCusto?.toString()}
                        onChange={(value) => handleItensChange(index, 'centroCusto', value)}
                        options={centrosCustoOptions.map(option => ({ value: option.centrocusto, label: option.centrocusto }))}
                        label="Centro de Custo"
                      />
                    </div>
                  ))}

                  <Label className="text-xs font-semibold text-primary uppercase">
                    Valor do Imposto
                  </Label>
                  <Input
                    type="number"
                    value={valorImposto}
                    onChange={(e) => setValorImposto(parseFloat(e.target.value))}
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
                {centrosCusto.map((centro, index) => (
                  <div key={index} className="space-y-2">
                    <Label className="text-xs font-semibold text-primary uppercase">
                      Centro de Custo {index + 1}
                    </Label>
                    <SelectField
                      value={centro.centroCusto}
                      onChange={(value) => handleCentrosCustoChange(index, 'centroCusto', value)}
                      options={centrosCustoOptions.map(option => ({ value: option.centrocusto, label: option.centrocusto }))}
                      label=""
                    />
                    <Input
                      type="number"
                      value={centro.valor}
                      onChange={(e) => handleCentrosCustoChange(index, 'valor', parseFloat(e.target.value))}
                      placeholder="Valor"
                      min={0.01}
                      step={0.01}
                      className="form-control"
                    />
                  </div>
                ))}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-primary uppercase">
                    Valor Total dos Itens
                  </Label>
                  <Input
                    type="number"
                    value={valorTotal}
                    readOnly
                    className="form-control"
                  />
                </div>
              </FormSection>

              <div className="flex justify-end">
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Lançar Ordem de Pagamento
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* View Icon */}
        <div className="fixed bottom-4 right-4">
          <Button onClick={toggleView} className="bg-primary hover:bg-primary/90 p-2 rounded-full">
            <Eye className="text-white" />
          </Button>
        </div>

        {/* View Modal or Section */}
        {isViewOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm">
              <h2 className="text-lg font-bold mb-2">Visualização</h2>
              {/* Add content for viewing here */}
              <Button onClick={toggleView} className="mt-2 bg-primary hover:bg-primary/90">
                Fechar
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}