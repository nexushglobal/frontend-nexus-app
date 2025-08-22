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
    <div className="space-y-6">
      {/* Personal Information */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-info/10 border border-info/20">
              <User className="h-4 w-4 text-info" />
            </div>
            Información Personal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  Nombre
                </label>
                <p className="text-base font-semibold text-foreground">
                  {withdrawal.user.personalInfo.firstName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  Apellido
                </label>
                <p className="text-base font-semibold text-foreground">
                  {withdrawal.user.personalInfo.lastName}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  Email
                </label>
                <p className="text-base text-foreground">
                  {withdrawal.user.email}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  ID de Usuario
                </label>
                <p className="text-base text-foreground font-mono bg-muted/30 px-3 py-2 rounded">
                  {withdrawal.user.id}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bank Information */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10 border border-secondary/20">
              <CreditCard className="h-4 w-4 text-secondary" />
            </div>
            Información Bancaria Registrada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  Banco (del usuario)
                </label>
                <p className="text-base font-semibold text-foreground">
                  {withdrawal.user.bankInfo.bankName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  Número de Cuenta (del usuario)
                </label>
                <p className="text-base text-foreground font-mono bg-muted/30 px-3 py-2 rounded">
                  {withdrawal.user.bankInfo.accountNumber}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  CCI (del usuario)
                </label>
                <p className="text-base text-foreground font-mono bg-muted/30 px-3 py-2 rounded">
                  {withdrawal.user.bankInfo.cci}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawal Bank Information */}
      <Card className="border shadow-sm bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
            Información Bancaria del Retiro
            <span className="text-sm font-normal text-muted-foreground">
              (Información utilizada para este retiro específico)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  Banco
                </label>
                <p className="text-base font-semibold text-foreground">
                  {withdrawal.bankName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  Número de Cuenta
                </label>
                <p className="text-base text-foreground font-mono bg-background px-3 py-2 rounded border">
                  {withdrawal.accountNumber}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  CCI
                </label>
                <p className="text-base text-foreground font-mono bg-background px-3 py-2 rounded border">
                  {withdrawal.cci}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviewed By Information */}
      {withdrawal.reviewedBy && (
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 border border-accent/20">
                <Building2 className="h-4 w-4 text-accent" />
              </div>
              Información del Revisor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  ID del Revisor
                </label>
                <p className="text-base text-foreground font-mono bg-muted/30 px-3 py-2 rounded">
                  {withdrawal.reviewedBy.id}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  Email del Revisor
                </label>
                <p className="text-base text-foreground">
                  {withdrawal.reviewedBy.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Information */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10 border border-warning/20">
              <MapPin className="h-4 w-4 text-warning" />
            </div>
            Estado del Retiro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-1">
                ¿Está archivado?
              </label>
              <p className="text-base text-foreground">
                {withdrawal.isArchived ? 'Sí' : 'No'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-1">
                ID del Retiro
              </label>
              <p className="text-base text-foreground font-mono bg-muted/30 px-3 py-2 rounded">
                #{withdrawal.id}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}