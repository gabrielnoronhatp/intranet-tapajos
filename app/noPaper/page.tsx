"use client";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { CentroCusto } from "@/types/Order/CentroCustoType";
import {
  submitOrder,
  prepareOrderData,
  setOrderState,
} from "@/hooks/slices/orderSlice";
import { Item } from "@/types/Order/OrderTypes";
import { message, GetProp, Upload, UploadProps } from "antd";
import api from "@/app/service/api";
import OriginData from "@/components/nopaper/form/origin-data-form";
import FinancialData from "@/components/nopaper/form/financial-data-form";
import TaxesData from "@/components/nopaper/form/taxes-data-form";
import CenterOfCoust from "@/components/nopaper/form/center-of-coust-form";
import { RootState } from "@/hooks/store";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

export default function NoPaper() {
  const dispatch = useDispatch();

  const {
    isSidebarOpen,
    ramo,
    tipoLancamento,
    formaPagamento,
    selectedFornecedor,
    quantidadeProdutos,
    installments,
    installmentDates,
    isViewOpen,
    selectedFilial,
    notaFiscal,
    serie,
    valorImposto,
    observacao,
    user,
    dtavista,
    banco,
    agencia,
    conta,
    dtdeposito,
    tipopix,
    chavepix,
    datapix,
    contaOP,
    centrosCusto,
  } = useSelector((state: RootState) => state.order);

  const orderData = useSelector((state:any) => state.order.orderData);
  const [itens, setItens] = useState<Item[]>([
    { produto: "", valor: 0, centroCusto: [] },
  ]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const handleSetState = (field: keyof any, value: any) => {
    dispatch(setOrderState({ [field]: value }));
  };

  const toggleView = () => {
    handleSetState("isViewOpen", !isViewOpen);
  };

  const handleUploadSubmit = async (files: FileType[]) => {
    const newErrors: { [key: string]: string } = {};

    setErrors({});

    dispatch(
      prepareOrderData({
        itens,
        centrosCusto,
        valorImposto,
        ramo,
        notaFiscal,
        installments,
        contaOP,
        selectedFornecedor,
        selectedFilial,
        serie,
        formaPagamento,
        quantidadeProdutos,
        dtavista,
        banco,
        agencia,
        conta,
        dtdeposito,
        installmentDates,
        observacao,
        tipopix,
        chavepix,
        datapix,
        tipoLancamento,
        user,
      })
    );

    try {
      const response = await dispatch(submitOrder(orderData) as any);
      const orderId = response.payload?.id;

      if (orderId) {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append("files", file as File);
        });

        const uploadResponse = await api.post(`upload/${orderId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (uploadResponse.status === 200) {
          message.success("Arquivos enviados com sucesso!");
        } else {
          throw new Error("Erro no upload dos arquivos.");
        }
      } else {
        message.error("Erro ao obter o ID da operação.");
      }
    } catch (error) {
      console.error("Erro ao submeter a operação ou fazer upload:", error);
      message.error("Erro ao processar a operação.");
    }
  };

  const beforeUpload = async (file: FileType) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Você só pode enviar arquivos JPG/PNG!");
      return false;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("A imagem deve ter menos de 2MB!");
      return false;
    }

    await handleUploadSubmit([file]);
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    setErrors({});

    dispatch(
      prepareOrderData({
        itens,
        centrosCusto,
        valorImposto,
        ramo,
        notaFiscal,
        installments,
        contaOP,
        selectedFornecedor,
        selectedFilial,
        serie,
        formaPagamento,
        quantidadeProdutos,
        dtavista,
        banco,
        agencia,
        conta,
        dtdeposito,
        installmentDates,
        observacao,
        tipopix,
        chavepix,
        datapix,
        tipoLancamento,
        user,
      })
    );

    if (orderData) {
      try {
        const response = await dispatch(submitOrder(orderData) as any);
        const orderId = response.payload?.id;

        if (imageUrl && orderId) {
          const formData = new FormData();
          formData.append("files ", imageUrl);

          const uploadResponse = await fetch(
            `https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload/${orderId}`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (!uploadResponse.ok) {
            throw new Error("Erro no upload do arquivo.");
          }

          message.success("Arquivo enviado com sucesso!");
        } else if (!imageUrl) {
          message.info("Formulário enviado sem anexo.");
        }
      } catch (error) {
        console.error("Erro ao enviar a ordem ou o arquivo:", error);
        message.error("Erro ao processar o formulário.");
      }
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        onToggleSidebar={() => handleSetState("isSidebarOpen", !isSidebarOpen)}
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
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="avatar"
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

              <Button
                onClick={toggleView}
                className="mt-2 bg-primary hover:bg-primary/90"
              >
                Fechar
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
