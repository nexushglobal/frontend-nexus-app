'use client';

import { Button } from '@/components/ui/button';
import { useCartStore } from '@/context/CartStore';
import { useCartUIStore } from '@/features/shared/stores/cart-ui.store';
import { MinusCircle, PlusCircle, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

interface AddToCartControlsProps {
  productId: number;
  productName: string;
  price: number;
  image?: string;
}

export function AddToCartControls({
  productId,
  productName,
  price,
  image,
}: AddToCartControlsProps) {
  const { addItem, isInCart, updateQuantity, getItemQuantity } = useCartStore();
  const { open } = useCartUIStore();

  const quantity = getItemQuantity(productId);

  const handleAddToCart = () => {
    const wasInCart = isInCart(productId);
    addItem({
      id: productId,
      name: productName,
      price,
      image: image || '',
      quantity: 1,
    });
    if (!wasInCart) {
      open();
      return;
    }
    toast.success(`${productName} añadido al carrito`);
  };

  const handleIncrement = () => {
    updateQuantity(productId, quantity + 1);
    toast.success(`Se actualizó la cantidad de ${productName}`);
  };

  const handleDecrement = () => {
    const newQty = Math.max(quantity - 1, 0);
    updateQuantity(productId, newQty);
    toast.success(
      newQty > 0
        ? `Se actualizó la cantidad de ${productName}`
        : `${productName} eliminado del carrito`,
    );
  };

  return (
    <div className="flex gap-2">
      {quantity > 0 ? (
        <div className="flex items-center justify-between w-40 border rounded-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-r-none"
            onClick={handleDecrement}
          >
            <MinusCircle className="h-4 w-4" />
          </Button>
          <span className="flex-grow text-center font-medium">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-l-none"
            onClick={handleIncrement}
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button className="h-9" onClick={handleAddToCart}>
          <ShoppingCart className="h-4 w-4 mr-2" /> Agregar al carrito
        </Button>
      )}
    </div>
  );
}
