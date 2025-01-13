import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFornecedores } from "@/hooks/slices/noPaperSlice";
import { Select } from "antd";
import { RootState } from "@/hooks/store";

interface Fornecedor {
  fornecedor: string;
}

interface FornecedorSelectProps {
  open: boolean;
  searchQuery: any;
  selectedFornecedor: Fornecedor | null;
  fornecedores: Fornecedor[];
  handleSetState: (key: string, value: any) => void;
}

export const FornecedorSelect = ({
  open,
  handleSetState,
  
}: FornecedorSelectProps) => {
  const dispatch = useDispatch();
  
  const [selectedFornecedor, setSelectedFornecedor] = useState("");
  const searchQuery = useSelector((state: any) => state.noPaper.searchQuery || "");
  const { fornecedores } = useSelector((state: RootState) => state.noPaper);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  useEffect(() => {
    dispatch(fetchFornecedores(localSearchQuery) as any);
  }, [dispatch, localSearchQuery]);

  const options = fornecedores.map((fornecedor) => ({
    value: fornecedor.fornecedor,
    label: fornecedor.fornecedor,
  }));





  return (
    <div>
      <Label className="text-xs font-semibold text-primary uppercase">
        Selecione o Fornecedor
      </Label>
      <Select
        showSearch
        placeholder="Pesquisar fornecedor..."
        optionFilterProp="children"
        value={selectedFornecedor ? selectedFornecedor : undefined}
        onChange={(value) => {
          const selected = fornecedores.find(fornecedor => fornecedor.fornecedor === value);
          handleSetState("selectedFornecedor", selected);
        }}
        onSearch={(value) => setLocalSearchQuery(value)}
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        options={options}
        style={{ width: '100%' }}
      />
    </div>
  );
};