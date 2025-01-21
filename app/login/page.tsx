"use client";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import "../../components/styles/login.css";
import { tpGrupoTapajos } from "../assets/index";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import jwt from 'jsonwebtoken';
import { Modal, Button } from "antd";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo]:any = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // useEffect(() => {
  //   const jwtToken = window.location.pathname.split('/')[1]; // Extrai o JWT da URL
  //   if (jwtToken) {
  //     try {
  //       const decodedToken = jwt.decode(jwtToken);
  //       console.log("Decoded JWT:", decodedToken);

  //       // Atualize o estado de autenticação
  //       setIsAuthenticated(true);
  //       setUserInfo(decodedToken);

  //       // Redirecionar para a página principal
  //       router.push('/');
  //     } catch (error) {
  //       console.error("Erro ao decodificar JWT:", error);
  //     }
  //   }
  // }, [router]);

  const handleLogin = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    window.location.href = "https://sso.grupotapajos.com.br/login";
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} />

      <main
        className={`pt-16 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <div className="login-container">
          {isAuthenticated ? (
            <div>
              <h1>Bem-vindo, {userInfo?.nome}!</h1>
              <p>Email: {userInfo?.email}</p>
              <p>Username: {userInfo?.username}</p>
            </div>
          ) : (
            <form>
              <Image
                src={tpGrupoTapajos}
                alt="Login Logo"
                width={400}
                height={400}
              />
              <button
                type="button"
                className="login-button"
                onClick={handleLogin}
              >
                Login
              </button>
            </form>
          )}
        </div>
      </main>

      <Modal
        title="Autenticação"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Continuar para SSO"
        cancelText="Cancelar"
      >
        <p>Você será redirecionado para o SSO para autenticação.</p>
      </Modal>
    </div>
  );
}
