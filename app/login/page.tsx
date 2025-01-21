"use client";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import "../../components/styles/login.css";
import { tpGrupoTapajos } from "../assets/index";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { RootState } from "@/hooks/store";


export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  

  useEffect(() => {
    // Verifica se há um código de autorização na URL
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      // Troca o código de autorização por um token de acesso
      fetch('/api/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.access_token) {
            // Armazena o token de acesso
            localStorage.setItem('access_token', data.access_token);
            router.push('/profile'); // Redireciona para a página de perfil
          } else {
            console.error('Erro ao obter token:', data);
          }
        });
    }
  }, [router]);

  const handleLogin = () => {
    // Redireciona para o endpoint de login da API
    window.location.href = 'http://localhost:5000/login';
  };

  return (
    <div className="min-h-screen bg-background">
    <Navbar
      onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
    />
    <Sidebar isOpen={isSidebarOpen} />

    <main
      className={`pt-16 transition-all duration-300 ${
        isSidebarOpen ? "ml-64" : "ml-16"
      }`}
    >
    <div className="login-container">
      <form>
        <Image src={tpGrupoTapajos} alt="Login Logo" width={400} height={400} />
        <button
          type="button"
          className="login-button"
          onClick={handleLogin}
        >
          Login
        </button>
      </form>
    </div>
    </main>
    </div>
  );
}
