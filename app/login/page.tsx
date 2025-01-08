"use client";
import { useDispatch, useSelector } from "react-redux";
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
import { RootState } from "@/hooks/store";


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
  system: {
    allowNativeBroker: false,
    hashNavigationEnabled: true  // Habilita navegação por hash
  }
};

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [msalClient, setMsalClient] = useState<PublicClientApplication | null>(
    null 
  );
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/noPaper/list");
    }

    const pca = new PublicClientApplication(msalConfig);
    setMsalClient(pca);
    pca
      .initialize()
      .then(() => {
        const accounts = pca.getAllAccounts();
        if (accounts.length > 0) {
          handleSilentLogin(accounts[0]);
        }
      })
      .catch((error) => console.error("Erro ao inicializar o MSAL:", error));
  }, [isAuthenticated, router]);

  const handleSilentLogin = async (account: any) => {
    try {
      const silentResult = await msalClient?.acquireTokenSilent({
        scopes: ["User.Read", "GroupMember.Read.All"],
        account: account
      });

      if (silentResult) {
        await fetchProfileData(silentResult);
      }
    } catch (error) {
      console.error("Erro no login silencioso:", error);
    }
  };

  const handleAzureLogin = async () => {
    if (msalClient) {
      try {
        const loginResponse = await msalClient.loginPopup({
          scopes: ["User.Read", "GroupMember.Read.All"],
        });

        if (loginResponse?.account) {
          await fetchProfileData(loginResponse);
        }
      } catch (error) {
        console.error("Erro de login:", error);
        toast.error("Erro ao realizar login!");
      }
    }
  };
  
  const fetchProfileData = async (accessToken: any) => {
    const userData = accessToken.account;
    try {
      dispatch(
        login({
          name: userData.name,
          email: userData.username,
          profilePicture: userData.foto_perfil_url,
          accessToken: accessToken.accessToken,
        })
      );
      router.push("/noPaper/list");
    } catch (error) {
      console.error("Erro ao obter dados do perfil:", error);
      toast.error("Erro ao obter informações do usuário.");
    }
  };
  



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
