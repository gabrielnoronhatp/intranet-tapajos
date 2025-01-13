import { Label } from "@/components/ui/label";
import { fetchFiliais } from "@/hooks/slices/noPaperSlice";
import { RootState } from "@/hooks/store";
import { Select } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface FilialSelectProps {
  loading: boolean;
  error: any;
  filialOpen: boolean;
  selectedFilial: any;
  filiais: any[];
  handleSetState: (key: string, value: any) => void;
}

export const FilialSelect = ({
  handleSetState
}: FilialSelectProps) => {
  const [selectedFilial, setSelectedFilial] = useState<any>(null);
  const { filiais } = useSelector((state: RootState) => state.noPaper);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFiliais() as any);
  
  }, []);
 
  
   const handleSelectChange = (value: string) => {
    setSelectedFilial(value);
    console.log(value)
    handleSetState("selectedFilial", value);
  };



  return (
    <div>
      <Label className="text-xs font-semibold text-primary uppercase">
        Selecione a Filial que Pagará
      </Label>
      <Select
        className="w-full "
        value={selectedFilial ? selectedFilial.loja : ""}
        onChange={handleSelectChange}
      >
        <option value="" disabled>
          Selecione uma filial...
        </option>
        {filiais.map((filial) => (
          <Select.Option key={filial.loja} value={filial.loja}>
            {filial.loja}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
}; 