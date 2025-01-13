"use client";
import { SelectField } from "../select-field";
import { FormSection } from "../form-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CenterOfCoust() {
  return (
    <FormSection title="Centro de Custo">
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-primary uppercase">
          Número de Centros de Custo
        </Label>
        <Input
          type="number"
          value={0}
          min={1}
          className="form-control"
        />
        <p className="text-red-500 text-xs">Erro de exemplo</p>
      </div>
      {[1, 2, 3].map((index) => (
        <div key={index} className="space-y-2">
          <Label className="text-xs font-semibold text-primary uppercase">
            Centro de Custo {index}
          </Label>
          <SelectField
            onChange={() => {}}
            label=""
            value=""
            options={[]}
            className="w-full"
          />
          <p className="text-red-500 text-xs">Erro de exemplo</p>
          <Input
            type="number"
            value={0}
            placeholder="Valor"
            className="form-control"
          />
          <p className="text-red-500 text-xs">Erro de exemplo</p>
        </div>
      ))}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-primary uppercase">
          Valor Total dos Itens
        </Label>
        <Input
          type="number"
          disabled
          value={0}
          readOnly
          className="form-control"
        />
      </div>
    </FormSection>
  );
}