export interface Order {
  id: number;
  filial: string;
  fornecedor: string;
  cnpj: string;
  contagerencial: string;
  formapag: string;
  notafiscal: string;
  parcelas: number;
  itens: number;
  valor: string;
  assinatura1: string | null;
  dtassinatura1: string | null;
  assinatura2: string | null;
  dtassinatura2: string | null;
  assinatura3: string | null;
  dtassinatura3: string | null;
} 