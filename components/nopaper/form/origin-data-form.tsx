"use client";
import { SelectField } from "../select-field";
import { FormSection } from "../form-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { RootState } from "@/hooks/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { prepareOrderData, setOrderState } from "@/hooks/slices/noPaper/orderSlice";
import { Select } from "antd";
import { FilialSelect } from "@/components/nopaper/store-select";
import { FornecedorSelect } from "@/components/nopaper/supplier-select";

export default function OriginData() {
  const { ramoOP, opcaoLancOP, notaOP, serieOP, fornecedorOP, dtlanc, lojaOP } =
    useSelector((state: RootState) => state.order);
  const dispatch = useDispatch();

  const handleFieldChange = (field: string, value: string) => {
    
    dispatch(setOrderState({ [field]: value }));
  };

  useEffect(() => {
    setOrderState({
      ramoOP,
      opcaoLancOP,
      notaOP,
      serieOP,
      fornecedorOP,
      dtlanc,
    });
  }, [ramoOP, opcaoLancOP, fornecedorOP, dtlanc,notaOP,serieOP]);

  return (
    <FormSection title="Dados de Origem da Nota Fiscal">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-semibold text-primary">RAMO</Label>
            <Select
              onChange={(value: any) => handleFieldChange("ramoOP", value)}
              placeholder="Selecione o Ramo"
              value={ramoOP}
              options={[
                { value: "distribuicao", label: "DISTRIBUIÇÃO" },
                { value: "varejo", label: "VAREJO" },
                { value: "industria", label: "INDÚSTRIA" },
                { value: "servicos", label: "SERVIÇOS" },
              ]}
              className="w-full"
            />
          </div>

          <div>
            <Label className="text-sm font-semibold text-primary">
              TIPO DE LANÇAMENTO
            </Label>
            <Select
              onChange={(value: string) =>
                handleFieldChange("opcaoLancOP", value)
              }
              placeholder="Selecione o Tipo de Lançamento"
              value={opcaoLancOP}
              options={
                ramoOP === "distribuicao"
                  ? [
                      { value: "servico", label: "SERVIÇO" },
                      { value: "usoconsumo", label: "USO E CONSUMO" },
                      { value: "despesas", label: "DESPESAS OPERACIONAIS" },
                    ]
                  : ramoOP === "varejo"
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

        <div className="space-y-4">
          <FilialSelect
            validate={true}
            handleSetState={(value: string) => handleFieldChange(lojaOP, value)}
          />
          <FornecedorSelect
            handleSetState={(value: any) =>
              handleFieldChange(fornecedorOP, value)
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div>
          <Label className="text-sm font-semibold text-primary">
            NÚMERO DA NOTA FISCAL
          </Label>
          <Input
            placeholder="Nota"
            value={notaOP}
            className="w-full p-2 border rounded"
            onChange={(e) => handleFieldChange("notaOP", e.target.value)}
          />
        </div>
        <div>
          <Label className="text-sm font-semibold text-primary">SÉRIE</Label>
          <Input
            placeholder="Série"
            value={serieOP}
            className="w-full p-2 border rounded"
            onChange={(e) => handleFieldChange("serieOP", e.target.value)}
          />
        </div>
        <div>
          <Label className="text-sm font-semibold text-primary">
            DATA DE EMISSÃO
          </Label>
          <Input
            type="date"
            value={dtlanc ? new Date(dtlanc).toISOString().split("T")[0] : ""}
            className="w-full p-2 border rounded"
            onChange={(e) => handleFieldChange("dtlanc", e.target.value)}
          />
        </div>
      </div>
    </FormSection>
  );
}
