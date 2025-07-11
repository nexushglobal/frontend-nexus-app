"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { formatCurrency } from "@/features/shared/utils/formatCurrency";
import { PaymentItem } from "@/features/payment/types/response-payment";
import { formatDateTime } from "@/features/payment/utils/payement.utils";


interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: PaymentItem[]
  initialIndex: number;
  paymentMethod: string;
}

export function ImageModal({
  isOpen,
  onClose,
  items,
  initialIndex,
  paymentMethod
}: ImageModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentItem = items[currentIndex];
  const currentImageUrl = currentItem?.url || (paymentMethod === "POINTS" ? "/imgs/logo.png" : "/imgs/logo.png");

  // Reset transformations when changing images
  useEffect(() => {
    setScale(1);
    setRotation(0);
  }, [currentIndex]);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setScale(1);
      setRotation(0);
      setIsFullscreen(false);
    }
  }, [isOpen, initialIndex]);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const toggleFullscreen = () => setIsFullscreen(prev => !prev);

  const handleDownload = async () => {
    try {
      const response = await fetch(currentImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payment-item-${currentItem.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const handlePrevious = () => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : items.length - 1);
  };

  const handleNext = () => {
    setCurrentIndex(prev => prev < items.length - 1 ? prev + 1 : 0);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowLeft':
        handlePrevious();
        break;
      case 'ArrowRight':
        handleNext();
        break;
      case '+':
      case '=':
        handleZoomIn();
        break;
      case '-':
        handleZoomOut();
        break;
      case 'r':
      case 'R':
        handleRotate();
        break;
      case 'f':
      case 'F':
        toggleFullscreen();
        break;
      case 'Escape':
        onClose();
        break;
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, currentIndex]);

  if (!isOpen || !currentItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`${isFullscreen
          ? 'max-w-screen max-h-screen w-screen h-screen border-0 rounded-none'
          : 'max-w-5xl max-h-[90vh] w-[90vw]'
          } p-0 overflow-hidden flex flex-col`}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-4 border-b bg-card space-y-0">
          <div className="flex items-center gap-4">
            <div>
              <DialogTitle className="text-lg font-semibold">Comprobante de Pago</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Elemento {currentIndex + 1} de {items.length}
              </p>
            </div>
            <Badge variant="secondary" className="text-xs">
              {currentItem.itemType || 'Comprobante'}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-1" />
              </>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="h-8 w-8 p-0"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="h-8 w-8 p-0"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </DialogHeader>

        {/* Content - Image */}
        <div className="flex-1 flex items-center justify-center bg-muted/20 p-6 min-h-0">
          <div
            className="relative transition-transform duration-200 ease-out select-none"
            style={{
              transform: `scale(${scale}) rotate(${rotation}deg)`,
              transformOrigin: 'center center'
            }}
          >
            <Image
              src={currentImageUrl}
              alt={`Item ${currentIndex + 1}`}
              width={700}
              height={500}
              className="max-w-full max-h-full object-contain rounded-lg shadow-lg border"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/imgs/logo.png";
              }}
              priority
              unoptimized
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-card">
          {/* Controls */}
          <div className="flex items-center justify-center gap-2 p-3 border-b">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
              className="h-8 px-3"
            >
              <ZoomOut className="h-4 w-4 mr-1" />
              Alejar
            </Button>
            <span className="text-sm text-muted-foreground px-3 min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={scale >= 3}
              className="h-8 px-3"
            >
              <ZoomIn className="h-4 w-4 mr-1" />
              Acercar
            </Button>
            <div className="w-px h-6 bg-border mx-2" />
            <Button
              variant="outline"
              size="sm"
              onClick={handleRotate}
              className="h-8 px-3"
            >
              <RotateCw className="h-4 w-4 mr-1" />
              Rotar
            </Button>
          </div>

          {/* Item Details */}
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="p-3 rounded-lg bg-success/10 w-fit mx-auto mb-2">
                  <Download className="h-5 w-5 text-success" />
                </div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Monto
                </p>
                <p className="text-lg font-bold text-success">
                  {formatCurrency(currentItem.amount)}
                </p>
              </div>

              {currentItem.pointsTransactionId && (
                <div className="text-center">
                  <div className="p-3 rounded-lg bg-warning/10 w-fit mx-auto mb-2">
                    <Download className="h-5 w-5 text-warning" />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                    ID Transacción
                  </p>
                  <p className="font-mono text-sm bg-muted/50 px-2 py-1 rounded border">
                    {currentItem.pointsTransactionId}
                  </p>
                </div>
              )}

              {currentItem.bankName && (
                <div className="text-center">
                  <div className="p-3 rounded-lg bg-secondary/10 w-fit mx-auto mb-2">
                    <Download className="h-5 w-5 text-secondary" />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                    Banco
                  </p>
                  <p className="text-sm font-semibold">
                    {currentItem.bankName}
                  </p>
                </div>
              )}

              <div className="text-center">
                <div className="p-3 rounded-lg bg-info/10 w-fit mx-auto mb-2">
                  <Download className="h-5 w-5 text-info" />
                </div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Fecha
                </p>
                <p className="text-sm font-semibold">
                  {formatDateTime(currentItem.transactionDate)}
                </p>
              </div>
            </div>

            {/* Keyboard shortcuts */}
            <div className="mt-4 pt-3 border-t">
              <p className="text-xs text-muted-foreground text-center">
                ⌨️ Atajos: ← → (navegar) • + - (zoom) • R (rotar) • F (pantalla completa) • ESC (cerrar)
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}