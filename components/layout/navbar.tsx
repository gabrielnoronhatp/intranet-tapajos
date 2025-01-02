"use client";

import { Button } from "@/components/ui/button";
import { Menu, LogOut } from "lucide-react"; // Adicionando o ícone de logout
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { tpLogo } from "@/app/assets";
import { useState, useEffect } from "react"; // Importando hooks para gerenciar estado
import { useSelector } from "react-redux";
import { RootState } from "@/hooks/store";

interface NavbarProps {
  onToggleSidebar: () => void;
}

export function Navbar({ onToggleSidebar }: NavbarProps) {
  const pathname = usePathname();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Verifica se o usuário está logado
  const user = useSelector((state: RootState) => state.auth.user);

  // Função para simular um logout (remova o token ou dados do usuário)
  const handleLogout = () => {
    // Aqui você pode limpar o token ou os dados de sessão do usuário
    setIsLoggedIn(false);
    // Redirecionar ou chamar o endpoint de logout
    console.log("Usuário deslogado");
  };

  useEffect(() => {
    // Simulação de obtenção de dados de usuário
    const fetchUser = () => {
      // Simulando a obtenção do nome do usuário
      setIsLoggedIn(true);
    };

    fetchUser();
  }, []);

  const getInitials = (name: string) => {
    const [firstName, lastName] = name.split(" ");
    return `${firstName.charAt(0)}${lastName ? lastName.charAt(0) : ""}`;
  };

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
          {/* Exibindo os itens de navegação aqui */}
        </div>

        <div className="flex items-center gap-6">
          {isLoggedIn && user ? (
            <>
              {/* Ícone circular com iniciais do nome */}
              <div className="relative">
                <span
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 text-white font-semibold"
                  title={user.name} // Tooltip que exibe o nome completo
                >
                  {getInitials(user.name)}
                </span>
              </div>

              {/* Botão de logout */}
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
