"use client";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { setOrderState } from "@/hooks/slices/orderSlice";

import { SelectField } from "../select-field";
import { FormSection } from "../form-section";


import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";


import { useDispatch, useSelector } from "react-redux";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

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
} from "@/hooks/slices/orderSlice";
import { FilialSelect } from "@/components/FilialSelect";
import { FornecedorSelect } from "@/components/FornecedorSelect";

export default function OriginData() {
const dispatch = useDispatch();
  const handleSetState = (field: keyof any, value: any) => {
    dispatch(setOrderState({ [field]: value }));
  };
  const {
    ramo,
    tipoLancamento,
    open,
    selectedFornecedor,
    selectedFilial,
    filialOpen,
    notaFiscal,
    serie,
    dataEmissao,
    errors,
    
    
   
  } = useSelector((state: any) => state.order);

  const {
    fornecedores,
    filiais,
    searchQuery,
    contasGerenciais,
    centrosCustoOptions,
    loading,
    error,
  } = useSelector((state: any) => state.noPaper);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
   
  useEffect(() => {
    dispatch(fetchFornecedores(searchQuery) as any);
    dispatch(fetchFiliais() as any);
    dispatch(fetchContasGerenciais() as any);
    dispatch(fetchCentrosCusto() as any);
  }, [dispatch, searchQuery]);
  return (
    <FormSection title="Dados de Origem da Nota Fiscal">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <SelectField
          label="Selecione o Ramo"
          value={ramo}
          onChange={(value: string) => handleSetState("ramo", value)}
          options={[
            { value: "distribuicao", label: "DISTRIBUIÇÃO" },
            { value: "varejo", label: "VAREJO" },
            { value: "industria", label: "INDÚSTRIA" },
            { value: "servicos", label: "SERVIÇOS" }
          ]}
        />
        {/* {errors.ramo && (
          <p className="text-red-500 text-xs">{errors.ramo}</p>
        )}
   */}
        {ramo && (
          <SelectField
            label="Tipo Lançamento"
            value={tipoLancamento}
            onChange={(value: string) => handleSetState("tipoLancamento", value)}
            options={
              ramo === "distribuicao" ? [
                { value: "servico", label: "SERVIÇO" },
                { value: "usoconsumo", label: "USO E CONSUMO" },
                { value: "despesas", label: "DESPESAS OPERACIONAIS" }
              ] : ramo === "varejo" ? [
                { value: "vendas", label: "VENDAS" },
                { value: "usoconsumo", label: "USO E CONSUMO" },
                { value: "servico", label: "SERVIÇO" }
              ] : [
                { value: "geral", label: "GERAL" },
                { value: "servico", label: "SERVIÇO" }
              ]
            }
          />
        )}
        {/* {errors.tipoLancamento && (
          <p className="text-red-500 text-xs">{errors.tipoLancamento}</p>
        )} */}
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
          {/* {errors.selectedFilial && (
            <p className="text-red-500 text-xs">{errors.selectedFilial}</p>
          )} */}
        </div>
  
        <div>
          <FornecedorSelect
            open={open}
            searchQuery={searchQuery}
            selectedFornecedor={selectedFornecedor}
            fornecedores={fornecedores}
            handleSetState={handleSetState}
          />
          {/* {errors.selectedFornecedor && (
            <p className="text-red-500 text-xs">{errors.selectedFornecedor}</p>
          )} */}
        </div>
      </div>
    </div>
  
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      <div>
        <Label className="text-xs font-semibold text-primary uppercase">
          Número da Nota Fiscal
        </Label>
        <Input
          placeholder="Nota"
          value={notaFiscal}
          onChange={(e) => handleSetState("notaFiscal", e.target.value)}
        />
        {/* {errors.notaFiscal && (
          <p className="text-red-500 text-xs">{errors.notaFiscal}</p>
        )} */}
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
        {/* {errors.serie && (
          <p className="text-red-500 text-xs">{errors.serie}</p>
        )} */}
      </div>
      <div>
        <Label className="text-xs font-semibold text-primary uppercase">
          Data de Emissão
        </Label>
        <Input
          type="date"
          value={dataEmissao}
          onChange={(e) => handleSetState("dataEmissao", e.target.value)}
        />
        {/* {errors.dataEmissao && (
          <p className="text-red-500 text-xs">{errors.dataEmissao}</p>
        )} */}
      </div>
    </div>
  </FormSection>
  );
}
