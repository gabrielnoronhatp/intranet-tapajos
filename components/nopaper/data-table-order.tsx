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

import { CheckCircle2, XCircle, Eye,  } from "lucide-react";
import { useState, useEffect, ChangeEvent } from "react";
import { Upload, message } from "antd";
import { UploadProps } from "antd";

export function DataTableOrder() {
  const [orders, setOrders] = useState<Array<any>>([]);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedItem, setSelectedItem]: any = useState(null);
  const [fileUrls, setFileUrls] = useState<Array<string>>([]); 
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); 
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);

  
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
    setPreviewUrl(null);

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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileToUpload(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!fileToUpload || !selectedItem) return;

    const formData = new FormData();
    formData.append("file", fileToUpload);

    try {
      const response = await fetch(`http://localhost:3001/api/upload/${selectedItem.id}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      alert("File uploaded successfully");
      setFileToUpload(null);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleUploadChange: UploadProps["onChange"] = async (info) => {
    if (info.file.status === "uploading") {
      return;
    }

    if (info.file.status === "done") {
      try {
        const formData = new FormData();
        formData.append('files', info.file.originFileObj as File);
        
        const response = await fetch(`http://localhost:3001/api/upload/${selectedItem.id}`, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('Falha no upload');
        }

        message.success(`${info.file.name} arquivo enviado com sucesso`);
        
        // Atualiza a lista de arquivos
        const updatedFiles = await fetch(`http://localhost:3001/api/arquivos/${selectedItem.id}`);
        const data = await updatedFiles.json();
        setFileUrls(data.urls);

      } catch (error) {
        message.error(`${info.file.name} falha no upload.`);
        console.error('Erro no upload:', error);
      }
    }
    
    setFileList(info.fileList);
  };

  const beforeUpload = (file: File) => {
    const isAllowedType = ["image/jpeg", "image/png", "application/pdf"].includes(file.type);
    if (!isAllowedType) {
      message.error("You can only upload JPG/PNG/PDF file!");
      return Upload.LIST_IGNORE;
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error("Image must smaller than 10MB!");
      return Upload.LIST_IGNORE;
    }
    return true;
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
          <TableCell
            className="text-sm fornecedor-column"
            title={order.fornecedor}
          >
            {order.fornecedor}
          </TableCell>
          <TableCell
            className="text-sm cnpj-column"
            title={order.cnpj}
          >
            {order.cnpj}
          </TableCell>
          <TableCell className="text-sm">{order.notafiscal}</TableCell>
          <TableCell className="text-sm">{order.formapag}</TableCell>
          <TableCell
            className="text-sm contagerencial-column"
            title={order.contagerencial}
          >
            {order.contagerencial}
          </TableCell>
          <TableCell className="text-center text-sm">{order.itens}</TableCell>
          <TableCell className="text-center text-sm">{order.parcelas}</TableCell>
          <TableCell
            className="text-right text-sm valor-column"
            title={formatCurrency(order.valor)}
          >
            {formatCurrency(order.valor)}
          </TableCell>
          <TableCell
            className="text-center text-sm assinatura-column"
            title={order.assinatura1 ? "Assinado" : "Não Assinado"}
          >
            {order.assinatura1 ? (
              <CheckCircle2 className="h-4 w-4 text-primary mx-auto" />
            ) : (
              <XCircle className="h-4 w-4 text-muted-foreground mx-auto" />
            )}
          </TableCell>
          <TableCell
            className="text-center text-sm assinatura-column"
            title={order.assinatura2 ? "Assinado" : "Não Assinado"}
          >
            {order.assinatura2 ? (
              <CheckCircle2 className="h-4 w-4 text-primary mx-auto" />
            ) : (
              <XCircle className="h-4 w-4 text-muted-foreground mx-auto" />
            )}
          </TableCell>
          <TableCell
            className="text-center text-sm assinatura-column"
            title={order.assinatura3 ? "Assinado" : "Não Assinado"}
          >
            {order.assinatura3 ? (
              <CheckCircle2 className="h-4 w-4 text-primary mx-auto" />
            ) : (
              <XCircle className="h-4 w-4 text-muted-foreground mx-auto" />
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
                <h3 className="text-lg font-bold mt-4">Upload de Arquivo:</h3>
                <Upload
                  name="files"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={true}
                  customRequest={async ({ file, onSuccess, onError }) => {
                    try {
                      const formData = new FormData();
                      formData.append('files', file as File);
                      
                      const response = await fetch(`http://localhost:3001/api/upload/${selectedItem.id}`, {
                        method: 'POST',
                        body: formData
                      });

                      if (!response.ok) {
                        throw new Error('Upload failed');
                      }
                      
                      const result = await response.json();
                      onSuccess?.(result);
                    } catch (error) {
                      onError?.(error as any);
                    }
                  }}
                  beforeUpload={beforeUpload}
                  onChange={handleUploadChange}
                  fileList={fileList}
                >
                  <div>
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
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
              onClick={() => {
                setIsViewOpen(false);
                setPreviewUrl(null);
              }}
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
