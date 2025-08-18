'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface TransactionErrorStateProps {
  error?: string | null;
}

export function TransactionErrorState({ error }: TransactionErrorStateProps) {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/dashboard/cli-puntos/historial-puntos">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al historial
          </Link>
        </Button>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-destructive mb-2">
              {error || 'Transacción no encontrada'}
            </h3>
            <p className="text-muted-foreground">
              No se pudo cargar la información de la transacción solicitada.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
