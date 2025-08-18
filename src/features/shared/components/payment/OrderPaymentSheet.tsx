'use client';

import { createOrderAction } from '@/features/ecommerce/actions/create-order';
import { OrderItem } from '@/features/ecommerce/types/order.type';
import { BasePaymentSheet } from './BasePaymentSheet';
import { OrderResultModal } from './OrderResultModal';
import { CartItem } from '@/context/CartStore';

interface OrderPaymentSheetProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  totalAmount: number;
  notes?: string;
  paymentReference?: string;
  onSuccess?: () => void;
}

export function OrderPaymentSheet({
  isOpen,
  onClose,
  cartItems,
  totalAmount,
  notes = '',
  paymentReference = '',
  onSuccess,
}: OrderPaymentSheetProps) {
  const handleSubmit = async (formData: FormData) => {
    // Convert cart items to order items
    const orderItems: OrderItem[] = cartItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    formData.append('totalAmount', totalAmount.toString());
    formData.append('items', JSON.stringify(orderItems));
    
    if (notes) {
      formData.append('notes', notes);
    }
    
    if (paymentReference) {
      formData.append('paymentReference', paymentReference);
    }

    return await createOrderAction(formData);
  };

  const summaryContent = (
    <>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Total de items:</span>
        <span className="font-medium">
          {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        </span>
      </div>
      <div className="space-y-2">
        <span className="text-sm text-muted-foreground">Productos:</span>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center text-xs p-2 bg-muted/30 rounded"
            >
              <span className="truncate flex-1">{item.name}</span>
              <span className="ml-2 text-muted-foreground">x{item.quantity}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <BasePaymentSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Procesar Pedido"
      totalAmount={totalAmount}
      amountLabel="Total del pedido"
      summaryContent={summaryContent}
      onSubmit={handleSubmit}
      onSuccess={onSuccess}
      PaymentResultModal={OrderResultModal}
    />
  );
}