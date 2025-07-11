"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentDetailResponse } from "@/features/payment/types/payments.type";
import { formatDateTime } from "@/features/payment/utils/payement.utils";
import { formatCurrency } from "@/features/shared/utils/formatCurrency";
import {
    Building2,
    Calendar,
    Eye,
    Hash,
    Image as ImageIcon,
    Package,
    Receipt
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ImageModal } from "../ImageModal";

interface ItemsSectionProps {
    payment: PaymentDetailResponse;
}

export function ItemsSection({ payment }: ItemsSectionProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const getDefaultImage = (paymentMethod: string) => {
        return paymentMethod === "POINTS" ? "/imgs/logo.png" : null;
    };

    const handleImageClick = (index: number) => {
        setSelectedImageIndex(index);
        setIsModalOpen(true);
    };

    const hasImages = payment.items.some(item => item.url || payment.paymentMethod === "POINTS");

    const totalAmount = payment.items.reduce((sum, item) => sum + item.amount, 0);

    return (
        <div className="space-y-6">


            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-3 text-card-foreground">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Package className="h-5 w-5 text-primary" />
                        </div>
                        Elementos del Pago
                        <div className="text-right ml-auto">
                            <p className="text-3xl font-bold text-primary">
                                {formatCurrency(totalAmount)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Monto total
                            </p>
                        </div>

                    </CardTitle>
                    {hasImages && (
                        <p className="text-sm text-muted-foreground mt-2">
                            Haz clic en cualquier imagen para verla en detalle
                        </p>
                    )}
                </CardHeader>
                <CardContent>
                    {payment.items.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <div className="p-4 rounded-full bg-muted/30 w-fit mx-auto mb-4">
                                <Package className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                            <h3 className="font-medium text-foreground mb-1">Sin elementos</h3>
                            <p className="text-sm">No hay elementos asociados a este pago</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {payment.items.map((item, index) => (
                                <Card key={item.id} className="bg-muted/20 border-muted">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-6">
                                            {/* Image Section */}
                                            <div className="flex-shrink-0">
                                                {item.url || payment.paymentMethod === "POINTS" ? (
                                                    <div
                                                        className="relative group cursor-pointer"
                                                        onClick={() => handleImageClick(index)}
                                                    >
                                                        <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-muted bg-muted/50 transition-all duration-200 group-hover:border-primary/50 group-hover:shadow-md">
                                                            <Image
                                                                src={item.url || getDefaultImage(payment.paymentMethod) || "/imgs/placeholder.png"}
                                                                alt={`Comprobante ${index + 1}`}
                                                                width={96}
                                                                height={96}
                                                                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                                                onError={(e) => {
                                                                    const target = e.target as HTMLImageElement;
                                                                    target.src = "/imgs/placeholder.png";
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                                                            <div className="bg-white/90 dark:bg-black/90 rounded-full p-2">
                                                                <Eye className="h-4 w-4 text-foreground" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="w-24 h-24 rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/30 flex items-center justify-center">
                                                        <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content Section */}
                                            <div className="flex-1 min-w-0 space-y-4">
                                                {/* Header with Amount */}
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-lg bg-success/10">
                                                            <Receipt className="h-4 w-4 text-success" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-foreground">Elemento #{index + 1}</h4>
                                                            <p className="text-sm text-muted-foreground">ID: {item.id}</p>
                                                        </div>
                                                    </div>

                                                    <div className="text-right">
                                                        <p className="text-xl font-bold text-success">
                                                            {formatCurrency(item.amount)}
                                                        </p>
                                                        {item.url && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleImageClick(index)}
                                                                className="h-auto px-2 py-1 text-xs text-primary hover:text-primary"
                                                            >
                                                                <Eye className="h-3 w-3 mr-1" />
                                                                Ver comprobante
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Details Grid */}
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                    {item.pointsTransactionId && (
                                                        <div className="info-field">
                                                            <div className="p-2 rounded-lg bg-warning/10">
                                                                <Hash className="field-icon text-warning" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="section-title">ID de Transacción de Puntos</p>
                                                                <p className="font-mono text-sm font-medium bg-muted/50 px-3 py-1.5 rounded-md border">
                                                                    {item.pointsTransactionId}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {item.bankName && (
                                                        <div className="info-field">
                                                            <div className="p-2 rounded-lg bg-secondary/10">
                                                                <Building2 className="field-icon text-secondary" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="section-title">Banco</p>
                                                                <p className="text-sm font-medium text-foreground">{item.bankName}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="info-field lg:col-span-2">
                                                        <div className="p-2 rounded-lg bg-info/10">
                                                            <Calendar className="field-icon text-info" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="section-title">Fecha de Transacción</p>
                                                            <p className="text-sm font-medium text-foreground">{formatDateTime(item.transactionDate)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Image Modal */}
            <ImageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                items={payment.items}
                initialIndex={selectedImageIndex}
                paymentMethod={payment.paymentMethod}
            />
        </div>
    );
}