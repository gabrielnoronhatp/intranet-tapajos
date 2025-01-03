"use client";
import { SelectField } from "../select-field";
import { FormSection } from "../form-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CentroCusto } from "@/types/Order/CentroCustoType";
import { fetchCentrosCusto } from "@/hooks/slices/noPaperSlice";
export default function CenterOfCoust() {
  const dispatch = useDispatch();
    const {
    valorTotal,
  } = useSelector((state: any) => state.order);

  const {
    centrosCustoOptions,
    searchQuery,
    isLoading
  } = useSelector((state: any) => state.noPaper);
 
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
 
  const [centrosCusto, setCentrosCusto] = useState<CentroCusto[]>([
    { centroCusto: "", valor: 0 },
  ]);

  const formattedOptions = centrosCustoOptions.map((option: any) => ({
    label: option.nome,
    value: option.id,
  }));

    const handleCentrosCustoNumberChange = (
        e: React.ChangeEvent<HTMLInputElement>
      ) => {
        const numCentros = parseInt(e.target.value, 10);
        if (numCentros < 1) {
          console.error("Número de centros de custo deve ser pelo menos 1.");
        }
        setCentrosCusto((prevCentrosCusto) => {
          const newCentrosCusto = Array.from(
            { length: numCentros },
            (_, index) => prevCentrosCusto[index] || { centroCusto: "", valor: 0 }
          );
          return newCentrosCusto;
        });
      };
    
      const handleCentrosCustoChange = (
        index: number,
        field: "centroCusto" | "valor",
        value: any
      ) => {
        setCentrosCusto((prevCentrosCusto) => {
          const newCentrosCusto = [...prevCentrosCusto];
          if (field === "centroCusto") {
            newCentrosCusto[index] = {
              ...newCentrosCusto[index],
              centroCusto: value as string,
            };
          } else {
            newCentrosCusto[index] = {
              ...newCentrosCusto[index],
              valor: value,
            };
          }
          return newCentrosCusto;
        });
      };
    
      useEffect(() => {
        
        dispatch(fetchCentrosCusto() as any);
      }, [dispatch, searchQuery]);
    

  return (
      <FormSection title="Centro de Custo">
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-primary uppercase">
          Número de Centros de Custo
        </Label>
        <Input
          type="number"
          value={centrosCusto.length}
          onChange={handleCentrosCustoNumberChange}
          min={1}
          className="form-control"
        />
      </div>
      {errors.centrosCusto && (
        <p className="text-red-500 text-xs">{errors.centrosCusto}</p>
      )}
      {centrosCusto.map((centro: any, index: number) => (
        <div key={index} className="space-y-2">
          <Label className="text-xs font-semibold text-primary uppercase">
            Centro de Custo {index + 1}
          </Label>
          <SelectField
            label=""
            value={centro.centroCusto || ""}
            onChange={(value: string) =>
              handleCentrosCustoChange(index, "centroCusto", value)
            }
            options={formattedOptions}
            
          />
          {errors.centrosCusto && (
            <p className="text-red-500 text-xs">
              {errors.centrosCusto}
            </p>
          )}
          <Input
            type="number"
            value={centro.valor}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (!isNaN(value)) {
                handleCentrosCustoChange(index, "valor", value);
              }
            }}
            placeholder="Valor"
            className="form-control"
          />
          {errors.centrosCusto && (
            <p className="text-red-500 text-xs">
              {errors.centrosCusto}
            </p>
          )}
        </div>
      ))}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-primary uppercase">
          Valor Total dos Itens
        </Label>
        <Input
          type="number"
          disabled
          value={valorTotal}
          readOnly
          className="form-control"
        />
      </div>
    </FormSection>
 
   
  );
}