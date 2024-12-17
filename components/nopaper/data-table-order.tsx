"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";



import { CheckCircle2, XCircle, Eye } from "lucide-react";
import { useState, useEffect } from "react";


export function DataTableOrder() {
  const [orders, setOrders] = useState<Array<any>>([]);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedItem, setSelectedItem]: any = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/consultar-ordem");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(parseFloat(value));
  };

  const toggleView = (item: any) => {
    setSelectedItem(item);
    setIsViewOpen(!isViewOpen);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Fornecedor</TableHead>
            <TableHead>CNPJ</TableHead>
            <TableHead>Nota Fiscal</TableHead>
            <TableHead>Forma Pag.</TableHead>
            <TableHead>Conta Gerencial</TableHead>
            <TableHead className="text-center">Itens</TableHead>
            <TableHead className="text-center">Parcelas</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead className="text-center">Assinatura 1</TableHead>
            <TableHead className="text-center">Assinatura 2</TableHead>
            <TableHead className="text-center">Assinatura 3</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.fornecedor}</TableCell>
              <TableCell>{order.cnpj}</TableCell>
              <TableCell>{order.notafiscal}</TableCell>
              <TableCell>{order.formapag}</TableCell>
              <TableCell>{order.contagerencial}</TableCell>
              <TableCell className="text-center">{order.itens}</TableCell>
              <TableCell className="text-center">{order.parcelas}</TableCell>
              <TableCell className="text-right">{formatCurrency(order.valor)}</TableCell>
              <TableCell className="text-center">
                {order.assinatura1 ? (
                  <CheckCircle2 className="h-5 w-5 text-primary mx-auto" />
                ) : (
                  <XCircle className="h-5 w-5 text-muted-foreground mx-auto" />
                )}
              </TableCell>
              <TableCell className="text-center">
                {order.assinatura2 ? (
                  <CheckCircle2 className="h-5 w-5 text-primary mx-auto" />
                ) : (
                  <XCircle className="h-5 w-5 text-muted-foreground mx-auto" />
                )}
              </TableCell>
              <TableCell className="text-center">
                {order.assinatura3 ? (
                  <CheckCircle2 className="h-5 w-5 text-primary mx-auto" />
                ) : (
                  <XCircle className="h-5 w-5 text-muted-foreground mx-auto" />
                )}
              </TableCell>
              <TableCell className="text-center">
                <button onClick={() => toggleView(order)} className="p-2">
                  <Eye className="text-primary" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

    
      {isViewOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Detalhes do Item</h2>
            <p>ID: {selectedItem.id}</p>
            <p>Fornecedor: {selectedItem.fornecedor}</p>
            <p>Valor: {selectedItem.valor}</p>
            <button onClick={() => setIsViewOpen(false)} className="mt-4 bg-primary hover:bg-primary/90">
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}