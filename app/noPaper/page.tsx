"use client";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import OriginData from "@/components/nopaper/form/origin-data-form";
import FinancialData from "@/components/nopaper/form/financial-data-form";
import TaxesData from "@/components/nopaper/form/taxes-data-form";
import CenterOfCoust from "@/components/nopaper/form/center-of-coust-form";
import { useSelector } from "react-redux";
import { RootState } from "@/hooks/store";

export default function NoPaper() {
  const selectedFornecedor = useSelector((state: RootState) => state.order.selectedFornecedor);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onToggleSidebar={() => {}} />
      <Sidebar isOpen={false} />

      <main className="pt-16 transition-all duration-300 ml-20">
        <div className="p-4">
          <h1 className="text-xl font-bold text-primary mb-4">
            Lançamento NoPaper
          </h1>

          <div className="max-w-3xl mx-auto">
            <form className="space-y-4">
              <OriginData />
              <FinancialData />
              {/* <TaxesData /> */}
              {/* <CenterOfCoust /> */}

              <div className="mt-6">
                <div className="avatar-uploader">
                  <button style={{ border: 0, background: "none" }} type="button">
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="w-full bg-primary hover:bg-primary/90     ">
                  Lançar Ordem de Pagamento
                </Button>
              </div>
            </form>

           
            {selectedFornecedor && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold">Fornecedor Selecionado:</h2>
                <p>{selectedFornecedor.fornecedor}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
