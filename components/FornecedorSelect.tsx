import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface FornecedorSelectProps {
  open: boolean;
  selectedFornecedor: any;
  fornecedores: any[];
  handleSetState: (key: string, value: any) => void;
}

export const FornecedorSelect = ({
  open,
  selectedFornecedor,
  fornecedores,
  handleSetState,
}: FornecedorSelectProps) => (
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
          {selectedFornecedor ? selectedFornecedor.fornecedor : "Selecione um fornecedor..."}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <div className="max-h-[200px] overflow-auto">
          {fornecedores.map((fornecedor: any) => (
            <div
              key={fornecedor}
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
); 