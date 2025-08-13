'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/context/CartStore';
import { useCartUIStore } from '@/features/shared/stores/cart-ui.store';
import { formatCurrency } from '@/features/shared/utils/formatCurrency';
import {
  Eye,
  MinusCircle,
  Package,
  PlusCircle,
  ShoppingCart,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import type { ProductClient } from '../../types/product.type';

interface ProductCardProps {
  product: ProductClient;
}

function ProductCard({ product }: ProductCardProps) {
  const { addItem, isInCart, updateQuantity, getItemQuantity } = useCartStore();
  const { open } = useCartUIStore();
  const quantity = getItemQuantity(product.id);

  const effectivePrice = product.price;

  const handleAddToCart = () => {
    const wasInCart = isInCart(product.id);
    addItem({
      id: product.id,
      name: product.name,
      price: effectivePrice,
      image: product.mainImage,
      quantity: 1,
    });
    // If it wasn't in the cart, open the sheet and do not show toast
    if (!wasInCart) {
      open();
      return;
    }
    // If it was already there (edge), show toast
    toast.success(`${product.name} añadido al carrito`);
  };

  const handleIncrement = () => {
    updateQuantity(product.id, quantity + 1);
    toast.success(`Se actualizó la cantidad de ${product.name}`);
  };
  const handleDecrement = () => {
    const newQty = Math.max(quantity - 1, 0);
    updateQuantity(product.id, newQty);
    toast.success(
      newQty > 0
        ? `Se actualizó la cantidad de ${product.name}`
        : `${product.name} eliminado del carrito`,
    );
  };

  return (
    <div className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-md rounded-md">
      <div className="relative aspect-square overflow-hidden">
        {product.mainImage ? (
          <Image
            src={product.mainImage}
            alt={product.name}
            width={400}
            height={400}
            className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge className="bg-primary/40   font-medium shadow-sm">
            {product.category.name}
          </Badge>
        </div>
      </div>
      <div className="flex-grow p-4 bg-card rounded-b-md border border-t-0 border-border/50">
        <h3 className="font-semibold text-lg line-clamp-2 mb-2">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-lg font-bold text-primary">
            {formatCurrency(effectivePrice)}
          </span>
          {product.priceOff && (
            <span className="text-sm text-muted-foreground line-through">
              {formatCurrency(product.priceOff)}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/dashboard/cli-tienda/detalle/${product.id}`}
            className="w-full"
          >
            <Button variant="outline" className="w-full h-9">
              <Eye className="h-4 w-4 mr-2" />
              Detalles
            </Button>
          </Link>
          {isInCart(product.id) ? (
            <div className="flex items-center justify-between w-full border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-r-none"
                onClick={handleDecrement}
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
              <span className="flex-grow text-center font-medium">
                {quantity}
              </span>
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
            <Button className="w-full h-9" onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

interface ProductClientCardsProps {
  data: ProductClient[];
}

export function ProductClientCards({ data }: ProductClientCardsProps) {
  if (!data.length) {
    return (
      <div className="text-center text-muted-foreground py-12">
        No hay productos disponibles
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {data.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
