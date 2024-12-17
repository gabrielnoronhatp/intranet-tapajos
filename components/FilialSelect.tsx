import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface FilialSelectProps {
  loading: boolean;
  error: any;
  filialOpen: boolean;
  selectedFilial: any;
  filiais: any[];
  handleSetState: (key: string, value: any) => void;
}

export const FilialSelect = ({
  loading,
  error,
  filialOpen,
  selectedFilial,
  filiais,
  handleSetState,
}: FilialSelectProps) => {
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading filiais: {error}</p>;

  return (
    <div>
      <Label className="text-xs font-semibold text-primary uppercase">
        Selecione a Filial que Pagará
      </Label>
      <Popover open={filialOpen} onOpenChange={(value) => handleSetState("filialOpen", value)}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={filialOpen}
            className="justify-between w-full"
          >
            {selectedFilial ? selectedFilial.loja : "Selecione uma filial..."}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <div className="max-h-[200px] overflow-auto">
            {filiais.map((filial: any) => (
              <div
                key={filial.loja}
                className="px-4 py-2 hover:bg-primary/10 cursor-pointer"
                onClick={() => {
                  handleSetState("selectedFilial", filial);
                  handleSetState("filialOpen", false);
                }}
              >
                {filial.loja}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}; 