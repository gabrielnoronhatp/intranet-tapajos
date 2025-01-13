"use client";
import { FormSection } from "../form-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TaxesData() {
  return (
    <FormSection title="Dados de itens e Imposto">
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-primary uppercase">
          Itens da Nota
        </Label>
        <Input
          type="number"
          value=""
          min={1}
          className="form-control"
        />
        <p className="text-red-500 text-xs">Erro de exemplo</p>

        {[1, 2, 3].map((index) => (
          <div key={index} className="space-y-1">
            <Label className="text-xs font-semibold text-primary uppercase">
              Insira a Descrição e Valor do Item: {index + 1}
            </Label>
            <Input
              type="text"
              value=""
              placeholder="Insira a Descrição do Item"
              className="form-control"
              required
              minLength={1}
            />

            <Input
              type="number"
              value=""
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
          value=""
          min={0}
          className="form-control"
        />
      </div>
    </FormSection>
  );
}


