"use client";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { setOrderState } from "@/hooks/slices/noPaper/orderSlice";
import { FormSection } from "../form-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RootState } from "@/hooks/store";
import { Select } from "antd";
import { NumericFormat } from "react-number-format";

export default function CenterOfCoust() {
  const dispatch = useDispatch();
  const { ccustoOP, produtosOP, valorimpostoOP } = useSelector(
    (state: RootState) => state.order
  );
  const { centrosCustoOptions } = useSelector(
    (state: RootState) => state.noPaper
  );

  const [numCenters, setNumCenters] = useState(ccustoOP.length || 1);

  const calculateTotalValue = () => {
    const totalProdutos = produtosOP.reduce(
      (sum, product) => sum + (Number(product.valor) || 0),
      0
    );
    return totalProdutos - (Number(valorimpostoOP) || 0);
  };

  const updateCenterValues = () => {
    const totalValue = calculateTotalValue();
    const valuePerCenter = totalValue / numCenters;

    const updatedCenters = Array.from({ length: numCenters }, (_, index) => ({
      centrocusto: ccustoOP[index]?.centrocusto || "",
      valor: valuePerCenter,
    }));

    dispatch(setOrderState({ ccustoOP: updatedCenters }));
  };

  useEffect(() => {
    updateCenterValues();
  }, [numCenters, produtosOP, valorimpostoOP]);

  const handleNumCentersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumCenters = Math.max(1, parseInt(e.target.value) || 1);
    setNumCenters(newNumCenters);
  };

  const handleCenterChange = (
    index: number,
    field: "centrocusto" | "valor",
    value: any
  ) => {
    let updatedCenters = [...ccustoOP];

    if (field === "valor") {
      const totalValue = calculateTotalValue();
      const remaining = totalValue - Number(value);
      const otherCenters = numCenters - 1;

      if (otherCenters > 0) {
        const valueForOthers = remaining / otherCenters;

        updatedCenters = updatedCenters.map((center, i) => {
          if (i === index) {
            return {
              ...center,
              valor: Number(value),
            };
          }
          return {
            ...center,
            valor: valueForOthers,
          };
        });
      }
    } else {
      updatedCenters = updatedCenters.map((center, i) =>
        i === index ? { ...center, [field]: value } : center
      );
    }

    dispatch(setOrderState({ ccustoOP: updatedCenters }));
  };

  return (
    <FormSection title="Centro de Custo">
      <div className="space-y-4">
        <div>
          <Label className="text-xs font-semibold text-primary uppercase">
            Número de Centros de Custo
          </Label>
          <Input
            type="number"
            value={numCenters}
            onChange={handleNumCentersChange}
            min={1}
            className="form-control"
          />
        </div>

        {Array.from({ length: numCenters }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Label className="text-xs font-semibold text-primary uppercase">
              Centro de Custo {index + 1}
            </Label>
            <Select
              showSearch
              className="w-full"
              value={ccustoOP[index]?.centrocusto || ""}
              onChange={(value) =>
                handleCenterChange(index, "centrocusto", value)
              }
            >
              {centrosCustoOptions.map((option: any) => (
                <Select.Option key={option.id} value={option.centrocusto}>
                  {option.centrocusto}
                </Select.Option>
              ))}
            </Select>
            <Input
              type="number"
              value={ccustoOP[index]?.valor || 0}
              onChange={(e) => {
                handleCenterChange(index, "valor", e.target.value);
              }}
              className="form-control w-full p-2 border rounded"
            />
          </div>
        ))}
      </div>

      <div>
        <Label className="text-xs font-semibold text-primary uppercase">
          Valor Total
        </Label>
        <NumericFormat
          customInput={Input}
          value={calculateTotalValue()}
          disabled
          className="form-control w-full p-2 border rounded bg-gray-100"
          thousandSeparator="."
          decimalSeparator=","
          prefix="R$ "
          decimalScale={2}
          fixedDecimalScale
        />
      </div>
    </FormSection>
  );
}
