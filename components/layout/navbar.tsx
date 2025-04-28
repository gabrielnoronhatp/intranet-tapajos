'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, LogOut } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { tpLogo } from '@/app/assets';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/hooks/store';
import { logout } from '@/hooks/slices/authSlice';

interface NavbarProps {
    onToggleSidebar: () => void;
}

export function Navbar({ onToggleSidebar }: NavbarProps) {
    const dispatch = useDispatch();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const user = useSelector((state: RootState) => state.auth.user);

    const getInitials = (name: string) => {
        const nameParts = name.split(' ');
        const initials = nameParts
            .slice(0, 2)
            .map((n) => n[0])
            .join('');
        return initials.toUpperCase();
    };

    const handleLogout = () => {
        dispatch(logout());
        fetch('https://sso.grupotapajos.com.br/logout', {
            method: 'POST',
            credentials: 'include',
        })
            .then((response) => {
                if (response.ok) {
                    setIsLoggedIn(false);
                    console.log('Usuário deslogado');
                } else {
                    console.error('Erro ao deslogar');
                }
            })
            .catch((error) => {
                console.error('Erro na requisição de logout:', error);
            });
    };

    useEffect(() => {
        const fetchUser = () => {
            setIsLoggedIn(true);
        };

        fetchUser();
    }, []);

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-primary text-primary-foreground z-50 px-4">
            <div className="h-full flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggleSidebar}
                        className="hover:bg-primary/90"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                    <Image
                        src={tpLogo}
                        alt="Logo"
                        width={120}
                        height={40}
                        className="object-contain"
                    />
                </div>
                <div className="flex items-center gap-6">
                    {isLoggedIn && user ? (
                        <>
                            <div className="relative">
                                {user.profilePicture ? (
                                    <span
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 text-white font-semibold"
                                        title={user.nome}
                                    >
                                        {getInitials(user.nome)}
                                    </span>
                                ) : (
                                    <span
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 text-white font-semibold"
                                        title={user.nome}
                                    >
                                        {getInitials(user.nome)}
                                    </span>
                                )}
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleLogout}
                                className="hover:bg-primary/90"
                            >
                                <LogOut className="h-5 w-5 text-white" />
                            </Button>
                        </>
                    ) : (
                        <Link href="/" className="text-white">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
