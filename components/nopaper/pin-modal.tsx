import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (pin: string) => void;
}

export function PinModal({ isOpen, onClose, onConfirm }: PinModalProps) {
  const [pin, setPin] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleConfirm = () => {
    onConfirm(pin.join(""));
    setPin(Array(6).fill(""));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Digite o PIN de Acesso</DialogTitle>
        </DialogHeader>
        <div className="flex space-x-2 justify-center">
          {pin.map((digit, index) => (
            <Input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              ref={(el) => {
                if (el) {
                  inputRefs.current[index] = el;
                }
              }}
              className="w-14 h-14 text-center text-xl"
              style={{ fontSize: '1.5rem' }}
            />
          ))}
        </div>
        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="default" onClick={handleConfirm} style={{ backgroundColor: '#11833b', color: 'white' }}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 