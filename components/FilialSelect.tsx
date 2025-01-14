import { Label } from "@/components/ui/label";
import { fetchFiliais } from "@/hooks/slices/noPaperSlice";
import { setOrderState } from "@/hooks/slices/orderSlice";
import { RootState } from "@/hooks/store";
import { Select } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface FilialSelectProps {
  handleSetState: (key: string, value: any) => void;
  validate: boolean;
}

export const FilialSelect = ({ handleSetState, validate }: FilialSelectProps) => {
  const { filiais } = useSelector((state: RootState) => state.noPaper);
  const { lojaOP } = useSelector((state: RootState) => state.order);
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(fetchFiliais() as any);
  }, [dispatch]);

  const handleSelectChange = (value: string) => {
    setError("");
    dispatch(setOrderState({ lojaOP: value }));
    handleSetState("lojaOP", value);
  };

  useEffect(() => {
    if (validate && !lojaOP) {
      setError("Filial não pode ser vazia.");
    }
  }, [validate, lojaOP]);

  return (
    <div>
      <Label className="text-xs font-semibold text-primary uppercase">
        Selecione a Filial que Pagará
      </Label>
      <Select
        className="w-full"
        value={lojaOP}
        onChange={handleSelectChange}
        placeholder="Selecione uma filial..."
      >
        {filiais.map((filial) => (
          <Select.Option key={filial.loja} value={filial.loja}>
            {filial.loja}
          </Select.Option>
        ))}
      </Select>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};
