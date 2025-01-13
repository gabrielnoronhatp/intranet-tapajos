"use client";
import { SelectField } from "../select-field";
import { FormSection } from "../form-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FilialSelect } from "@/components/FilialSelect";
import { FornecedorSelect } from "@/components/FornecedorSelect";
import { RootState } from "@/hooks/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { prepareOrderData, setOrderState } from "@/hooks/slices/orderSlice";
import { Select } from "antd";

export default function OriginData() {
  const {ramo, tipoLancamento, formaPagamento, selectedFilial, selectedFornecedor, notaFiscal, serie } = useSelector((state: RootState) => state.order);
  const dispatch = useDispatch();

   useEffect(() => {
    console.log(ramo);
    console.log(tipoLancamento);
    console.log(selectedFornecedor);
   }, [ramo, tipoLancamento, formaPagamento, selectedFilial, selectedFornecedor]);
 
  

   const handleFieldChange = (field: string, value: string) => {
     dispatch(setOrderState({ [field]: value }));
   }; 


   return (
    <FormSection title="Dados de Origem da Nota Fiscal">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Coluna 1 */}
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-semibold text-gray-700">Ramo</Label>
          <Select
            onChange={(value: any) => handleFieldChange('ramo', value)}
            placeholder="Selecione o Ramo"
            value={ramo}
            options={[
              { value: "distribuicao", label: "DISTRIBUIÇÃO" },
              { value: "varejo", label: "VAREJO" },
              { value: "industria", label: "INDÚSTRIA" },
              { value: "servicos", label: "SERVIÇOS" },
            ]}
            className="w-full"
          />
          <p className="text-red-500 text-xs">Erro de exemplo</p>
        </div>
  
        <div>
          <Label className="text-sm font-semibold text-gray-700">Tipo de Lançamento</Label>
          <Select
            onChange={(value: any) => handleFieldChange('tipoLancamento', value)}
            placeholder="Selecione o Tipo de Lançamento"
            value={tipoLancamento}
            options={
              ramo === "distribuicao"
                ? [
                    { value: "servico", label: "SERVIÇO" },
                    { value: "usoconsumo", label: "USO E CONSUMO" },
                    { value: "despesas", label: "DESPESAS OPERACIONAIS" },
                  ]
                : ramo === "varejo"
                ? [
                    { value: "vendas", label: "VENDAS" },
                    { value: "usoconsumo", label: "USO E CONSUMO" },
                    { value: "servico", label: "SERVIÇO" },
                  ]
                : [
                    { value: "geral", label: "GERAL" },
                    { value: "servico", label: "SERVIÇO" },
                  ]
            }
            className="w-full"
          />
        </div>
      </div>
  
      {/* Coluna 2 */}
      <div className="space-y-4">
        <FilialSelect
          loading={false}
          error={null}
          filialOpen={false}
          selectedFilial={selectedFilial}
          filiais={[]}
          handleSetState={(value: string) => handleFieldChange('selectedFilial', value)}
        />
        <FornecedorSelect
          open={false}
          searchQuery=""
          selectedFornecedor={selectedFornecedor}
          fornecedores={[]}
          handleSetState={(value: any) => handleFieldChange('selectedFornecedor', value)}
        />
      </div>
    </div>
  
    {/* Campos de Entrada Adicionais */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      <div>
        <Label className="text-sm font-semibold text-gray-700">Número da Nota Fiscal</Label>
        <Input placeholder="Nota" value={notaFiscal} className="w-full p-2 border rounded" onChange={(e) => handleFieldChange('notaFiscal', e.target.value)} />
        <p className="text-red-500 text-xs">Erro de exemplo</p>
      </div>
      <div>
        <Label className="text-sm font-semibold text-gray-700">Série</Label>
        <Input placeholder="Série" value={serie} className="w-full p-2 border rounded" onChange={(e) => handleFieldChange('serie', e.target.value)} />
        <p className="text-red-500 text-xs">Erro de exemplo</p>
      </div>
      <div>
        <Label className="text-sm font-semibold text-gray-700">Data de Emissão</Label>
          <Input type="date" value="" className="w-full p-2 border rounded" onChange={(e) => handleFieldChange('dataEmissao', e.target.value)} />
      </div>
    </div>
  </FormSection>
  );
}
