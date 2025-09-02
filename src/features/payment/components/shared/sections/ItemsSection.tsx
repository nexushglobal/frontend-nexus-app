'use client';

import { Card } from '@/components/ui/card';
import { PaymentMethod } from '@/features/payment/types/enums-payments';
import { PaymentItem } from '@/features/payment/types/response-payment';
import { formatDateTime } from '@/features/payment/utils/payement.utils';
import { formatCurrency } from '@/features/shared/utils/formatCurrency';
import {
  Building2,
  Calendar,
  Eye,
  Hash,
  Image as ImageIcon,
  Package,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { ImageModal } from '../modal/ImageModal';

interface ItemsSectionProps {
  items: PaymentItem[];
  paymentMethod: PaymentMethod;
}

export function ItemsSection({ items, paymentMethod }: ItemsSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const getDefaultImage = (paymentMethod: string) => {
    return paymentMethod === 'POINTS' ? '/imgs/logo.png' : null;
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const hasImages = items.some(
    (item) => item.url || paymentMethod === 'POINTS',
  );

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-3">
      {/* Compact Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm">Vouchers</span>
        </div>
        {hasImages && (
          <div className="text-xs text-muted-foreground">Toca para ampliar</div>
        )}
      </div>

      {/* Voucher Cards Grid */}
      {items.length === 0 ? (
        <Card className="p-6">
          <div className="text-center text-muted-foreground">
            <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <div className="text-sm">Sin vouchers</div>
          </div>
        </Card>
      ) : (
        <div
          className={`grid gap-3 ${
            items.length === 1
              ? 'grid-cols-2'
              : items.length === 2
              ? 'grid-cols-2'
              : items.length === 3
              ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3'
              : items.length === 4
              ? 'grid-cols-2'
              : 'grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {items.map((item, index) => (
            <Card key={item.id} className="overflow-hidden">
              {/* Image Section */}
              <div className="relative aspect-square">
                {item.url || paymentMethod === 'POINTS' ? (
                  <div
                    className="relative cursor-pointer group w-full h-full"
                    onClick={() => handleImageClick(index)}
                  >
                    <Image
                      src={
                        item.url ||
                        getDefaultImage(paymentMethod) ||
                        '/imgs/placeholder.png'
                      }
                      alt={`Voucher ${index + 1}`}
                      fill
                      className="object-cover "
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/imgs/placeholder.png';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white/90 dark:bg-black/90 rounded-full p-2">
                        <Eye className="h-4 w-4" />
                      </div>
                    </div>
                    {/* Amount Badge */}
                    <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">
                      {formatCurrency(item.amount)}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-muted/30 flex items-center justify-center">
                    <div className="text-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                      <div className="text-xs text-muted-foreground">
                        Sin imagen
                      </div>
                    </div>
                    {/* Amount Badge */}
                    <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">
                      {formatCurrency(item.amount)}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer with Bank and Date */}
              <div className="p-2 bg-muted/20 border-t">
                <div className="flex items-center justify-between text-xs">
                  {item.bankName ? (
                    <div className="flex items-center gap-1 min-w-0">
                      <Building2 className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="font-medium truncate">
                        {item.bankName}
                      </span>
                    </div>
                  ) : item.pointsTransactionId ? (
                    <div className="flex items-center gap-1 min-w-0">
                      <Hash className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="font-mono text-xs bg-muted px-1 rounded truncate">
                        {item.pointsTransactionId}
                      </span>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">#{index + 1}</div>
                  )}

                  <div className="flex items-center gap-1 text-muted-foreground flex-shrink-0">
                    <Calendar className="h-3 w-3" />
                    <span className="text-xs">
                      {formatDateTime(item.transactionDate).split(' ')[0]}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        items={items}
        initialIndex={selectedImageIndex}
        paymentMethod={paymentMethod}
      />
    </div>
  );
}
