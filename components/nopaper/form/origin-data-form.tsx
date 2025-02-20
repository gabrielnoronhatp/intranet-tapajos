  "use client";
  import { useState, useEffect } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { Select } from "antd";
  import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
  import { FilialSelect } from "@/components/nopaper/store-select";
  import { FornecedorSelect } from "@/components/nopaper/supplier-select";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { FormSection } from "../form-section";
  import { RootState } from "@/hooks/store";
  import { setOrderState } from "@/hooks/slices/noPaper/orderSlice";

  export default function OriginData() {
    const { ramoOP, opcaoLancOP, notaOP, serieOP, fornecedorOP, dtlanc, lojaOP } =
      useSelector((state: RootState) => state.order);
    const dispatch = useDispatch();
    const [documentType, setDocumentType] = useState("nota");

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
    }, [ramoOP, opcaoLancOP, fornecedorOP, dtlanc, notaOP, serieOP]);

    return (
      <FormSection title="Dados de Origem da Nota Fiscal">
        <div>
          <Label className="text-sm font-semibold text-primary">
            TIPO DE DOCUMENTO 
          </Label>
          <RadioGroup
            value={documentType}
            onValueChange={(value) => setDocumentType(value)}
            className="flex space-x-4"
          >
            <RadioGroupItem value="nota" id="nota" />
            <Label htmlFor="nota" className="text-sm">
              Nota
            </Label>
            <RadioGroupItem value="fatura" id="fatura" />
            <Label htmlFor="fatura" className="text-sm">
              Fatura
            </Label>
          </RadioGroup>
        </div>

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
                disabled={!ramoOP}
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
              {documentType === "nota" ? "NÚMERO DA NOTA FISCAL" : "NÚMERO IDENTIFICADOR"}
            </Label>
            <Input
              placeholder={documentType === "nota" ? "Nota" : "Identificador"}
              value={notaOP}
              maxLength={50}
              className="w-full p-2 border rounded"
              onChange={(e) => handleFieldChange("notaOP", e.target.value)}
            />
          </div>
          {documentType === "nota" && (
            <div>
              <Label className="text-sm font-semibold text-primary">SÉRIE</Label>
              <Input
                placeholder="Série"
                value={serieOP}
                maxLength={10}
                className="w-full p-2 border rounded"
                onChange={(e) => handleFieldChange("serieOP", e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
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
