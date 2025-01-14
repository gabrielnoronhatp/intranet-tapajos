"use client";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { setOrderState } from "@/hooks/slices/orderSlice";
import { fetchCentrosCusto } from "@/hooks/slices/noPaperSlice";
import { SelectField } from "../select-field";
import { FormSection } from "../form-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RootState } from "@/hooks/store";

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
  }, [dispatch, ccustoOP, produtosOP, centrosCustoOptions, numCenters]);

  const handleNumCentersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = Math.max(1, parseInt(e.target.value, 10) || 1);
    setNumCenters(quantity);

    const newCenters = Array.from(
      { length: quantity },
      (_, index) => ccustoOP[index] || { centrocusto: "", valor: 0 }
    );

    dispatch(setOrderState({ ccustoOP: newCenters }));
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

      {ccustoOP.map((center:any, index:any) => (
        <div key={index} className="space-y-2">
          <Label className="text-xs font-semibold text-primary uppercase">
            Centro de Custo {index + 1}
          </Label>
          <SelectField
            onChange={(value: string) => {
              console.log("Centro de Custo selecionado:", value);
              handleCenterChange(index, "centrocusto", value); 
            }}
            label=""
            value={center.centrocusto?.centrocusto} 
            options={centrosCustoOptions.map((option: any) => ({
              value: option.centrocusto, 
              label: option.centrocusto,
            }))}
            className="w-full"
          />
          <Input
            type="number"
            value={center.centrocusto.valor}
            onChange={(e) => {
              const newValue = parseFloat(e.target.value) || 0;
              handleCenterChange(index, "valor", newValue);
            }}
            placeholder="Valor"
            className="form-control"
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
              <SelectField
                onChange={(value: string) => {
                  console.log("Centro de Custo selecionado:", value);  
                  handleProductCenterChange(productIndex, centerIndex, "centrocusto", value); 
                }}
                label=""
                value={center.centrocusto || ""} 
                options={centrosCustoOptions.map((option: any) => ({
                  value: option.id,  
                  label: option.centrocusto,  
                }))}
                className="w-full"
              />
              <Input
                type="number"
                value={center.valor}
                onChange={(e) =>
                  handleProductCenterChange(
                    productIndex,
                    centerIndex,
                    "valor",
                    parseFloat(e.target.value) || 0
                  )
                }
                placeholder="Valor"
                className="form-control"
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
