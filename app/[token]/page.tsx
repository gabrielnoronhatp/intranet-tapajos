"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/hooks/slices/authSlice";
import { RootState } from "@/hooks/store";
import { CpfModal } from "@/components/nopaper/cpf-modal";

export default function TokenPage() {
  const dispatch = useDispatch();
  const router: any = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = router.query?.token ||
    (typeof window !== "undefined" &&
      window.location.pathname.split("/").pop());

  const handleCpfConfirm = (cpf: string) => {
    setIsModalOpen(false);
  };

  useEffect(() => {
  
    if (token) {
      try {
        const decodedToken: any = jwt.decode(token as string);
        dispatch(
          login({
            name: decodedToken.nome,
            email: decodedToken.email,
            accessToken: token,
            profilePicture: decodedToken.foto_perfil_url,
          })
        );

        if (!decodedToken.cpf) {
          setIsModalOpen(true); 
          return;
        }

       
        
        router.push("/")

      } catch (error) {
        console.error("Erro ao decodificar JWT:", error)
      }
    }
  }, [token, router]);

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
