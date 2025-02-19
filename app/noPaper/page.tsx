"use client";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitOrder, setOrderState } from "@/hooks/slices/noPaper/orderSlice";
import { message, GetProp, Upload, UploadProps } from "antd";
import OriginData from "@/components/nopaper/form/origin-data-form";
import FinancialData from "@/components/nopaper/form/financial-data-form";
import TaxesData from "@/components/nopaper/form/taxes-data-form";
import CenterOfCoust from "@/components/nopaper/form/center-of-coust-form";
import { AuthGuard } from "@/components/ProtectedRoute/AuthGuard";
import { PlusOutlined } from "@ant-design/icons";
import api from "@/app/service/api";
import { AppDispatch } from "@/hooks/store";

interface UploadResponse {
  message: string;
  opId: string;
  urls: string[];
}

export default function NoPaper() {
  const dispatch = useDispatch<AppDispatch>();
  const orderData = useSelector((state: any) => state.order);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const handleSetState = (field: keyof any, value: any) => {
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
      message.error("Por favor, selecione uma filial.");
      return;
    }

    try {
      // 1. Primeiro, criar a OP
      const response = await dispatch(submitOrder(orderData));
      const opId = response.payload?.id;

      if (!opId) {
        message.error("Erro ao criar a Ordem de Pagamento.");
        return;
      }

      // 2. Se houver arquivo selecionado, fazer o upload
      if (selectedFile) {
        const uploadResponse = await handleUpload(selectedFile, opId);
        if (uploadResponse.length > 0) {
          message.success("Ordem de pagamento e arquivo enviados com sucesso!");
        }
      } else {
        message.success("Ordem de pagamento criada com sucesso!");
      }
    } catch (error) {
      message.error("Erro ao processar o formulário.");
      console.error("Erro:", error);
    }
  };

  const handleUpload = async (file: File, opId: string) => {
    try {
      const formData = new FormData();
      formData.append("files", file);

      const response = await api.post<UploadResponse>(
        `upload/${opId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.urls?.length > 0) {
        message.success("Arquivo enviado com sucesso!");
        return response.data.urls;
      }
      return [];
    } catch (error) {
      message.error("Erro ao fazer upload do arquivo.");
      console.error("Erro no upload:", error);
      return [];
    }
  };

  const beforeUpload = (file: File) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    const isAllowedType = allowedTypes.includes(file.type);
    if (!isAllowedType) {
      message.error("Você só pode enviar arquivos Excel, PDF, JPG ou PNG!");
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("O arquivo deve ser menor que 2MB!");
    }

    return isAllowedType && isLt2M;
  };

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
                    name="files"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={(file) => {
                      const isLt2M = file.size / 1024 / 1024 < 2;
                      if (!isLt2M) {
                        message.error("O arquivo deve ser menor que 2MB!");
                        return false;
                      }
                      return true;
                    }}
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
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
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
