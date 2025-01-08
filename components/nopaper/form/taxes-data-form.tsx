"use client";
import { setOrderState } from "@/hooks/slices/orderSlice";
import { FormSection } from "../form-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContasGerenciais } from "@/hooks/slices/noPaperSlice";
import { submitOrder, prepareOrderData } from "@/hooks/slices/orderSlice";
import { FilialSelect } from "@/components/FilialSelect";
import { FornecedorSelect } from "@/components/FornecedorSelect";
import { Item } from "@/types/Order/OrderTypes";
import { RootState } from "@/hooks/store";
import { setFieldError, clearFieldError } from "@/hooks/slices/errorSlice";

export default function TaxesData() {
  const dispatch = useDispatch();
  const handleSetState = (field: keyof any, value: any) => {
    dispatch(setOrderState({ [field]: value }));
    validateField(field as string, value);
  };
  const { quantidadeProdutos, valorImposto, centrosCusto } = useSelector(
    (state: RootState) => state.order
  );

  const { searchQuery } = useSelector((state: RootState) => state.noPaper);
  const [itens, setItens] = useState<Item[]>([
    { produto: "", valor: 0, centroCusto: [] }
  ]);

  const { formErrors } = useSelector((state: any) => state.error);

  useEffect(() => {
    dispatch(fetchContasGerenciais() as any);
  }, [dispatch, searchQuery]);

  const handleItensChange = (
    index: number,
    field: "produto" | "valor" | "centroCusto",
    value: string | number
  ) => {
    setItens(prevItens => {
      const updatedItens = prevItens.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            [field]: field === "valor" ? Number(value) : value,
          };
        }
        return item;
      });
      
      dispatch(setOrderState({ itens: updatedItens }));
      return updatedItens;
    });
  };

  const handleQuantidadeProdutosChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const quantidade = parseInt(e.target.value, 10);
    handleSetState("quantidadeProdutos", quantidade);
    
    const newItens = Array.from(
      { length: quantidade },
      (_, index) => itens[index] || { 
        produto: "Produto " + (index + 1),
        valor: 0, 
        centroCusto: centrosCusto.map(cc => ({
          centroCusto: cc.centroCusto,
          valor: 0
        }))
      }
    );
    
    setItens(newItens);
    dispatch(setOrderState({ itens: newItens }));
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
    <FormSection title="Dados de itens e Imposto">
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-primary uppercase">
          Itens da Nota
        </Label>
        <Input
          type="number"
          value={quantidadeProdutos}
          onChange={handleQuantidadeProdutosChange}
          min={1}
          className="form-control"
        />
        {formErrors.quantidadeProdutos && <p className="text-red-500 text-xs">{formErrors.quantidadeProdutos}</p>}

        {itens.map((item: Item, index: number) => (
          <div key={index} className="space-y-1">
            <Label className="text-xs font-semibold text-primary uppercase">
              Insira a Descrição e Valor do Item: {index + 1}
            </Label>
            <Input
              type="text"
              value={item.produto}
              onChange={(e) =>
                    handleItensChange(index, "produto", e.target.value)
              }
              placeholder="Insira a Descrição do Item"
              className="form-control"
              required
              minLength={1}
            />

            <Input
              type="number"
              value={item.valor}
              onChange={(e) =>
                handleItensChange(index, "valor", e.target.value)
              }
              placeholder="Insira o Valor do Item"
              min={0.01}
              step={0.01}
              className="form-control"
            />
          </div>
        ))}

        <Label className="text-xs font-semibold text-primary uppercase">
          Valor do Imposto
        </Label>
        <Input
          type="number"
          value={valorImposto}
          onChange={(e) =>
            handleSetState("valorImposto", parseFloat(e.target.value))
          }
          min={0}
          className="form-control"
        />
      </div>
    </FormSection>
  );
}


