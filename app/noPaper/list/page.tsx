"use client";

import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import {  DataTableOrder } from "@/components/nopaper/data-table-order";
import { FloatingActionButton } from "@/components/nopaper/floating-action-button";
import { mockOrders } from "@/lib/data/mock-orders";
import { useState } from "react";



export default function NoPaperList() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);



  return (
    <div className="min-h-screen bg-background">
     
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} />
      
      <main className={`pt-16 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-primary">Ordens de Pagamento  </h1>
              <p className="text-muted-foreground mt-1">
                Listagem de Ordens de Pagamento para Assinatura
              </p>
            </div>
          </div>
          <div className="rounded-lg border bg-card">
            <DataTableOrder  />
          </div>

          <FloatingActionButton />
        </div>
      </main>
    </div>
  );
}