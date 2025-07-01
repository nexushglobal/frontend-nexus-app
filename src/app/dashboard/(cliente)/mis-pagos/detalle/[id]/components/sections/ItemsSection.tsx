"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PaymentDetailResponse } from "../../actions";
import { CreditCard, Image as ImageIcon, Package, Eye, ZoomIn } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ImageModal } from "../ImageModal";
import { formatCurrency, formatDateTime } from "@/lib/formatters";

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

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Elementos del Pago ({payment.items.length})
                    </CardTitle>
                    {hasImages && (
                        <p className="text-sm text-muted-foreground">
                            Haz clic en cualquier imagen para verla en detalle
                        </p>
                    )}
                </CardHeader>
                <CardContent>
                    {payment.items.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>No hay elementos asociados a este pago</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {payment.items.map((item, index) => (
                                <Card key={item.id} className="border-l-4 border-l-primary">
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-4">
                                            {/* Image Section */}
                                            <div className="flex-shrink-0">
                                                {item.url || payment.paymentMethod === "POINTS" ? (
                                                    <div className="relative group">
                                                        <div
                                                            className="w-16 h-16 bg-muted rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
                                                            onClick={() => handleImageClick(index)}
                                                        >
                                                            <Image
                                                                src={item.url || getDefaultImage(payment.paymentMethod) || "/imgs/logo.png"}
                                                                alt={`Item ${index + 1}`}
                                                                width={64}
                                                                height={64}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    const target = e.target as HTMLImageElement;
                                                                    target.src = "/imgs/logo.png";
                                                                }}
                                                            />
                                                        </div>

                                                        {/* Hover Overlay */}
                                                        <div
                                                            className="absolute inset-0 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
                                                            onClick={() => handleImageClick(index)}
                                                        >
                                                            <ZoomIn className="h-5 w-5 text-white" />
                                                        </div>

                                                        {/* Image indicator badge */}
                                                        <Badge
                                                            variant="secondary"
                                                            className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                                                        >
                                                            {index + 1}
                                                        </Badge>
                                                    </div>
                                                ) : (
                                                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                                                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Item Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="text-xs">
                                                            {item.itemType}
                                                        </Badge>
                                                        {(item.url || payment.paymentMethod === "POINTS") && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleImageClick(index)}
                                                                className="h-6 px-2 text-xs"
                                                            >
                                                                <Eye className="h-3 w-3 mr-1" />
                                                                Ver imagen
                                                            </Button>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                                                            {formatCurrency(item.amount)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {item.pointsTransactionId && (
                                                        <div>
                                                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                                ID de Transacción de Puntos
                                                            </label>
                                                            <p className=" font-mono bg-muted px-2 py-1 rounded text-xs">
                                                                {item.pointsTransactionId}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {item.bankName && (
                                                        <div>
                                                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                                Banco
                                                            </label>
                                                            <p className="text-sm">{item.bankName}</p>
                                                        </div>
                                                    )}

                                                    <div className="md:col-span-2">
                                                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                            Fecha de Transacción
                                                        </label>
                                                        <p className="text-sm">{formatDateTime(item.transactionDate)}</p>
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