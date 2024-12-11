"use client";

import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SelectField } from "@/components/nopaper/select-field";
import { FormSection } from "@/components/nopaper/form-section";

export default function NoPaper() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [ramo, setRamo] = useState("distribuicao");
  const [tipoLancamento, setTipoLancamento] = useState("servico");
  const [formaPagamento, setFormaPagamento] = useState("avista");

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
                      <Label className="text-xs font-semibold text-primary uppercase">
                        Selecione o Parceiro
                      </Label>
                      <Input placeholder="Fornecedor" />
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
                    onChange={setFormaPagamento}
                    options={[
                      { value: "avista", label: "À VISTA" },
                      { value: "deposito", label: "DEPÓSITO" },
                      { value: "boleto", label: "BOLETO" },
                      { value: "pix", label: "PIX" },
                    ]}
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