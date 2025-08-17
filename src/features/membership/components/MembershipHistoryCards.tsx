'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/features/shared/utils/formatCurrency';
import { Calendar, FileText, History, StickyNote } from 'lucide-react';
import { MembershipHistoryItem } from '../types/membership.types';
import { translateHistoryAction } from '../utils/membershipTranslations';

export function MembershipHistoryCards({
  items,
  onOpenChanges,
  onOpenMetadata,
}: {
  items: MembershipHistoryItem[];
  onOpenChanges: (changes: Record<string, any>, metadata?: Record<string, any>) => void;
  onOpenMetadata: (data: Record<string, any>) => void;
}) {
  if (!items || items.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          Sin movimientos
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Card key={item.id} className="shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-primary" />
                <div className="font-medium">
                  {translateHistoryAction(item.action)}
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(item.createdAt, 'dd/MM/yyyy HH:mm')}</span>
              </div>
            </div>

            {item.notes && (
              <div className="flex items-start gap-2 text-sm">
                <StickyNote className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground">{item.notes}</span>
              </div>
            )}

            {(item.changes || item.metadata) && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onOpenChanges(item.changes || {}, item.metadata)}
                >
                  <FileText className="h-4 w-4 mr-1" /> Ver Detalles
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
