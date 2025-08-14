'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface MembershipKeyValueModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  data: Record<string, any> | null;
}

export function MembershipKeyValueModal({
  open,
  onOpenChange,
  title,
  data,
}: MembershipKeyValueModalProps) {
  const entries = data ? Object.entries(data) : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {entries.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="w-1/3">Clave</TableHead>
                  <TableHead>Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell className="font-medium align-top">
                      {key}
                    </TableCell>
                    <TableCell className="text-muted-foreground whitespace-pre-wrap break-words">
                      {typeof value === 'object' && value !== null
                        ? JSON.stringify(value, null, 2)
                        : String(value)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">Sin datos</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
