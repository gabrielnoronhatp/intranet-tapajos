"use client";

import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { useState } from "react";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} />
      
      <main className={`pt-16 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary mb-6">Bem-vindo à Sangue Verde !!! </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quick Access Cards */}
            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <h2 className="text-lg font-semibold mb-4">Acesso Rápido</h2>
              <div className="space-y-2">
                <p className="text-muted-foreground">• Documentos Recentes</p>
                <p className="text-muted-foreground">• Reuniões Agendadas</p>
                <p className="text-muted-foreground">• Comunicados</p>
              </div>
            </div>

            {/* Department Updates */}
            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <h2 className="text-lg font-semibold mb-4">Atualizações Departamentais</h2>
              <div className="space-y-2">
                <p className="text-muted-foreground">• TI: Manutenção Programada</p>
                <p className="text-muted-foreground">• Marketing: Nova Campanha</p>
                <p className="text-muted-foreground">• RH: Processo Seletivo</p>
              </div>
            </div>

            {/* Social Media Feed */}
            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <h2 className="text-lg font-semibold mb-4">Feed de Mídias Sociais</h2>
              <div className="space-y-2">
                <p className="text-muted-foreground">• Últimas Postagens</p>
                <p className="text-muted-foreground">• Engajamento</p>
                <p className="text-muted-foreground">• Análises</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}