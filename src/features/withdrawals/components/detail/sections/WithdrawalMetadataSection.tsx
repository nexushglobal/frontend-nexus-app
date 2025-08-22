import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  FileText,
  Hash,
  Database,
  Code,
} from 'lucide-react';
import { WithdrawalDetail } from '../../../types/withdrawals.types';

interface WithdrawalMetadataSectionProps {
  withdrawal: WithdrawalDetail;
}

export function WithdrawalMetadataSection({ withdrawal }: WithdrawalMetadataSectionProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatValue = (value: any): string => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'boolean') return value.toString();
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    if (typeof value === 'string' && value.includes('T') && value.includes('Z')) {
      // Try to format as date
      try {
        return formatDate(value);
      } catch {
        return value;
      }
    }
    return String(value);
  };

  return (
    <div className="space-y-6">
      {/* Main Withdrawal Metadata */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            Metadata del Retiro Principal
          </CardTitle>
        </CardHeader>
        <CardContent>
          {withdrawal.metadata && Object.keys(withdrawal.metadata).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(withdrawal.metadata).map(([key, value]) => (
                <div key={key} className="p-3 bg-muted/20 rounded-lg border">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <label className="text-sm font-medium text-muted-foreground block mb-1">
                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </label>
                      <div className="text-sm text-foreground font-mono bg-background px-3 py-2 rounded border break-all">
                        {formatValue(value)}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {typeof value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted/50 border-2 border-muted/80 mx-auto mb-3">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                No hay metadata disponible para este retiro
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Withdrawal Points Metadata */}
      {withdrawal.withdrawalPoints && withdrawal.withdrawalPoints.length > 0 && (
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-info/10 border border-info/20">
                <Database className="h-4 w-4 text-info" />
              </div>
              Metadata de Puntos Utilizados
              <span className="text-sm font-normal text-muted-foreground">
                ({withdrawal.withdrawalPoints.length} {withdrawal.withdrawalPoints.length === 1 ? 'punto' : 'puntos'})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {withdrawal.withdrawalPoints.map((point, index) => (
                <div key={point.id}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-secondary/10 border border-secondary/20">
                      <Hash className="h-3 w-3 text-secondary" />
                    </div>
                    <h3 className="text-lg font-semibold">
                      Punto #{point.id}
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      ({point.amountUsed.toLocaleString()} puntos utilizados)
                    </span>
                  </div>

                  {point.metadata && Object.keys(point.metadata).length > 0 ? (
                    <div className="space-y-3 pl-9">
                      {Object.entries(point.metadata).map(([key, value]) => (
                        <div key={key} className="p-3 bg-muted/10 rounded-lg border border-muted/30">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                              <label className="text-xs font-medium text-muted-foreground block mb-1">
                                {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </label>
                              <div className="text-sm text-foreground font-mono bg-background px-2 py-1 rounded border break-all">
                                {formatValue(value)}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {typeof value}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 pl-9">
                      <p className="text-sm text-muted-foreground">
                        No hay metadata disponible para este punto
                      </p>
                    </div>
                  )}

                  {index < withdrawal.withdrawalPoints.length - 1 && (
                    <Separator className="my-6" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Technical Information */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 border border-accent/20">
              <Code className="h-4 w-4 text-accent" />
            </div>
            Información Técnica del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  ID del Retiro
                </label>
                <p className="text-base font-mono bg-muted/30 px-3 py-2 rounded">
                  {withdrawal.id}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  Fecha de Creación (UTC)
                </label>
                <p className="text-sm font-mono bg-muted/30 px-3 py-2 rounded">
                  {withdrawal.createdAt}
                </p>
              </div>
              {withdrawal.reviewedAt && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1">
                    Fecha de Revisión (UTC)
                  </label>
                  <p className="text-sm font-mono bg-muted/30 px-3 py-2 rounded">
                    {withdrawal.reviewedAt}
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  Estado Archivado
                </label>
                <p className="text-base">
                  {withdrawal.isArchived ? 'true' : 'false'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  ID del Usuario
                </label>
                <p className="text-sm font-mono bg-muted/30 px-3 py-2 rounded">
                  {withdrawal.user.id}
                </p>
              </div>
              {withdrawal.reviewedBy && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1">
                    ID del Revisor
                  </label>
                  <p className="text-sm font-mono bg-muted/30 px-3 py-2 rounded">
                    {withdrawal.reviewedBy.id}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}