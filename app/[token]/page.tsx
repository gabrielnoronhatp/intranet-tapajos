"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import jwt from 'jsonwebtoken';

export default function TokenPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Captura o token da URL
  const redirectUrl = searchParams.get("redirectUrl") || '/'; // Captura a URL de redirecionamento

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwt.decode(token as string);
        console.log("Decoded JWT:", decodedToken);

        // Atualize o estado de autenticação ou armazene o usuário
        // Exemplo: setUser(decodedToken);

        // Redirecionar para a URL de origem ou dashboard
        router.push(redirectUrl);
      } catch (error) {
        console.error("Erro ao decodificar JWT:", error);
        // Redirecionar ou mostrar uma mensagem de erro
        router.push('/login');
      }
    }
  }, [token, redirectUrl, router]);

  return (
    <div>
      <h1>Processando autenticação...</h1>
      {/* Você pode adicionar um spinner ou mensagem de carregamento aqui */}
    </div>
  );
} 