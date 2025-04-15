'use client';
import React from 'react';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '../ui/dialog';
import { useSelector } from 'react-redux';
import { RootState } from '@/hooks/store';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface CpfModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (cpf: string) => void;
}

export function CpfModal({ isOpen, onClose, onConfirm }: CpfModalProps) {
    const [cpf, setCpf] = useState<string>('');
    const acessToken = useSelector(
        (state: RootState) => state.auth.accessToken
    );

    const handleConfirm = async () => {
        if (!cpf) {
            alert('Por favor, insira um CPF válido.');
            return;
        }

        try {
            const response = await fetch(
                'https://sso.grupotapajos.com.br/cadastrar_cpf',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${acessToken}`,
                    },
                    body: JSON.stringify({ cpf }),
                }
            );

            if (!response.ok) {
                throw new Error('Erro ao gerar assinatura');
            }

            const data = await response.json();
            onConfirm(data.token);
            setCpf('');
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Digite o CPF</DialogTitle>
                </DialogHeader>
                <div className="flex justify-center">
                    <Input
                        type="text"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        className="w-full h-14 text-center text-xl"
                        style={{ fontSize: '1.5rem' }}
                        placeholder="000.000.000-00"
                    />
                </div>
                <DialogFooter className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        variant="default"
                        onClick={handleConfirm}
                        style={{ backgroundColor: '#11833b', color: 'white' }}
                    >
                        Confirmar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
