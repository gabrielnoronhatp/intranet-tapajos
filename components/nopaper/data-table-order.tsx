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
import { Image, Upload, UploadFile, message } from "antd";
import { CpfModal } from "@/components/nopaper/cpf-modal";
import api from '@/app/service/api';
import { UploadChangeParam } from "antd/es/upload";
import './data-table-order-styles.css';
import { Table as AntdTable } from 'antd';
import { PinModal } from "./pin-modal";
import { setOrderId } from "@/hooks/slices/noPaper/noPaperSlice";
import { useDispatch } from "react-redux";

interface DataTableOrderProps {
  searchParams: Record<string, string>;
}

export function DataTableOrder({ searchParams }: DataTableOrderProps) {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState<Array<any>>([]);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedItem, setSelectedItem]: any = useState(null);
  const [fileUrls, setFileUrls] = useState<Array<string>>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const query = new URLSearchParams(searchParams).toString();
        const response = await api.get(`buscar-ordem?${query}`);
        setOrders(response.data);
      
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [searchParams]);

  const fetchOrderDetails = async (ordemId: number) => {
    try {
      const response = await api.get(`ordem-detalhes/${ordemId}`);
      setOrderDetails(response.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const toggleView = async (item: any) => {
    setSelectedItem(item);
    setIsViewOpen(!isViewOpen);
    
    setPreviewUrl(null);
    await fetchOrderDetails(item.id);
    if (!isViewOpen) {
      try {
        const response = await api.get(`arquivos/${item.id}`);
        setFileUrls(response.data.urls);
      } catch (error) {
        console.error("Error fetching files or order details:", error);
        setFileUrls([]);
      }
    } else {
      setFileUrls([]);
    }

  };

  const handleClosePinModal = () => {
    setIsPinModalOpen(false);
  };

  const handleConfirmPin = () => {
    setIsPinModalOpen(false);
    
  };

  const beforeUpload = (file: File) => {
    return true;
  };

  const handleUploadChange = (info: UploadChangeParam<UploadFile<any>>) => {
    console.log(info);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Fornecedor', dataIndex: 'fornecedor', key: 'fornecedor' },
    { title: 'CNPJ', dataIndex: 'cnpj', key: 'cnpj' },
    { title: 'Nota Fiscal', dataIndex: 'notafiscal', key: 'notafiscal' },
    { title: 'Forma Pag.', dataIndex: 'formapag', key: 'formapag' },
    { title: 'Conta Gerencial', dataIndex: 'contagerencial', key: 'contagerencial' },
    { title: 'Itens', dataIndex: 'itens', key: 'itens', align: 'center' },
    { title: 'Parcelas', dataIndex: 'parcelas', key: 'parcelas', align: 'center' },
    { title: 'Valor', dataIndex: 'valor', key: 'valor', align: 'right' },
    { 
      title: 'Assinatura 1', 
      dataIndex: 'assinatura1', 
      key: 'assinatura1', 
      align: 'center',
      render: (text: any, record: any) => (
        <span onClick={() => {
          dispatch(setOrderId(record.id));
          setIsPinModalOpen(true);
        }} style={{ cursor: 'pointer' }}>
          {text ? <CheckCircle2 color="green" /> : <XCircle color="red" />}
        </span>
      )
    },
    { 
      title: 'Assinatura 2', 
      dataIndex: 'assinatura2', 
      key: 'assinatura2', 
      align: 'center',
      render: (text: any, record: any) => (
        <span onClick={() => {
          dispatch(setOrderId(record.id));
          setIsPinModalOpen(true);
        }} style={{ cursor: 'pointer' }}>
          {text ? <CheckCircle2 color="green" /> : <XCircle color="red" />}
        </span>
      )
    },
    { 
      title: 'Assinatura 3', 
      dataIndex: 'assinatura3', 
      key: 'assinatura3', 
      align: 'center',
      render: (text: any, record: any) => (
        <span onClick={() => {
          dispatch(setOrderId(record.id));
          setIsPinModalOpen(true);
        }} style={{ cursor: 'pointer' }}>
          {text ? <CheckCircle2 color="green" /> : <XCircle color="red" />}
        </span>
      )
    },
    { 
      title: 'Ações', 
      key: 'acoes', 
      align: 'center', 
      render: (text: any, record: any) => (
        <Eye color="green" onClick={() => toggleView(record)} style={{ cursor: 'pointer' }} />
      )
    },
  ];

  return (
    <div className="rounded-md border">
      <AntdTable
        columns={columns as any}
        dataSource={orders}
        rowKey="id"
        pagination={false}
      />

      {isViewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg shadow-lg w-[700px] max-h-[80vh] overflow-y-auto mt-20">
            <div className="grid  gap-6">
              <div>
                <h2 className="text-lg font-bold">Detalhes do Item</h2>
                <p>ID: {selectedItem?.id}</p>
                <p>Fornecedor: {selectedItem?.fornecedor}</p>
                <p>CNPJ: {selectedItem?.cnpj}</p>
                <p>Nota Fiscal: {selectedItem?.notafiscal}</p>
                <p>Forma de Pagamento: {selectedItem?.formapag}</p>
                <p>Conta Gerencial: {selectedItem?.contagerencial}</p>
                <p>Itens: {selectedItem?.itens}</p>
                <p>Parcelas: {selectedItem?.parcelas}</p>
                <p>Valor: {selectedItem?.valor}</p>
                <p>Assinatura 1: {selectedItem?.assinatura1 ? "Sim" : "Não"}</p>
                <p>Assinatura 2: {selectedItem?.assinatura2 ? "Sim" : "Não"}</p>
                <p>Assinatura 3: {selectedItem?.assinatura3 ? "Sim" : "Não"}</p>

                {orderDetails && (
                  <>
                    <h3 className="text-md font-bold mt-2">Itens Contratados:</h3>
                    <ul>
                      {orderDetails.itensContratados.map((item: any, index: number) => (
                        <li key={index}>
                          {item.nome_produto} - {item.valor_produto}
                        </li>
                      ))}
                    </ul>
                    <h3 className="text-md font-bold mt-2">Centros de Custo:</h3>
                    <ul>
                      {orderDetails.centrosCusto.map((centro: any, index: number) => (
                        <li key={index}>
                          {centro.centro_custo} - {centro.valor}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {fileUrls.length > 0 && (
                  <>
                    <h3 className="text-md font-bold mt-2">Arquivos:</h3>
                    <ul className="space-y-2">
                      {fileUrls.map((url, index) => (
                        <li key={index}>
                          <a
                            href={url}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Arquivo {index + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <h3 className="text-md font-bold mt-2">Upload de Arquivo:</h3>
                 <Upload
                  name="files"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={true}
                  customRequest={async ({ file, onSuccess, onError }) => {
                    try {
                      const formData = new FormData();
                      formData.append('files', file as File);
                      
                      const response = await fetch(`http://localhost:3002/api/upload/${selectedItem.id}`, {
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
                      <Image
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
                setOrderDetails(null);
              }}
              className="mt-1 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      <PinModal
        isOpen={isPinModalOpen}
        onClose={handleClosePinModal}
        onConfirm={handleConfirmPin}
        orderId={selectedItem?.id}
      />
    </div>
  );
}
