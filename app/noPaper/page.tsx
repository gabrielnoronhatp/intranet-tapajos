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
import { Command } from "lucide-react";

export default function NoPaper() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [ramo, setRamo] = useState("distribuicao");
  const [tipoLancamento, setTipoLancamento] = useState("servico");
  const [formaPagamento, setFormaPagamento] = useState("avista");
  const [fornecedores, setFornecedores] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [selectedFornecedor, setSelectedFornecedor] = useState<any>(null);
  const [quantidadeProdutos, setQuantidadeProdutos] = useState(1);
  const [centrosCusto, setCentrosCusto] = useState([{ centroCusto: '', valor: 0 }]);
  const [installments, setInstallments] = useState(1);
  const [installmentDates, setInstallmentDates] = useState<string[]>([]);
  const [valorTotal, setValorTotal] = useState(0);

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
        <PopoverContent className="w-[400px] p-0">
          {/* <Command> */}
            <div className="max-h-[300px] overflow-auto">
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
          {/* </Command> */}
        </PopoverContent>
      </Popover>
    </div>
  );

  const handleQuantidadeProdutosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantidade = parseInt(e.target.value, 10);
    setQuantidadeProdutos(quantidade);
  };

  const handleCentrosCustoNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numCentros = parseInt(e.target.value, 10);
    const newCentrosCusto = Array.from({ length: numCentros }, (_, index) => (
      centrosCusto[index] || { centroCusto: '', valor: 0 }
    ));
    setCentrosCusto(newCentrosCusto);
  };

  const handleCentrosCustoChange = (index: number, field: 'centroCusto' | 'valor', value: string | number) => {
    const newCentrosCusto:any = [...centrosCusto];
    newCentrosCusto[index][field] = value;
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

  const calculateValorTotal = () => {
    const total = centrosCusto.reduce((acc, centro) => acc + (centro.valor || 0), 0);
    setValorTotal(total);
  };

  useEffect(() => {
    calculateValorTotal();
  }, [centrosCusto]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} />
      
      <main className={`pt-16 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary mb-6">Lançamento NoPaper</h1>
          
          <div className="max-w-4xl">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              {/* Dados de Origem */}
              <FormSection title="Dados de Origem da Nota Fiscal">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
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

                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs font-semibold text-primary uppercase">
                        Selecione a Filial que Pagará
                      </Label>
                      <Input placeholder="Filial de Lançamento" />
                    </div>

                    <div>
                      
                      <FornecedorSelect />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label className="text-xs font-semibold text-primary uppercase">
                      Número da Nota Fiscal
                    </Label>
                    <Input placeholder="Nota" />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-primary uppercase">
                      Série
                    </Label>
                    <Input placeholder="Serie" />
                  </div>
                </div>
              </FormSection>

              {/* Dados Financeiros */}
              <FormSection title="Dados Financeiros">
                <div className="space-y-4">
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
                    <div className="space-y-4">
                      <Label className="text-xs font-semibold text-primary uppercase">
                        Data de Vencimento
                      </Label>
                      <Input
                        type="date"
                        className="form-control"
                      />
                    </div>
                  )}

                  {formaPagamento === 'deposito' && (
                    <div className="space-y-4">
                      <Label className="text-xs font-semibold text-primary uppercase">
                        Banco
                      </Label>
                      <Input
                        type="text"
                        placeholder="Banco"
                        className="form-control"
                      />
                      <Label className="text-xs font-semibold text-primary uppercase">
                        Agência
                      </Label>
                      <Input
                        type="text"
                        placeholder="Agência"
                        className="form-control"
                      />
                      <Label className="text-xs font-semibold text-primary uppercase">
                        Conta
                      </Label>
                      <Input
                        type="text"
                        placeholder="Conta"
                        className="form-control"
                      />
                      <Label className="text-xs font-semibold text-primary uppercase">
                        Data de Vencimento
                      </Label>
                      <Input
                        type="date"
                        className="form-control"
                      />
                    </div>
                  )}

                  {formaPagamento === 'boleto' && (
                    <div className="space-y-4">
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
                        <div key={index} className="space-y-2">
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
                    <div className="space-y-4">
                      <Label className="text-xs font-semibold text-primary uppercase">
                        Tipo de Chave PIX
                      </Label>
                      <SelectField
                        value=""
                        onChange={() => {}}
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
                        placeholder="Insira a Chave PIX"
                        className="form-control"
                      />
                      <Label className="text-xs font-semibold text-primary uppercase">
                        Data de Vencimento
                      </Label>
                      <Input
                        type="date"
                        className="form-control"
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <Label className="text-xs font-semibold text-primary uppercase">
                    Conta Gerencial
                  </Label>
                  <Input
                    type="text"
                    placeholder="Conta Gerencial"
                    className="form-control"
                  />
                </div>
              </FormSection>

              {/* Conta Gerencial de Lançamento */}
            

              {/* Dados de itens e Imposto */}
              <FormSection title="Dados de itens e Imposto">
                <div className="space-y-4">
                  <Label className="text-xs font-semibold text-primary uppercase">
                    Dados de itens e Imposto
                  </Label>
                  <Input
                    type="number"
                    value={quantidadeProdutos}
                    onChange={handleQuantidadeProdutosChange}
                    min={1}
                    className="form-control"
                  />
                </div>
              </FormSection>

              {/* Centro de Custo */}
              <FormSection title="Centro de Custo">
                <div className="space-y-4">
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
                  <div key={index} className="space-y-4">
                    <Label className="text-xs font-semibold text-primary uppercase">
                      Centro de Custo {index + 1}
                    </Label>
                    <Input
                      type="text"
                      value={centro.centroCusto}
                      onChange={(e) => handleCentrosCustoChange(index, 'centroCusto', e.target.value)}
                      placeholder="Insira o Centro de Custo"
                      className="form-control"
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
                <div className="space-y-4">
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
      </main>
    </div>
  );
}