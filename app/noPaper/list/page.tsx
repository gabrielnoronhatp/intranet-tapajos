"use client";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { DataTableOrder } from "@/components/nopaper/data-table-order";
import { FloatingActionButton } from "@/components/nopaper/floating-action-button";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import { useState } from "react";

export default function NoPaperList() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchParams, setSearchParams] = useState({
    id: '',
    numero_nota: '',
    conta_gerencial: '',
    fornecedor: '',
    dtlanc: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  return (
    <ProtectedRoute>  
    <div className="min-h-screen bg-background">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} />
      
      <main className={`pt-16 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-primary">Ordens de Pagamento</h1>
              <p className="text-muted-foreground mt-1">
                Listagem de Ordens de Pagamento para Assinatura
              </p>
            </div>
          </div>
          <div className="mb-4">
            <form className="flex flex-wrap gap-4">
              {Object.keys(searchParams).map((key) => (
                <div key={key} className="flex flex-col w-40">
                  <label htmlFor={key} className="text-green-700 mb-1 uppercase">
                    {key.replace('_', ' ')}
                  </label>
                  <input
                    id={key}
                    type={key === 'dtlanc' ? 'date' : 'text'}
                    name={key}
                    value={searchParams[key as keyof typeof searchParams]}
                    onChange={handleInputChange}
                    placeholder={`Buscar por ${key.replace('_', ' ')}`}
                    className="p-1 border rounded"
                  />
                </div>
              ))}
            </form>
          </div>
          <div className="rounded-lg border bg-card">
            <DataTableOrder searchParams={searchParams} />
          </div>

          <FloatingActionButton />
        </div>
      </main>
    </div>
    </ProtectedRoute>
    
  );
}