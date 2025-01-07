import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { fetchFornecedores } from "@/hooks/slices/noPaperSlice";
import { useDispatch, useSelector } from "react-redux";

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

  selectedFornecedor,
  fornecedores,
  handleSetState,
}: FornecedorSelectProps) => {
  
  const dispatch = useDispatch();
  const searchQuery = useSelector((state: any) => state.noPaper.searchQuery || "");
 
  function handleSearchQuery(value: any) {
    handleSetState("searchQuery", value);
    if (value === "" || !isNaN(value)) {
      dispatch(fetchFornecedores(value) as any);
    }
  }

  const filteredFornecedores = fornecedores.filter((fornecedor: Fornecedor) =>
    fornecedor.fornecedor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
  <div className="flex flex-col space-y-1.5">
    <Label className="text-xs font-semibold text-primary uppercase">
      Selecione o Parceiro
    </Label>
    <Popover open={open} onOpenChange={(value) => handleSetState("open", value)}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
            <span className="truncate block max-w-[90%]">
              {selectedFornecedor ? selectedFornecedor.fornecedor : "Selecione um fornecedor..."}
            </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <div className="max-h-[200px] overflow-auto">
          <Input
            type="text"
            placeholder="Pesquisar fornecedor..."
            
            value={searchQuery}
            onChange={(e) => handleSearchQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          {filteredFornecedores.map((fornecedor: Fornecedor) => (
            <div
              key={fornecedor.fornecedor}
              
              className="px-4 py-2 hover:bg-primary/10 cursor-pointer"
              onClick={() => {
                handleSetState("selectedFornecedor", fornecedor);
                handleSetState("open", false);
              }}
            >
              {fornecedor.fornecedor}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  </div>
) }