"use client";
import React, { useState, useEffect } from "react";
import { Table as AntdTable, Input, Button } from "antd";
import api from "@/app/service/api";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { FloatingActionButton } from "@/components/nopaper/floating-action-button";
import { AuthGuard } from "@/components/ProtectedRoute/AuthGuard";
export function ContractList() {
  const [contracts, setContracts] = useState<Array<any>>([]);
  const [searchParams, setSearchParams] = useState<Record<string, string>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    fetchContracts();
  }, [searchParams]);

  const fetchContracts = async () => {
    try {
      const query = new URLSearchParams(searchParams).toString();
      const response = await api.get(`buscar-contratos?${query}`);
      setContracts(response.data);
    } catch (error) {
      console.error("Error fetching contracts:", error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const columns = [
    { title: "Tipo de Serviço", dataIndex: "tipoServico", key: "tipoServico" },
    { title: "Filial", dataIndex: "filial", key: "filial" },
    { title: "Fornecedor", dataIndex: "fornecedor", key: "fornecedor" },
    { title: "Conta Gerencial", dataIndex: "contaGerencial", key: "contaGerencial" },
    { title: "Centro de Custo", dataIndex: "centroCusto", key: "centroCusto" },
    { title: "Dados de Contato", dataIndex: "dadosContato", key: "dadosContato" },
    { title: "Período", dataIndex: "periodo", key: "periodo" },
    { title: "Índice", dataIndex: "indice", key: "indice" },
    { title: "Multa", dataIndex: "multa", key: "multa" },
    { title: "Financeiro", dataIndex: "financeiro", key: "financeiro" },
    { title: "Vencimento", dataIndex: "vencimento", key: "vencimento" },
    { title: "Valor", dataIndex: "valor", key: "valor" },
    { title: "Observações", dataIndex: "observacoes", key: "observacoes" },
    {
      title: "Ações",
      key: "acoes",
      render: (text: any, record: any) => (
        <Button onClick={() => handleViewContract(record)}>Ver Detalhes</Button>
      ),
    },
  ];

  const handleViewContract = (contract: any) => {
  
  
   };
  

  return (
    <AuthGuard>
    
 
    <div className="min-h-screen bg-background">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} />
      <main className={`pt-16 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-primary">Contratos</h1>
              <p className="text-muted-foreground mt-1">
                Listagem de Contratos
              </p>
            </div>
          </div>
          
          <AntdTable
            columns={columns as any}
            dataSource={contracts}
            rowKey="id"
            pagination={false}
            />      
          <FloatingActionButton href="/contracts/new" />
        </div>
      </main>
    </div>
 
  
    </AuthGuard>

    
  );
}

export default ContractList;
