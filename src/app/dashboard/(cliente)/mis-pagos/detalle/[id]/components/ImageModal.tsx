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
  Maximize2
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { PaymentDetailResponse } from "../actions";
import { formatCurrency, formatDateTime } from "@/lib/formatters";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: PaymentDetailResponse['items'];
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
    setIsFullscreen(false);
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

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

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
        className={`${isFullscreen ? 'max-w-screen max-h-screen w-screen h-screen' : 'max-w-4xl max-h-[90vh]'} p-0 overflow-hidden`}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        {/* Header */}
        <DialogHeader className="p-4 pb-2 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-lg font-semibold">
                Elemento del Pago {currentIndex + 1} de {items.length}
              </DialogTitle>
              <Badge variant="outline" className="text-xs">
                {currentItem.itemType}
              </Badge>
            </div>

            {/* Navigation and Controls */}
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
                  <span className="text-sm text-muted-foreground px-2">
                    {currentIndex + 1} / {items.length}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNext}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              <div className="h-4 w-px bg-border mx-1" />

              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                className="h-8 w-8 p-0"
                disabled={scale <= 0.5}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>

              <span className="text-xs text-muted-foreground min-w-[3rem] text-center">
                {Math.round(scale * 100)}%
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                className="h-8 w-8 p-0"
                disabled={scale >= 3}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRotate}
                className="h-8 w-8 p-0"
              >
                <RotateCw className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="h-8 w-8 p-0"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="h-8 w-8 p-0"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Image Container */}
        <div className="flex-1 overflow-hidden bg-black/5 dark:bg-black/20 relative">
          <div
            className="w-full h-full flex items-center justify-center p-4"
            style={{ minHeight: isFullscreen ? 'calc(100vh - 140px)' : '500px' }}
          >
            <div
              className="relative transition-transform duration-200 ease-out cursor-grab active:cursor-grabbing"
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg)`,
                transformOrigin: 'center center'
              }}
            >
              <Image
                src={currentImageUrl}
                alt={`Item ${currentIndex + 1}`}
                width={600}
                height={400}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/imgs/logo.png";
                }}
                priority
                unoptimized
              />
            </div>
          </div>
        </div>

        {/* Item Details Footer */}
        <div className="p-4 border-t bg-muted/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Monto
              </label>
              <p className="font-semibold text-green-600 dark:text-green-400">
                {formatCurrency(currentItem.amount)}
              </p>
            </div>

            {currentItem.pointsTransactionId && (
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  ID Transacción
                </label>
                <p className="font-mono text-xs bg-background px-2 py-1 rounded">
                  {currentItem.pointsTransactionId}
                </p>
              </div>
            )}

            {currentItem.bankName && (
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Banco
                </label>
                <p>{currentItem.bankName}</p>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Fecha
              </label>
              <p>{formatDateTime(currentItem.transactionDate)}</p>
            </div>
          </div>
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="absolute bottom-2 left-4 text-xs text-muted-foreground">
          <p>⌨️ Teclas: ← → (navegar) | + - (zoom) | R (rotar) | ESC (cerrar)</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}