import ReduxProvider from '@/redux-provider';
import './globals.css';
import type { Metadata} from 'next';
import { Inter } from 'next/font/google';
import { ToastProvider } from '@/components/ui/toast';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';
import { AuthProvider } from '@/components/auth-provider';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Intranet Tapajós',
  description: 'Portal interno da empresa',
  
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <html lang="pt-BR">
        <head>
            <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>

     <AuthProvider>
      <ReduxProvider>
          <Toaster />
           {children}
        </ReduxProvider>
        </AuthProvider>

        </body>
    </html>
  );
}