"use client";
import { SelectField } from "../select-field";
import { FormSection } from "../form-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function FinancialData() {
  return (
    <FormSection title="Dados Financeiros">
      <div className="space-y-2">
        <SelectField
          onChange={() => {}}
          label="Escolha a Forma de Pagamento"
          value=""
          options={[
            { value: "avista", label: "À VISTA" },
            { value: "deposito", label: "DEPÓSITO" },
            { value: "boleto", label: "BOLETO" },
            { value: "pix", label: "PIX" },
          ]}
        />
        <p className="text-red-500 text-xs">Erro de exemplo</p>

        <div className="space-y-2">
          <Label className="text-xs font-semibold text-primary uppercase">
            Data de Vencimento
          </Label>
          <Input type="date" value="" className="form-control" />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold text-primary uppercase">
            Banco
          </Label>
          <Input type="text" value="" placeholder="Banco" className="form-control" />

          <Label className="text-xs font-semibold text-primary uppercase">
            Agência
          </Label>
          <Input type="text" value="" placeholder="Agência" className="form-control" />

          <Label className="text-xs font-semibold text-primary uppercase">
            Conta
          </Label>
          <Input type="text" value="" placeholder="Conta" className="form-control" />

          <Label className="text-xs font-semibold text-primary uppercase">
            Data de Depósito
          </Label>
          <Input type="date" value="" className="form-control" />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold text-primary uppercase">
            Número de Parcelas
          </Label>
          <Input type="number" value="" min={1} max={12} className="form-control" />
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-primary uppercase">
              Data de Vencimento 1
            </Label>
            <Input type="date" value="" className="form-control" />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold text-primary uppercase">
            Tipo de Chave PIX
          </Label>
          <SelectField
            onChange={() => {}}
            value=""
            options={[
              { value: "cpf/cnpj", label: "CPF/CNPJ" },
              { value: "telefone", label: "Telefone" },
              { value: "email", label: "E-mail" },
              { value: "aleatoria", label: "Aleatória" },
            ]}
            label=""
          />
          <Label className="text-xs font-semibold text-primary uppercase">
            Chave PIX
          </Label>
          <Input type="text" value="" placeholder="Insira a Chave PIX" className="form-control" />
          <Label className="text-xs font-semibold text-primary uppercase">
            Data de Pagamento PIX
          </Label>
          <Input type="date" value="" className="form-control" />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-primary uppercase">
          Conta Gerencial
        </Label>
        <SelectField onChange={() => {}} value="" options={[]} label="" />
      </div>
    </FormSection>
  );
}



//    