'use client';

import { Button } from '@/components/ui/button';
import { DollarSign, Eye } from 'lucide-react';
import { useState } from 'react';
import { SaleStatus } from '../types/sale.enums';
import { Sale } from '../types/sale.types';
import { PaymentSummary } from './PaymentSummary';

interface Props {
  onViewDetail: (referenceId: string) => void;
  data: Sale;
}

export default function PaymentsButton({ onViewDetail, data }: Props) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewDetail(data.saleIdReference)}
        className="h-8 px-2 hover:bg-gray-100"
      >
        <Eye className="h-4 w-4" />
        <span className="sr-only">Ver detalle</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsModalOpen(true)}
        className="h-8 px-2 hover:bg-gray-100 disabled:cursor-not-allowed"
        disabled={data.status === SaleStatus.PENDING_APPROVAL}
      >
        <DollarSign className="h-4 w-4" />
        <span className="sr-only">Realizar pago</span>
      </Button>

      <PaymentSummary
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sale={data}
      />
    </>
  );
}
