import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFornecedores } from "@/hooks/slices/noPaper/noPaperSlice";
import { Select } from "antd";
import { RootState } from "@/hooks/store";
import { setOrderState } from "@/hooks/slices/noPaper/orderSlice";



interface FornecedorSelectProps {
  handleSetState: (key: string, value: any) => void;
}

export const FornecedorSelect = ({
  handleSetState,
}: FornecedorSelectProps) => {
  const dispatch = useDispatch();
  

  const searchQuery = useSelector((state: any) => state.noPaper.searchQuery || "");
  const { fornecedores } = useSelector((state: RootState) => state.noPaper);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const {fornecedorOP} = useSelector((state: RootState) => state.order);
  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(fetchFornecedores(localSearchQuery) as any);
  }, [dispatch, localSearchQuery]);

  const options = fornecedores.map((fornecedor) => ({
    value: fornecedor.fornecedor,
    label: fornecedor.fornecedor,
  }));


  const handleSelectChange = (value: string) => {
    if (!value) {
      setError("Fornecedor não pode ser vazio.");
    } else {
      setError("");
      dispatch(setOrderState({ fornecedorOP: value }));
      handleSetState("fornecedorOP", value);
    }
  };



  return (
    <div>
      <Label className="text-xs font-semibold text-primary uppercase">
        Selecione o Fornecedor
      </Label>
      <Select
        showSearch
        placeholder="Pesquisar fornecedor..."
        optionFilterProp="children" 
        
        value={fornecedorOP}
        onChange={handleSelectChange}
        onSearch={(value) => setLocalSearchQuery(value)}
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        options={options}
        style={{ width: '100%' }}
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};