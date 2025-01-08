"use client";
import { SelectField } from "../select-field";
import { FormSection } from "../form-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CentroCusto } from "@/types/Order/CentroCustoType";
import { fetchCentrosCusto } from "@/hooks/slices/noPaperSlice";
import { setOrderState } from "@/hooks/slices/orderSlice";
import { setFieldError, clearFieldError } from "@/hooks/slices/errorSlice";

export default function CenterOfCoust() {
  const dispatch = useDispatch();
  
  const { valorTotal, valorImposto, valorCentrosCusto,itens } = useSelector((state: any) => state.order);
  
  const { centrosCustoOptions, searchQuery } = useSelector((state: any) => state.noPaper);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [centrosCusto, setCentrosCusto] = useState<CentroCusto[]>([
    { centroCusto: "", valor: 0 },
  ]);

  const formattedOptions = centrosCustoOptions.map((option: any) => ({
    label: option.nome || option.centrocusto,
    value: option.nome || option.centrocusto,
  }));
 

  const handleCentrosCustoNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    console.log(`Changing ${field} at index ${index} to:`, value);
    setCentrosCusto((prevCentrosCusto) => {
      const newCentrosCusto = [...prevCentrosCusto];
      newCentrosCusto[index] = {
        ...newCentrosCusto[index],
        [field]: value,
      };
      return newCentrosCusto;
    });
  };

  useEffect(() => {
    dispatch(fetchCentrosCusto() as any);
  }, [dispatch, searchQuery]);

  useEffect(() => {
    dispatch(setOrderState({ centrosCusto }));
  }, [centrosCusto, dispatch]);


  const valorTotalMenosImposto = valorTotal + (valorImposto || 0);


  const totalCentrosCusto = centrosCusto.reduce((sum:any, centro:any) => sum + (centro.valor || 0), 0);
  const totalItens = itens.reduce((sum:any, item:any) => sum + (item.valor || 0), 0) - valorImposto;
  

  useEffect(() => {
    if (totalCentrosCusto !== valorTotalMenosImposto) {
      setErrors({
        ...errors,
        centrosCusto: "O valor total dos centros de custo deve ser igual ao valor total dos itens menos o imposto"
      });
    } else {

      const newErrors = { ...errors };
      delete newErrors.centrosCusto;
      setErrors(newErrors);
    }
  }, [totalCentrosCusto, valorTotalMenosImposto]);

  const { formErrors } = useSelector((state: any) => state.error);

  const handleSetState = (field: keyof any, value: any) => {
    dispatch(setOrderState({ [field]: value }));
    validateField(field as string, value);
  };

  const validateField = (field: string, value: any) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      dispatch(setFieldError({ 
        field, 
        message: `O campo ${field} é obrigatório` 
      }));
    } else {
      dispatch(clearFieldError(field));
    }
  };

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
        {formErrors.centrosCusto && <p className="text-red-500 text-xs">{formErrors.centrosCusto}</p>}
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
            value={formattedOptions.find((opt: any) => opt.value === centro.centroCusto)?.value || ''}
            onChange={(value: string) => {
              console.log('Selected value:', value);
              handleCentrosCustoChange(index, "centroCusto", value);
            }}
            options={formattedOptions}
            className="w-full"
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
          value={totalItens}
          readOnly
          className="form-control"
        />
      </div>
    </FormSection>
  );
}