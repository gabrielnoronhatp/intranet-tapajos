"use client";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { setOrderState } from "@/hooks/slices/orderSlice";

import { SelectField } from "./select-field";
import { FormSection } from "./form-section";


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

export default function FinancialData() {
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

  
   
  useEffect(() => {
    dispatch(fetchContasGerenciais() as any);
  }, [dispatch, searchQuery]);


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

  return (
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
       {/* {errors.formaPagamento && (
         <p className="text-red-500 text-xs">
           {errors.formaPagamento}
         </p>
       )} */}

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
           {/* {errors.banco && (
             <p className="text-red-500 text-xs">{errors.banco}</p>
           )} */}
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
           {/* {errors.agencia && (
             <p className="text-red-500 text-xs">{errors.agencia}</p>
           )} */}
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
           {/* {errors.conta && (
             <p className="text-red-500 text-xs">{errors.conta}</p>
           )} */}
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
     {/* {errors.contaOP && (
       <p className="text-red-500 text-xs">{errors.contaOP}</p>
     )} */}
   </FormSection>

   
  );
}



//    