"use client";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { login } from "@/hooks/slices/authSlice";
import {
  PublicClientApplication,
} from "@azure/msal-browser";
import { toast } from "react-hot-toast";
import "../../components/styles/login.css";
import { tpGrupoTapajos } from "../assets/index";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";


const msalConfig = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_REACT_APP_CLIENT_ID!,
    authority: process.env.NEXT_PUBLIC_REACT_APP_AUTHORITY!,
    redirectUri: process.env.NEXT_PUBLIC_REACT_APP_REDIRECT_URI!,
  },
  cache: {
    cacheLocation: "sessionStorage", 
    storeAuthStateInCookie: false,
  },
};

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [msalClient, setMsalClient] = useState<PublicClientApplication | null>(
    null 
  );
  
  
  useEffect(() => {
    const pca = new PublicClientApplication(msalConfig);
    setMsalClient(pca);
    pca
      .initialize()
      .then(() => console.log("MSAL client initialized"))
      .catch((error) => console.error("Erro ao inicializar o MSAL:", error));
  }, []);

  const handleAzureLogin = async () => {
    console.log("Iniciando login..."); 
    if (msalClient) {
      try {
        const loginResponse = await msalClient.loginPopup({
          scopes: ["User.Read", "GroupMember.Read.All"], 
        });
  
        if (loginResponse?.account) {
          console.log("Login bem-sucedido:", loginResponse.account);
  
        
          const { accessToken, account } = loginResponse;
  
    
          sessionStorage.setItem("access_token", accessToken);
  
          
          await fetchProfileData(loginResponse);
        }
      } catch (error) {
        console.error("Erro de login:", error);
        toast.error("Erro ao realizar login!");
      }
    }
  };
  
  const fetchProfileData = async (accessToken: any) => {
    console.log(accessToken);

    const userData = accessToken.account
    console.log("Dados do usuário:", userData);
    try {
      dispatch(
        login({
          name: userData.name,
          email: userData.username,
          profilePicture: userData.foto_perfil_url,
          accessToken,
        })
      );

     
      router.push("/noPaper/list");
    } catch (error) {
      console.error("Erro ao obter dados do perfil:", error);
      toast.error("Erro ao obter informações do usuário.");
    }
  };
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);


  return (
    <div className="min-h-screen bg-background">
    <Navbar
      onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
    />
    <Sidebar isOpen={isSidebarOpen} />

    <main
      className={`pt-16 transition-all duration-300 ${
        isSidebarOpen ? "ml-64" : "ml-20"
      }`}
    >
    <div className="login-container">
      <form>
        <Image src={tpGrupoTapajos} alt="Login Logo" width={400} height={400} />
        <button
          type="button"
          onClick={handleAzureLogin}
          className="login-button"
        >
          Login
        </button>
      </form>
    </div>
    </main>
    </div>
  );
}
