'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import jwt from 'jsonwebtoken';
import { RootState } from '@/hooks/store';
import { setAuthenticated, setUser } from '@/hooks/slices/authSlice';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && accessToken) {
      try {
        const decodedToken: any = jwt.decode(accessToken);
        console.log("Decoded JWT:", decodedToken);

        dispatch(setAuthenticated(true));
        dispatch(setUser(decodedToken));

      } catch (error) {
        console.error("Erro ao decodificar JWT:", error);
        dispatch(setAuthenticated(false));
        router.push('/login');
      }
    } else {
      dispatch(setAuthenticated(false));
      router.push('/login');
    }
  }, [accessToken, dispatch, router]);

  if (!isAuthenticated) {
    return null; 
  }

  return <>{children}</>;
}
