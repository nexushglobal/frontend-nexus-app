import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatDate } from '@/features/shared/utils/formatCurrency';
import { Transaction } from '../types/points.types';
import TransactionActionsButton from './TransactionActiosButton';

interface TransactionsCardsProps {
  data: Transaction[];
}

export function TransactionsCards({ data }: TransactionsCardsProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No hay transacciones disponibles
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((transaction) => (
        <Card key={transaction.id} className="shadow-sm">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-medium">
                  #{transaction.id}
                </span>
                <StatusBadge status={transaction.status} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Tipo</p>
                  <StatusBadge status={transaction.type} />
                </div>
                <div className="text-right space-y-1">
                  <p className="text-xs text-muted-foreground">Cantidad</p>
                  <p className="text-sm font-medium">{transaction.amount}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Fecha</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(transaction.createdAt)}
                </p>
              </div>

              <div className="pt-2 border-t">
                <TransactionActionsButton transaction={transaction} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
