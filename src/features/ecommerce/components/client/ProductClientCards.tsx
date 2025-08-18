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
    <div className="group overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg border border-border/50 rounded-lg bg-card">
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/dashboard/cli-tienda/productos/detalle/${product.id}`}>
          {product.mainImage ? (
            <Image
              src={product.mainImage}
              alt={product.name}
              width={400}
              height={400}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105 cursor-pointer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted cursor-pointer">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </Link>

        {/* Category Badge */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-white text-slate-800 hover:bg-white/90 font-medium shadow-md border border-white/20">
            {product.category.name}
          </Badge>
        </div>

        {/* Discount Badge */}
        {product.priceOff && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-destructive text-destructive-foreground">
              {Math.round(
                ((product.priceOff - effectivePrice) / product.priceOff) * 100,
              )}
              % OFF
            </Badge>
          </div>
        )}

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Link href={`/dashboard/cli-tienda/productos/detalle/${product.id}`}>
            <Button size="sm" variant="secondary" className="gap-2">
              <Eye className="h-4 w-4" />
              Ver detalles
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex-grow p-4 space-y-3">
        <Link
          href={`/dashboard/cli-tienda/productos/detalle/${product.id}`}
          className="block hover:text-primary transition-colors"
        >
          <h3 className="font-semibold text-base line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-primary">
            {formatCurrency(effectivePrice)}
          </span>
          {product.priceOff && (
            <span className="text-sm text-muted-foreground line-through">
              {formatCurrency(product.priceOff)}
            </span>
          )}
        </div>

        <div className="space-y-2">
          {isInCart(product.id) ? (
            <div className="flex items-center border rounded-lg overflow-hidden">
              <Button
                variant="ghost"
                size="sm"
                className="h-10 rounded-none border-r"
                onClick={handleDecrement}
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
              <div className="flex-1 flex items-center justify-center h-10 bg-muted/50">
                <span className="font-medium">{quantity}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 rounded-none border-l"
                onClick={handleIncrement}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button className="w-full h-10 gap-2" onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4" />
              Agregar al carrito
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// List View Product Card
function ProductCardList({ product }: ProductCardProps) {
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
    if (!wasInCart) {
      open();
      return;
    }
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
    <div className="group flex gap-4 p-4 border border-border/50 rounded-lg bg-card hover:shadow-md transition-all duration-300">
      {/* Product Image */}
      <Link
        href={`/dashboard/cli-tienda/productos/detalle/${product.id}`}
        className="flex-shrink-0"
      >
        <div className="relative w-32 h-32 overflow-hidden rounded-lg">
          {product.mainImage ? (
            <Image
              src={product.mainImage}
              alt={product.name}
              width={128}
              height={128}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          )}

          {/* Discount Badge */}
          {product.priceOff && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-destructive text-destructive-foreground text-xs">
                {Math.round(
                  ((product.priceOff - effectivePrice) / product.priceOff) *
                    100,
                )}
                % OFF
              </Badge>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <Link
              href={`/dashboard/cli-tienda/productos/detalle/${product.id}`}
              className="hover:text-primary transition-colors"
            >
              <h3 className="font-semibold text-lg line-clamp-2 leading-tight">
                {product.name}
              </h3>
            </Link>
            <Badge className="shrink-0 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20">
              {product.category.name}
            </Badge>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(effectivePrice)}
            </span>
            {product.priceOff && (
              <span className="text-sm text-muted-foreground line-through">
                {formatCurrency(product.priceOff)}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-4">
          <Link href={`/dashboard/cli-tienda/productos/detalle/${product.id}`}>
            <Button variant="outline" size="sm" className="gap-2">
              <Eye className="h-4 w-4" />
              Ver detalles
            </Button>
          </Link>

          {isInCart(product.id) ? (
            <div className="flex items-center border rounded-lg overflow-hidden">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 rounded-none border-r"
                onClick={handleDecrement}
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
              <div className="flex items-center justify-center h-9 px-4 bg-muted/50">
                <span className="font-medium">{quantity}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 rounded-none border-l"
                onClick={handleIncrement}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button className="gap-2" onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4" />
              Agregar al carrito
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

interface ProductClientCardsProps {
  data: ProductClient[];
  viewMode?: 'grid' | 'list';
}

export function ProductClientCards({
  data,
  viewMode = 'grid',
}: ProductClientCardsProps) {
  if (!data.length) {
    return (
      <div className="text-center text-muted-foreground py-12">
        No hay productos disponibles
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {data.map((product) => (
          <ProductCardList key={product.id} product={product} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {data.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
