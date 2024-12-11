"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Order } from "@/lib/data/mock-orders";
import { CheckCircle2, XCircle } from "lucide-react";


interface DataTableProps {
  orders: Order[];
}

export function DataTable({ orders }: DataTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.fornecedor}</TableCell>
              <TableCell>{order.cnpj}</TableCell>
              <TableCell>{order.notaFiscal}</TableCell>
              <TableCell>{order.formaPagamento}</TableCell>
              <TableCell>{order.contaGerencial}</TableCell>
              <TableCell className="text-center">{order.itens}</TableCell>
              <TableCell className="text-center">{order.parcelas}</TableCell>
              <TableCell className="text-right">{formatCurrency(order.valor)}</TableCell>
              <TableCell className="text-center">
                {order.assinaturas.primeira ? (
                  <CheckCircle2 className="h-5 w-5 text-primary mx-auto" />
                ) : (
                  <XCircle className="h-5 w-5 text-muted-foreground mx-auto" />
                )}
              </TableCell>
              <TableCell className="text-center">
                {order.assinaturas.segunda ? (
                  <CheckCircle2 className="h-5 w-5 text-primary mx-auto" />
                ) : (
                  <XCircle className="h-5 w-5 text-muted-foreground mx-auto" />
                )}
              </TableCell>
              <TableCell className="text-center">
                {order.assinaturas.terceira ? (
                  <CheckCircle2 className="h-5 w-5 text-primary mx-auto" />
                ) : (
                  <XCircle className="h-5 w-5 text-muted-foreground mx-auto" />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}