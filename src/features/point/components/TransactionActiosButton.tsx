import { Button } from '@/components/ui/button';
import { ExternalLink, Eye } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Transaction } from '../types/points.types';
import { TransactionDetailModal } from './modals/TransactionDetailModal';

interface Props {
  transaction: Transaction;
}

const TransactionActionsButton = ({ transaction }: Props) => {
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const handleViewDetail = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const closeDetailModal = () => {
    setSelectedTransaction(null);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleViewDetail(transaction)}
          className="hover:bg-primary/10 hover:text-primary"
          title="Vista rápida"
        >
          <Eye className="h-4 w-4" />
          <span className="sr-only">Vista rápida</span>
        </Button>

        <Link href={`/historial-puntos/detalle/${transaction.id}`} passHref>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-primary/10 hover:text-primary"
            title="Ver detalle completo"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="sr-only">Ver detalle completo</span>
          </Button>
        </Link>
      </div>
      {selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          open={!!selectedTransaction}
          onClose={closeDetailModal}
        />
      )}
    </>
  );
};

export default TransactionActionsButton;
