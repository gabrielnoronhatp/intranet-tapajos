'use client';

import React from 'react';
import { useState, useRef, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSelector } from 'react-redux';
import { RootState } from '@/hooks/store';
import Lottie from 'react-lottie';
import SuccessIcon from '@/app/assets/success.json';
import { toast } from 'sonner';

interface PinModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (pin: string) => void;
    orderId: number;
}

export function PinModal({ isOpen, onClose, onConfirm }: PinModalProps) {
    const [pin, setPin] = useState<string[]>(Array(6).fill(''));
    const acessToken = useSelector(
        (state: RootState) => state.auth.accessToken
    );
    const [token, setToken] = useState<string>('');
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const orderId = useSelector((state: RootState) => state.noPaper.orderId);
    const user = useSelector((state: RootState) => state.auth.user);
    const signatureNumber = useSelector(
        (state: RootState) => state.noPaper.signatureNumber
    );
    const [showSuccess, setShowSuccess] = useState(false);

    const defaultOptions = {
        loop: false,
        autoplay: true,
        animationData: SuccessIcon,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    const generateSignature = async () => {
        try {
            const response = await fetch(
                'https://sso.grupotapajos.com.br/gerar_assinatura',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${acessToken}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Erro ao gerar assinatura');
            }

            const data = await response.json();

            setToken(data.token);
        } catch (error) {
            console.error('Erro ao gerar assinatura:', error);
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
        const pinString = pin.join('');
        if (pinString.length !== 6) {
            alert('Por favor, insira um PIN válido de 6 dígitos.');
            return;
        }

        const tokenWithoutDash = token.replace(/-/g, '');

        try {
            if (tokenWithoutDash === pinString) {
                const response = await fetch(
                    'http://10.2.10.17:3001/api/orders/signature',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${acessToken}`,
                        },
                        body: JSON.stringify({
                            orderId: orderId,
                            signerName: user?.username,
                            token: pinString,
                            signatureNumber: signatureNumber,
                        }),
                    }
                );

                if (!response.ok) {
                    toast.error(
                        'Erro ao registrar assinatura ou permissão insuficiente para assinar.'
                    );
                    throw new Error('Erro ao registrar assinatura');
                }

                const data = await response.json();

                setPin(Array(6).fill(''));
                setShowSuccess(true);

                setTimeout(() => {
                    setShowSuccess(false);
                    onConfirm(data.token);
                    onClose();
                }, 2000);
            }
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            generateSignature();
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={() => {}}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Digite o PIN</DialogTitle>
                </DialogHeader>
                {showSuccess ? (
                    <div className="flex justify-center">
                        <Lottie
                            options={defaultOptions}
                            height={400}
                            width={400}
                        />
                    </div>
                ) : (
                    <div className="flex justify-center space-x-2">
                        {pin.map((digit, index) => (
                            <Input
                                key={index}
                                type="text"
                                value={digit}
                                onChange={(e) =>
                                    handleChange(e.target.value, index)
                                }
                                maxLength={1}
                                ref={(el) => {
                                    if (el) inputRefs.current[index] = el;
                                }}
                                className="w-12 h-14 text-center text-xl"
                                style={{ fontSize: '1.5rem' }}
                            />
                        ))}
                    </div>
                )}
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
