'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { useDispatch } from 'react-redux';
import { login } from '@/hooks/slices/authSlice';
import { CpfModal } from '@/components/nopaper/cpf-modal';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export default function TokenPage() {
    const dispatch = useDispatch();
    const router: AppRouterInstance = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const searchParams = useSearchParams();
    const token =
        searchParams.get('token') ||
        (typeof window !== 'undefined' &&
            window.location.pathname.split('/').pop());

    const handleCpfConfirm = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwt.decode(token as string) as JwtPayload;
                dispatch(
                    login({
                        nome: decodedToken.nome,
                        email: decodedToken.email,
                        username: decodedToken.username,
                        accessToken: token,
                        profilePicture: decodedToken.foto_perfil_url,
                    })
                );

                if (!decodedToken.cpf) {
                    setIsModalOpen(true);
                    return;
                }

                router.push('/');
            } catch (error) {
                console.error('Erro ao decodificar JWT:', error);
            }
        }
    }, [token, router, dispatch]);

    return (
        <>
            <CpfModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleCpfConfirm}
            />
        </>
    );
}
