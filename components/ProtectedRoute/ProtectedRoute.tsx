'use client';

import { useSelector } from 'react-redux';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { RootState } from '@/hooks/store';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; 
  }

  return <>{children}</>;
}
