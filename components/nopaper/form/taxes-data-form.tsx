


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
import { Item } from "@/types/Order/OrderTypes";

export default function TaxesData() {
const dispatch = useDispatch();
  const handleSetState = (field: keyof any, value: any) => {
    dispatch(setOrderState({ [field]: value }));
  };
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
    searchQuery,
    contasGerenciais,
    centrosCustoOptions,
    loading,
    error,
  } = useSelector((state: any) => state.noPaper);
  const [itens, setItens] = useState<Item[]>([
    { descricao: "", valor: 0, centroCusto: [] },
  ]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  

  
   
  useEffect(() => {
    dispatch(fetchContasGerenciais() as any);
  }, [dispatch, searchQuery]);

   
  const calculateValorTotal = (itensToCalculate = itens) => {
    const total = itensToCalculate.reduce(
      (acc: number, item: Item) => acc + (item.valor || 0),
      0
    );
    handleSetState("valorTotal", total - valorImposto);
  };

  useEffect(() => {
    calculateValorTotal(itens);
  }, [itens, valorImposto]);

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

  return (
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
  {/* {errors.quantidadeProdutos && (
    <p className="text-red-500 text-xs">
      {errors.quantidadeProdutos}
    </p>
  )} */}
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
      {/* {errors.itens && (
        <p className="text-red-500 text-xs">{errors.itens}</p>
      )} */}
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
      {/* {errors.itens && (
        <p className="text-red-500 text-xs">{errors.itens}</p>
      )} */}
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

   
  );
}



//    