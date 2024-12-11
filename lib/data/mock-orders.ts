export interface Order {
    id: string;
    fornecedor: string;
    cnpj: string;
    notaFiscal: string;
    formaPagamento: string;
    contaGerencial: string;
    itens: number;
    parcelas: number;
    valor: number;
    assinaturas: {
      primeira: boolean;
      segunda: boolean;
      terceira: boolean;
    };
  }
  
  export const mockOrders: Order[] = [
    {
      id: "OP001",
      fornecedor: "Distribuidora ABC Ltda",
      cnpj: "12.345.678/0001-90",
      notaFiscal: "NF123456",
      formaPagamento: "Boleto",
      contaGerencial: "4.1.01.001",
      itens: 3,
      parcelas: 2,
      valor: 5000.00,
      assinaturas: {
        primeira: true,
        segunda: false,
        terceira: false,
      },
    },
    {
      id: "OP002",
      fornecedor: "Comercial XYZ S.A.",
      cnpj: "98.765.432/0001-21",
      notaFiscal: "NF789012",
      formaPagamento: "PIX",
      contaGerencial: "4.1.02.001",
      itens: 1,
      parcelas: 1,
      valor: 1500.00,
      assinaturas: {
        primeira: true,
        segunda: true,
        terceira: false,
      },
    },
    // Add more mock data as needed
  ];