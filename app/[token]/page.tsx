"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import jwt from "jsonwebtoken";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/hooks/slices/authSlice";
import { RootState } from "@/hooks/store";

export default function TokenPage() {
  const dispatch = useDispatch();
  const router: any = useRouter();
  const token =
    router.query?.token ||
    (typeof window !== "undefined" &&
      window.location.pathname.split("/").pop());

      
  useEffect(() => {
    if (token) {
      try {
        const decodedToken: any = jwt.decode(token as string);
        console.log("Decoded JWT:", decodedToken);
        dispatch(
          login({
            name: decodedToken.name,
            email: decodedToken.email,
            accessToken: token,
            profilePicture: null,
          })
        );
        
        if (window.history.length > 1) {
          window.history.back();
        }

      } catch (error) {
        console.error("Erro ao decodificar JWT:", error);
        router.push("/login");
      }
    }
  }, [token, router]);

  return (
    <div>
      <h1>Processando autenticação...</h1>
    </div>
  );
}
