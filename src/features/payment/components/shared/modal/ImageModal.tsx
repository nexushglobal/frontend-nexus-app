'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PaymentItem } from '@/features/payment/types/response-payment';
import { formatDateTime } from '@/features/payment/utils/payement.utils';
import { formatCurrency } from '@/features/shared/utils/formatCurrency';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  Minimize2,
  RotateCw,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: PaymentItem[];
  initialIndex: number;
  paymentMethod: string;
}

export function ImageModal({
  isOpen,
  onClose,
  items,
  initialIndex,
  paymentMethod,
}: ImageModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });

  const currentItem = items[currentIndex];
  const currentImageUrl =
    currentItem?.url ||
    (paymentMethod === 'POINTS' ? '/imgs/logo.png' : '/imgs/logo.png');

  // Reset transformations when changing images
  useEffect(() => {
    setScale(1);
    setRotation(0);
    setPanOffset({ x: 0, y: 0 });
  }, [currentIndex]);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setScale(1);
      setRotation(0);
      setIsFullscreen(false);
      setPanOffset({ x: 0, y: 0 });
    }
  }, [isOpen, initialIndex]);

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => {
    const newScale = Math.max(scale - 0.25, 0.5);
    setScale(newScale);
    if (newScale === 1) {
      setPanOffset({ x: 0, y: 0 });
    }
  };
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const toggleFullscreen = () => setIsFullscreen((prev) => !prev);

  // Wheel event for zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.min(Math.max(scale + delta, 0.5), 3);
    setScale(newScale);
    if (newScale === 1) {
      setPanOffset({ x: 0, y: 0 });
    }
  };

  // Mouse events for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && scale > 1) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      setPanOffset((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Touch events for mobile panning
  const handleTouchStart = (e: React.TouchEvent) => {
    if (scale > 1 && e.touches.length === 1) {
      setIsPanning(true);
      setLastPanPoint({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isPanning && scale > 1 && e.touches.length === 1) {
      e.preventDefault();
      const deltaX = e.touches[0].clientX - lastPanPoint.x;
      const deltaY = e.touches[0].clientY - lastPanPoint.y;
      setPanOffset((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));
      setLastPanPoint({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchEnd = () => {
    setIsPanning(false);
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
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
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
        className={`${
          isFullscreen
            ? 'max-w-screen max-h-screen w-screen h-screen border-0 rounded-none'
            : 'max-w-5xl max-h-[90vh] w-[90vw]'
        } p-0 overflow-hidden flex flex-col`}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-4 border-b bg-card space-y-0">
          <div className="flex items-center gap-4">
            <div>
              <DialogTitle className="text-lg font-semibold">
                Comprobante de Pago
              </DialogTitle>
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
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </DialogHeader>

        {/* Content - Image */}
        <div 
          className="flex-1 flex items-center justify-center bg-muted/20 p-6 min-h-0 overflow-hidden"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ cursor: scale > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default' }}
        >
          <div
            className="relative transition-transform duration-200 ease-out select-none max-w-full max-h-full"
            style={{
              transform: `scale(${scale}) rotate(${rotation}deg) translate(${panOffset.x}px, ${panOffset.y}px)`,
              transformOrigin: 'center center',
            }}
          >
            <Image
              src={currentImageUrl}
              alt={`Item ${currentIndex + 1}`}
              width={0}
              height={0}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              className="w-auto h-auto max-w-full max-h-full object-contain rounded-lg shadow-lg border pointer-events-none"
              style={{
                maxWidth: '100%',
                maxHeight: isFullscreen ? '80vh' : '60vh',
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/imgs/logo.png';
              }}
              priority
              unoptimized
              draggable={false}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
