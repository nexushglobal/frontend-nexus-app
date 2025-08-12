'use client';

import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCartStore } from '@/context/CartStore';
import { PageHeader } from '@/features/shared/components/common/PageHeader';
import { formatCurrency } from '@/features/shared/utils/formatCurrency';
import { ShoppingCart } from 'lucide-react';

export default function CartClientPage() {
  const { items } = useCartStore();

  const total = items.reduce((acc, it) => acc + it.price * it.quantity, 0);

  const handleProcess = () => {
    window.alert('procesar venta');
  };

  return (
    <div className="container space-y-6">
      <PageHeader
        title="Carrito"
        subtitle="Revisa tus productos antes de procesar la compra"
        variant="gradient"
        icon={ShoppingCart}
        backUrl="/dashboard/(cliente)/cli-tienda"
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {/* Columna productos 3/4 */}
        <div className="md:col-span-3 space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Productos</CardTitle>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <p className="text-muted-foreground">Tu carrito está vacío.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 overflow-hidden rounded border border-primary/10 bg-muted">
                              {item.image ? (
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  width={48}
                                  height={48}
                                  className="h-full w-full object-cover"
                                />
                              ) : null}
                            </div>
                            <span className="font-medium">{item.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatCurrency(item.price)}</TableCell>
                        <TableCell>
                          {formatCurrency(item.price * item.quantity)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Columna resumen 1/4 */}
        <div className="md:col-span-1">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Resumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-lg font-semibold text-primary">
                  {formatCurrency(total)}
                </span>
              </div>
              <Button
                disabled={items.length === 0}
                onClick={handleProcess}
                className="w-full bg-primary hover:bg-primary/90"
              >
                Procesar venta
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
