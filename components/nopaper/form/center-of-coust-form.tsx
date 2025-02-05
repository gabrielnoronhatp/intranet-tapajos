"use client";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { setOrderState } from "@/hooks/slices/noPaper/orderSlice";
import { FormSection } from "../form-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RootState } from "@/hooks/store";
import { Select } from "antd";
import { NumericFormat as NumberFormatComponent } from "react-number-format";
import { extractNumericValue, formatCurrency } from "@/lib/utils";

export default function CenterOfCoust() {
  const dispatch = useDispatch();
  const { ccustoOP, produtosOP, valorimpostoOP } = useSelector(
    (state: RootState) => state.order
  );
  const { centrosCustoOptions } = useSelector(
    (state: RootState) => state.noPaper
  );

  const [numCenters, setNumCenters] = useState(ccustoOP.length);

  useEffect(() => {
    setNumCenters(ccustoOP.length);
  }, [ccustoOP]);

  const handleNumCentersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = Math.max(1, parseInt(e.target.value, 10) || 1);
    setNumCenters(quantity);

    const newCenters = Array.from(
      { length: quantity },
      (_, index) => ccustoOP[index] || { centrocusto: "", valor: 0 }
    );

    dispatch(setOrderState({ ccustoOP: newCenters }));
    updateCenterValues(newCenters, valorimpostoOP);
  };

  const updateCenterValues = (centers: any[], totalValue: number) => {
    const total =
      produtosOP.reduce((sum, product) => sum + product.valor, 0) - totalValue;
    const valuePerCenter = total / centers.length;

    const updatedCenters = centers.map((center) => ({
      ...center,
      valor: valuePerCenter,
    }));

    dispatch(setOrderState({ ccustoOP: updatedCenters }));
  };

  const handleCenterChange = (
    index: number,
    field: "centrocusto" | "valor",
    value: string | number
  ) => {
    const updatedCenters = ccustoOP.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );

    dispatch(setOrderState({ ccustoOP: updatedCenters }));
    updateCenterValues(updatedCenters, valorimpostoOP);
  };

  const handleProductCenterChange = (
    productIndex: number,
    centerIndex: number,
    field: "centrocusto" | "valor",
    value: string | number
  ) => {
    const updatedProducts = produtosOP.map((product, i) => {
      if (i === productIndex) {
        const updatedCenters = product.centroCusto.map((center: any, ci: any) =>
          ci === centerIndex ? { ...center, [field]: value } : center
        );

        return { ...product, centroCusto: updatedCenters };
      }
      return product;
    });

    dispatch(setOrderState({ produtosOP: updatedProducts }));
  };

  return (
    <FormSection title="Centro de Custo">
      <div className="space-y-2">
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

      {ccustoOP.map((center: any, index: any) => (
        <div key={index} className="space-y-2">
          <Label className="text-xs font-semibold text-primary uppercase">
            Centro de Custo {index + 1}
          </Label>
          <Select
            showSearch
            onChange={(value: string) => {
              handleCenterChange(index, "centrocusto", value);
            }}
            value={center.centrocusto}
            className="w-full"
          >
            {centrosCustoOptions.map((option: any) => (
              <Select.Option
                key={option.id || option.centrocusto}
                value={option.id}
              >
                {option.centrocusto}
              </Select.Option>
            ))}
          </Select>
          
          <NumberFormatComponent
            value={center.valor}
            onChange={(values: any) =>
              handleCenterChange(index, "valor", values.floatValue)
            }
            placeholder="Valor"
            className="form-control w-full p-2 border rounded"
          />
        </div>
      ))}

      {produtosOP.map((product: any, productIndex: any) => (
        <div key={productIndex} className="space-y-4">
          {product.centroCusto.map((center: any, centerIndex: any) => (
            <div key={centerIndex} className="space-y-2">
              <Label className="text-xs font-semibold text-primary uppercase">
                Centro de Custo {centerIndex + 1}
              </Label>
              <Select
                showSearch
                optionFilterProp="children"
                onChange={(value: string) => {
                  handleProductCenterChange(
                    productIndex,
                    centerIndex,
                    "centrocusto",
                    value
                  );
                }}
                value={center.centrocusto || ""}
                className="w-full"
              >
                {centrosCustoOptions.map((option: any) => (
                  <Select.Option
                    key={option.centrocusto}
                    value={option.centrocusto}
                  >
                    {option.centrocusto}
                  </Select.Option>
                ))}
              </Select>

              <Input
                type="text"
                value={center.valor}
                onChange={(e: any) => {
                  const value= e.target.value;
                  handleProductCenterChange(
                    productIndex,
                    centerIndex,
                    "valor",
                    value
                  );
                }}
           
                className="form-control w-full p-2 border rounded"

              />
            </div>
          ))}
        </div>
      ))}

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-primary uppercase">
          Valor Total dos Itens
        </Label>
        <Input
          type="number"
          disabled
          value={produtosOP.reduce(
            (total, product) => total + product.valor - valorimpostoOP,
            0
          )}
          readOnly
          className="form-control"
        />
      </div>
    </FormSection>
  );
}
