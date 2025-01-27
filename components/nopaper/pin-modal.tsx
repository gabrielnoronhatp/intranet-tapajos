"use client";
import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import { RootState } from "@/hooks/store";

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (pin: string) => void;
}

export function PinModal({ isOpen, onClose, onConfirm }: PinModalProps) {
  const [pin, setPin] = useState<string[]>(Array(6).fill(""));
  const acessToken = useSelector((state: RootState) => state.auth.accessToken);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      generateSignature();
    }
  }, [isOpen]);

  const generateSignature = async () => {
    console.log("acessToken", acessToken);
    try {
      const response = await fetch(
        "https://sso.grupotapajos.com.br/gerar_assinatura",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${acessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao gerar assinatura");
      }

      const data = await response.json();
      console.log("Assinatura gerada:", data);
    } catch (error) {
      console.error("Erro ao gerar assinatura:", error);
    }
  };

  const handleChange = (value: string, index: number) => {
    if (value.length > 1) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleConfirm = async () => {
    const pinString = pin.join("");
    if (pinString.length !== 6) {
      alert("Por favor, insira um PIN válido de 6 dígitos.");
      return;
    }

    try {
      const response = await fetch(
        "https://sso.grupotapajos.com.br/gerar_assinatura",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${acessToken}`,
          },
          body: JSON.stringify({ pin: pinString }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao gerar assinatura");
      }

      const data = await response.json();
      onConfirm(data.token);
      setPin(Array(6).fill(""));
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Digite o PIN</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center space-x-2">
          {pin.map((digit, index) => (
            <Input
              key={index}
              type="text"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              maxLength={1}
              ref={(el) => {
                if (el) inputRefs.current[index] = el;
              }}
              className="w-12 h-14 text-center text-xl"
              style={{ fontSize: "1.5rem" }}
            />
          ))}
        </div>
        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="default"
            onClick={handleConfirm}
            style={{ backgroundColor: "#11833b", color: "white" }}
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
