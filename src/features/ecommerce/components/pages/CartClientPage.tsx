'use client';

import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/context/CartStore';
import { PageHeader } from '@/features/shared/components/common/PageHeader';
import { OrderPaymentSheet } from '@/features/shared/components/payment/OrderPaymentSheet';
import { formatCurrency } from '@/features/shared/utils/formatCurrency';
import {
  ArrowLeft,
  Eye,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Store,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CartClientPage() {
  const { items, clearCart, updateQuantity, removeItem } = useCartStore();
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);

  const total = items.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const totalItems = items.reduce((acc, it) => acc + it.quantity, 0);

  const handleProcess = () => {
    setShowPaymentSheet(true);
  };

  const handleOrderSuccess = () => {
    toast.success('Pedido procesado exitosamente');
    clearCart();
    setShowPaymentSheet(false);
  };

  const handleIncrement = (id: number, currentQuantity: number) => {
    updateQuantity(id, currentQuantity + 1);
  };

  const handleDecrement = (id: number, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(id, currentQuantity - 1);
    } else {
      handleRemove(id);
    }
  };

  const handleRemove = (id: number) => {
    removeItem(id);
    toast.success('Producto eliminado del carrito');
  };

  return (
    <div className="container space-y-6">
      <PageHeader
        title="Carrito de Compras"
        subtitle={`${totalItems} ${
          totalItems === 1 ? 'producto' : 'productos'
        } en tu carrito`}
        variant="gradient"
        icon={ShoppingCart}
        backUrl="/dashboard/cli-tienda/productos"
      />

      {items.length === 0 ? (
        <EmptyCartState />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Columna productos 2/3 */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Productos ({items.length})
                  </CardTitle>
                  <Link href="/dashboard/cli-tienda/productos">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Store className="h-4 w-4" />
                      Agregar más productos
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item, index) => (
                  <div key={item.id}>
                    <CartItemCard
                      item={item}
                      onIncrement={handleIncrement}
                      onDecrement={handleDecrement}
                      onRemove={handleRemove}
                    />
                    {index < items.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Columna resumen 1/3 */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              <OrderSummaryCard
                items={items}
                total={total}
                totalItems={totalItems}
                onProcess={handleProcess}
              />
            </div>
          </div>
        </div>
      )}

      {/* Order Payment Sheet */}
      <OrderPaymentSheet
        isOpen={showPaymentSheet}
        onClose={() => setShowPaymentSheet(false)}
        cartItems={items}
        totalAmount={total}
        onSuccess={handleOrderSuccess}
      />
    </div>
  );
}

// Empty Cart State Component
function EmptyCartState() {
  return (
    <Card className="border-dashed border-2 border-muted-foreground/25">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mt-6 text-lg font-semibold">Tu carrito está vacío</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          No tienes productos en tu carrito. Explora nuestra tienda y encuentra
          productos increíbles.
        </p>
        <Link href="/dashboard/cli-tienda/productos">
          <Button className="mt-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Ir a la tienda
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

// Cart Item Card Component
interface CartItemCardProps {
  item: any;
  onIncrement: (id: number, quantity: number) => void;
  onDecrement: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

function CartItemCard({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemCardProps) {
  return (
    <div className="flex items-center gap-4 group">
      {/* Product Image - Clickable */}
      <Link href={`/dashboard/cli-tienda/productos/${item.id}`}>
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border bg-muted cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          {/* Overlay con icono de ver */}
          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
            <Eye className="h-5 w-5 text-white" />
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex-1 space-y-1">
        <Link
          href={`/dashboard/cli-tienda/productos/${item.id}`}
          className="hover:text-primary transition-colors"
        >
          <h3 className="font-medium text-sm leading-tight cursor-pointer">
            {item.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground">
          {formatCurrency(item.price)} c/u
        </p>
        <p className="text-sm font-semibold text-primary">
          Subtotal: {formatCurrency(item.price * item.quantity)}
        </p>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        {/* View Product Button */}
        <Link href={`/dashboard/cli-tienda/productos/${item.id}`}>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
            title="Ver producto"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </Link>

        {/* Quantity Controls */}
        <div className="flex items-center border rounded-lg">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-muted"
            onClick={() => onDecrement(item.id, item.quantity)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center text-sm font-medium">
            {item.quantity}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-muted"
            onClick={() => onIncrement(item.id, item.quantity)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        {/* Remove Button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onRemove(item.id)}
          title="Eliminar producto"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Order Summary Card Component
interface OrderSummaryCardProps {
  items: any[];
  total: number;
  totalItems: number;
  onProcess: () => void;
}

function OrderSummaryCard({
  items,
  total,
  totalItems,
  onProcess,
}: OrderSummaryCardProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShoppingCart className="h-5 w-5" />
          Resumen del Pedido
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items Summary */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Productos ({totalItems})
            </span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-xl font-bold text-primary">
            {formatCurrency(total)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onProcess}
            className="w-full h-12 text-base font-semibold"
            size="lg"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Procesar Pedido
          </Button>

          <Link href="/dashboard/cli-tienda/productos" className="w-full">
            <Button variant="outline" className="w-full h-10 text-sm" size="lg">
              <Store className="mr-2 h-4 w-4" />
              Continuar Comprando
            </Button>
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800/40">
          <p className="text-xs text-blue-700 dark:text-blue-400">
            🔒 Compra segura y protegida
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
