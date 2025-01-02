"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import "@/components/data-table-order-styles.css";

import { CheckCircle2, XCircle, Eye } from "lucide-react";
import { useState, useEffect } from "react";

export function DataTableOrder() {
  const [orders, setOrders] = useState<Array<any>>([]);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedItem, setSelectedItem]: any = useState(null);
  const [fileUrls, setFileUrls] = useState<Array<string>>([]); 
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); 

  
  const handlePreview = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    setPreviewUrl(url);
  };

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
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(parseFloat(value));
  };

  const toggleView = async (item: any) => {
    setSelectedItem(item);
    setIsViewOpen(!isViewOpen);

    if (!isViewOpen) {
      try {
        const response = await fetch(
          `http://localhost:3001/api/arquivos/${item.id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch files");
        }
        const data = await response.json();
        setFileUrls(data.urls); 
      } catch (error) {
        console.error("Error fetching files:", error);
        setFileUrls([]); 
      }
    } else {
      setFileUrls([]); 
    }
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
          <TableCell className="font-medium text-sm">{order.id}</TableCell>
          <TableCell className="text-sm fornecedor-column" data-label={order.fornecedor}>
            {order.fornecedor}
          </TableCell>
          <TableCell className="text-sm">{order.cnpj}</TableCell>
          <TableCell className="text-sm">{order.notafiscal}</TableCell>
          <TableCell className="text-sm">{order.formapag}</TableCell>
          <TableCell className="text-sm contagerencial-column" data-label={order.contagerencial}>
            {order.contagerencial}
          </TableCell>
          <TableCell className="text-center text-sm">{order.itens}</TableCell>
          <TableCell className="text-center text-sm">{order.parcelas}</TableCell>
          <TableCell className="text-right text-sm">{formatCurrency(order.valor)}</TableCell>
          <TableCell className="text-center text-sm">
            {order.assinatura1 ? (
              <CheckCircle2 className="h-5 w-5 text-primary mx-auto" />
            ) : (
              <XCircle className="h-5 w-5 text-muted-foreground mx-auto" />
            )}
          </TableCell>
          <TableCell className="text-center text-sm">
            {order.assinatura2 ? (
              <CheckCircle2 className="h-5 w-5 text-primary mx-auto" />
            ) : (
              <XCircle className="h-5 w-5 text-muted-foreground mx-auto" />
            )}
          </TableCell>
          <TableCell className="text-center text-sm">
            {order.assinatura3 ? (
              <CheckCircle2 className="h-5 w-5 text-primary mx-auto" />
            ) : (
              <XCircle className="h-5 w-5 text-muted-foreground mx-auto" />
            )}
          </TableCell>
          <TableCell className="text-center text-sm">
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
          <div className="bg-white p-6 rounded-lg shadow-lg w-[800px] max-h-[90vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h2 className="text-xl font-bold mb-4">Detalhes do Item</h2>
                <p>ID: {selectedItem.id}</p>
                <p>Fornecedor: {selectedItem.fornecedor}</p>
                <p>CNPJ: {selectedItem.cnpj}</p>
                <p>Nota Fiscal: {selectedItem.notafiscal}</p>
                <p>Forma de Pagamento: {selectedItem.formapag}</p>
                <p>Conta Gerencial: {selectedItem.contagerencial}</p>
                <p>Itens: {selectedItem.itens}</p>
                <p>Parcelas: {selectedItem.parcelas}</p>
                <p>Valor: {formatCurrency(selectedItem.valor)}</p>
                <p>Assinatura 1: {selectedItem.assinatura1 ? "Sim" : "Não"}</p>
                <p>Assinatura 2: {selectedItem.assinatura2 ? "Sim" : "Não"}</p>
                <p>Assinatura 3: {selectedItem.assinatura3 ? "Sim" : "Não"}</p>
                
                {fileUrls.length > 0 && (
                  <>
                    <h3 className="text-lg font-bold mt-4">Arquivos:</h3>
                    <ul className="space-y-2">
                      {fileUrls.map((url, index) => (
                        <li key={index}>
                          <a
                            href={url}
                            className="text-blue-600 hover:text-blue-800"
                            onClick={(e) => handlePreview(e, url)}
                          >
                            Arquivo {index + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              <div className="h-full">
                {previewUrl && (
                  <div className="h-[600px] w-full">
                    {previewUrl.endsWith(".png") ||
                    previewUrl.endsWith(".jpg") ||
                    previewUrl.endsWith(".jpeg") ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-contain bg-gray-100"
                      />
                    ) : previewUrl.endsWith(".pdf") ? (
                      <iframe
                        src={previewUrl}
                        className="w-full h-full border-0"
                        title="Preview PDF"
                      />
                    ) : (
                      <p>Formato de arquivo não suportado para visualização.</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={() => setIsViewOpen(false)}
              className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
