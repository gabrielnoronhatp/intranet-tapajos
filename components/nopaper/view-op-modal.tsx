'use client';
import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { OrderState } from '@/types/noPaper/Order/OrderState';
import { Item } from '@/types/noPaper/Order/ItemOrder';
import { CentroCusto } from '@/types/noPaper/Order/CentroCustoType';
interface ViewOpModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: OrderState;
}

export function ViewOpModal({ isOpen, onClose, order }: ViewOpModalProps) {
    if (!order) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Ordem de Pagamento #{order.id}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Dados de Origem */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">Dados de Origem</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Ramo</Label>
                                <p className="text-sm">{order.ramo}</p>
                            </div>
                            <div>
                                <Label>Tipo Lançamento</Label>
                                <p className="text-sm">
                                    {order.tipoLancamento}
                                </p>
                            </div>
                            <div>
                                <Label>Fornecedor</Label>
                                <p className="text-sm">{order.fornecedorOP}</p>
                            </div>
                            <div>
                                <Label>Nota Fiscal</Label>
                                <p className="text-sm">{order.notaFiscal}</p>
                            </div>
                        </div>
                    </div>

                    {/* Dados Financeiros */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">Dados Financeiros</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Forma de Pagamento</Label>
                                <p className="text-sm">
                                    {order.formaPagamento}
                                </p>
                            </div>
                            <div>
                                <Label>Valor Total</Label>
                                <p className="text-sm">R$ {order.valorTotal}</p>
                            </div>
                        </div>
                    </div>

                    {/* Itens */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">Itens</h3>
                        <div className="space-y-2">
                            {order.itens?.map((item: Item, index: number) => (
                                <div key={index} className="border p-2 rounded">
                                    <p className="text-sm">
                                        <span className="font-medium">
                                            Descrição:
                                        </span>{' '}
                                        {item.produto}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-medium">
                                            Valor:
                                        </span>{' '}
                                        R$ {item.valor}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Centros de Custo */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">Centros de Custo</h3>
                        <div className="space-y-2">
                            {order.centrosCusto?.map(
                                (centro: CentroCusto, index: number) => (
                                    <div
                                        key={index}
                                        className="border p-2 rounded"
                                    >
                                        <p className="text-sm">
                                            <span className="font-medium">
                                                Centro:
                                            </span>{' '}
                                            {centro?.centrocusto}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">
                                                Valor:
                                            </span>{' '}
                                            R$ {centro.valor}
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
