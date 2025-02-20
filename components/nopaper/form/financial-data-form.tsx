"use client";
import { setOrderState } from "@/hooks/slices/noPaper/orderSlice";
import { SelectField } from "../select-field";
import { FormSection } from "../form-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContasGerenciais } from "@/hooks/slices/noPaper/noPaperSlice";
import {
  setFieldError,
  clearFieldError,
} from "@/hooks/slices/noPaper/errorSlice";
import { Select } from "antd";

export default function FinancialData() {
  const dispatch = useDispatch();
  const handleSetState = (field: keyof any, value: any) => {
    dispatch(setOrderState({ [field]: value }));
    validateField(field as string, value);
  };
  const {
    metodoOP,
    installments,
    installmentDates,
    dtavista,
    bancoOP,
    contagerencialOP,
    agenciaOP,
    dtdepositoOP,
    tipopixOP,
    chavepixOP,
    datapixOP,
    qtparcelasOP,
    contaOP,
  } = useSelector((state: any) => state.order);

  const { contasGerenciais } = useSelector((state: any) => state.noPaper);
  const { formErrors } = useSelector((state: any) => state.error);

  const validateField = (field: string, value: any) => {
    if (!value || (typeof value === "string" && !value.trim())) {
      dispatch(
        setFieldError({
          field,
          message: `O campo ${field} é obrigatório`,
        })
      );
    } else {
      dispatch(clearFieldError(field));
    }
  };

  useEffect(() => {
    dispatch(fetchContasGerenciais("") as any);
  }, [dispatch]);

  const handleFormaPagamentoChange = (value: string) => {
    handleSetState("metodoOP", value);
    if (value === "avista") {
      handleSetState("qtparcelasOP", 1);
      handleSetState("installmentDates", []);
    } else if (value !== "boleto") {
      handleSetState("qtparcelasOP", 1);
      handleSetState("installmentDates", []);
    }
  };

  const handleInstallmentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numInstallments = parseInt(e.target.value, 10);
    handleSetState("qtparcelasOP", numInstallments);
    handleSetState("parcelasOP", numInstallments);
    handleSetState("installmentDates", Array(numInstallments).fill(""));
  };

  const handleInstallmentDateChange = (index: number, date: string) => {
    const newDates = [...installmentDates];
    newDates[index] = date;
    handleSetState("installmentDates", newDates);
  };

  const handleSetStatePix = (field: string, value: string) => {
    if (field === "chavepixOP") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length === 11) {
        value = numericValue.replace(
          /(\d{3})(\d{3})(\d{3})(\d{2})/,
          "$1.$2.$3-$4"
        );
      } else if (numericValue.length === 14) {
        value = numericValue.replace(
          /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
          "$1.$2.$3/$4-$5"
        );
      } 
    }

    handleSetState(field, value);
  };

  return (
    <FormSection title="Dados Financeiros">
      <div className="space-y-2">
        <SelectField
          label="Escolha a Forma de Pagamento"
          value={metodoOP}
          onChange={handleFormaPagamentoChange}
          options={[
            { value: "avista", label: "À VISTA" },
            { value: "deposito", label: "DEPÓSITO" },
            { value: "boleto", label: "BOLETO" },
            { value: "pix", label: "PIX" },
          ]}
        />
        {formErrors.formaPagamento && (
          <p className="text-red-500 text-xs">{formErrors.formaPagamento}</p>
        )}

        {metodoOP === "avista" && (
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-primary uppercase">
              Data de Vencimento
            </Label>
            <Input
              type="date"
              value={dtavista}
              onChange={(e) => handleSetState("dtavista", e.target.value)}
              className="form-control"
            />
          </div>
        )}

        {metodoOP === "boleto" && (
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-primary uppercase">
              Número de Parcelas
            </Label>
            <Input
              type="number"
              value={qtparcelasOP}
              onChange={handleInstallmentsChange}
              min={1}
              max={12}
              className="form-control"
            />
            {Array.from({ length: qtparcelasOP }).map((_, index) => (
              <div key={index} className="space-y-1">
                <Label className="text-xs font-semibold text-primary uppercase">
                  Data de Vencimento {index + 1}
                </Label>
                <Input
                  type="date"
                  value={installmentDates[index]}
                  onChange={(e) =>
                    handleInstallmentDateChange(index, e.target.value)
                  }
                  className="form-control"
                />
              </div>
            ))}
          </div>
        )}

        {metodoOP === "deposito" && (
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-primary uppercase">
              Banco
            </Label>
            <Input
              type="text"
              value={bancoOP}
              maxLength={3}
              onChange={(e) => handleSetState("bancoOP", e.target.value)}
              placeholder="Banco"
              className="form-control"
            />
            <Label className="text-xs font-semibold text-primary uppercase">
              Agência
            </Label>
            <Input
              type="text"
              value={agenciaOP}
              maxLength={5}
              onChange={(e) => handleSetState("agenciaOP", e.target.value)}
              placeholder="Agência"
              className="form-control"
            />
            <Label className="text-xs font-semibold text-primary uppercase">
              Conta
            </Label>
            <Input
              type="text"
              value={contaOP}
              maxLength={8}
              onChange={(e) => handleSetState("contaOP", e.target.value)}
              placeholder="Conta"
              className="form-control"
            />
            <Label className="text-xs font-semibold text-primary uppercase">
              Data de Depósito
            </Label>
            <Input
              type="date"
              value={dtdepositoOP}
              onChange={(e) => handleSetState("dtdepositoOP", e.target.value)}
              className="form-control"
            />
          </div>
        )}

        {metodoOP === "pix" && (
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-primary uppercase">
              Tipo de Chave PIX
            </Label>
            <SelectField
              value={tipopixOP}
              onChange={(value: string) => handleSetState("tipopixOP", value)}
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
            <Input
              type="text"
              value={chavepixOP}
              onChange={(e) => handleSetStatePix("chavepixOP", e.target.value)}
              placeholder="Insira a Chave PIX"
              className="form-control"
            />
            <Label className="text-xs font-semibold text-primary uppercase">
              Data de Pagamento PIX
            </Label>
            <Input
              type="date"
              value={datapixOP}
              onChange={(e) => handleSetState("datapixOP", e.target.value)}
              className="form-control"
            />
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-primary uppercase">
          Conta Gerencial
        </Label>
        <Select
          className="w-full"
          showSearch
          value={contagerencialOP}
          onChange={(value: string) =>
            handleSetState("contagerencialOP", value)
          }
          options={contasGerenciais.map((conta: any) => ({
            value: conta.conta,
            label: conta.conta,
          }))}
        />
        {contasGerenciais.map((conta: any) => (
          <Select.Option key={conta.conta} value={conta.conta}>
            {conta.conta}
          </Select.Option>
        ))}
      </div>
    </FormSection>
  );
}

//
