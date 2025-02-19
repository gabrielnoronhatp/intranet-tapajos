"use client";
import React from 'react';
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitOrder, setOrderState } from "@/hooks/slices/noPaper/orderSlice";
import { message,Upload } from "antd";
import OriginData from "@/components/nopaper/form/origin-data-form";
import FinancialData from "@/components/nopaper/form/financial-data-form";
import TaxesData from "@/components/nopaper/form/taxes-data-form";
import CenterOfCoust from "@/components/nopaper/form/center-of-coust-form";
import { AuthGuard } from "@/components/ProtectedRoute/AuthGuard";
import { PlusOutlined } from "@ant-design/icons";
import{ api }   from "@/app/service/api";



export default function NoPaper() {
  const dispatch = useDispatch();

  // TODO:  Cant take this any
  const orderData = useSelector((state: any) => state.order);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const handleSetState = (field: keyof typeof orderData, value: any) => {
    if ((field === "lojaOP" || field === "fornecedorOP") && !value) {
      console.error(`${field} não pode ser vazio.`);
      return;
    }
    dispatch(setOrderState({ [field]: value }));
  };

  useEffect(() => {}, [orderData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderData.lojaOP) {
      console.error("Filial não pode ser vazia.");
      message.error("Por favor, selecione uma filial.");
      return;
    }

    try {
      const response = await dispatch(submitOrder(orderData) as any);
      const opId = response.payload?.id;

      if (!opId) {
        message.error("Erro ao criar a Ordem de Pagamento.");
        return;
      }

      if (selectedFile) {
        const formData = new FormData();
        formData.append("files", selectedFile);

        const uploadResponse = await api.post(`upload/${opId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const data: { message: string; opId: string; urls: string[] } =
          uploadResponse.data;
        message.success(data.message || "Arquivo enviado com sucesso!");
      } else {
        message.info("Formulário enviado sem anexo.");
      }
    } catch (error) {
      console.error("Erro ao enviar a ordem ou o arquivo:", error);
      message.error("Erro ao processar o formulário.");
    }
  };

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  const beforeUpload = (file: File) => {
    const allowed = allowedTypes.includes(file.type);
    if (!allowed) {
      message.error("Você só pode enviar arquivos Excel, PDF, JPG ou PNG!");
    }
    return allowed;
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navbar
          onToggleSidebar={() =>
            handleSetState("isSidebarOpen", !isSidebarOpen)
          }
        />
        <Sidebar isOpen={isSidebarOpen} />

        <main
          className={`pt-16 transition-all duration-300 ${
            isSidebarOpen ? "ml-64" : "ml-20"
          }`}
        >
          <div className="p-4">
            <h1 className="text-xl font-bold text-primary mb-4">
              Lançamento NoPaper
            </h1>

            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-4">
                <OriginData />

                <FinancialData />

                <TaxesData />

                <CenterOfCoust />

                <div className="mt-6">
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    accept=".xls,.xlsx,.pdf,.jpg,.jpeg,.png"
                    onChange={(info) => {
                      const file = info.file.originFileObj;
                      if (file) {
                        setSelectedFile(file);
                        setImageUrl(URL.createObjectURL(file));
                      }
                    }}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="arquivo"
                        style={{ width: "100%" }}
                      />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    Lançar Ordem de Pagamento
                  </Button>
                </div>
              </form>
            </div>
          </div>
          {isViewOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm">
                <h2 className="text-lg font-bold mb-2">Visualização</h2>
              </div>
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
