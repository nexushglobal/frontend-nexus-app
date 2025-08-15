'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface TransactionHeaderProps {
  transactionId: number;
}

export function TransactionHeader({ transactionId }: TransactionHeaderProps) {
  return (
    <div className="mb-6">
      <Button asChild variant="ghost" className="mb-4">
        <Link href="/dashboard/cli-puntos/historial-puntos">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al historial
        </Link>
      </Button>
      <h1 className="text-3xl font-bold">Detalle de Transacción</h1>
      <p className="text-muted-foreground">
        Información completa de la transacción #{transactionId}
      </p>
    </div>
  );
}
