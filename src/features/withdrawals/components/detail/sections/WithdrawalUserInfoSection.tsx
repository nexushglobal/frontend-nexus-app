import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Building2,
  CreditCard,
  MapPin,
  Phone,
  User,
} from 'lucide-react';
import { WithdrawalDetail } from '../../../types/withdrawals.types';

interface WithdrawalUserInfoSectionProps {
  withdrawal: WithdrawalDetail;
}

export function WithdrawalUserInfoSection({ withdrawal }: WithdrawalUserInfoSectionProps) {
  return (
    <div className="space-y-3">
      {/* Compact User Info */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Usuario</span>
        </div>
        <div className="space-y-2 text-sm">
          <div>{withdrawal.user.personalInfo.firstName} {withdrawal.user.personalInfo.lastName}</div>
          <div className="text-xs text-muted-foreground">{withdrawal.user.email}</div>
          <div className="text-xs text-muted-foreground">ID: {withdrawal.user.id}</div>
        </div>
      </Card>

      {/* Compact Bank Info - Only withdrawal specific info */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Cuenta de Destino</span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Banco:</span>
            <span className="font-medium">{withdrawal.bankName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cuenta:</span>
            <span className="font-mono text-xs">{withdrawal.accountNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">CCI:</span>
            <span className="font-mono text-xs">{withdrawal.cci}</span>
          </div>
        </div>
      </Card>

      {/* Compact Reviewer Info */}
      {withdrawal.reviewedBy && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Revisor</span>
          </div>
          <div className="space-y-1 text-sm">
            <div>{withdrawal.reviewedBy.email}</div>
            <div className="text-xs text-muted-foreground">ID: {withdrawal.reviewedBy.id}</div>
          </div>
        </Card>
      )}

      {/* Archived Status */}
      {withdrawal.isArchived && (
        <Card className="p-4">
          <div className="flex items-center gap-2 text-sm text-orange-600">
            <MapPin className="h-4 w-4" />
            <span>Archivado</span>
          </div>
        </Card>
      )}
    </div>
  );
}