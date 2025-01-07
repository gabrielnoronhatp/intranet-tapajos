"use client";
import { setOrderState } from "@/hooks/slices/orderSlice";
import { SelectField } from "../select-field";
import { FormSection } from "../form-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFornecedores,
  fetchFiliais,
} from "@/hooks/slices/noPaperSlice";
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
  } = useSelector((state: any) => state.order);

  const { fornecedores, filiais, searchQuery, loading, error } = useSelector(
    (state: any) => state.noPaper
  );

  useEffect(() => {
    dispatch(fetchFornecedores(searchQuery) as any);
    dispatch(fetchFiliais() as any);
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
              { value: "servicos", label: "SERVIÇOS" },
            ]}
          />

          {ramo && (
            <SelectField
              label="Tipo Lançamento"
              value={tipoLancamento}
              onChange={(value: string) =>
                handleSetState("tipoLancamento", value)
              }
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
            />
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
          </div>

          <div>
            <FornecedorSelect
              open={open}
              searchQuery={searchQuery}
              selectedFornecedor={selectedFornecedor}
              fornecedores={fornecedores}
              handleSetState={handleSetState}
            />
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
        </div>
      </div>
    </FormSection>
  );
}
