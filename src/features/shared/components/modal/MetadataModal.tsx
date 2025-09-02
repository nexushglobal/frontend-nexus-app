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
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Database } from 'lucide-react';

interface MetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
  metadata: Record<string, any> | undefined;
  title?: string;
}

export function MetadataModal({ 
  isOpen, 
  onClose, 
  metadata, 
  title = "Metadata" 
}: MetadataModalProps) {
  if (!metadata || Object.keys(metadata).length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              {title}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Sin metadata disponible</h3>
            <p className="text-sm text-muted-foreground">
              No hay información adicional para mostrar.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    if (typeof value === 'boolean') {
      return value ? 'Sí' : 'No';
    }
    return String(value);
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">Clave</TableHead>
                <TableHead>Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(metadata).map(([key, value]) => {
                const formattedValue = formatValue(value);
                const isLongValue = formattedValue.length > 50;
                const isObject = typeof value === 'object' && value !== null;

                return (
                  <TableRow key={key}>
                    <TableCell className="font-medium">
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {key}
                      </code>
                    </TableCell>
                    <TableCell>
                      {isObject || isLongValue ? (
                        <ScrollArea className="max-h-32 w-full">
                          <pre className="text-xs bg-muted p-2 rounded whitespace-pre-wrap break-words">
                            {formattedValue}
                          </pre>
                        </ScrollArea>
                      ) : (
                        <span className="text-sm break-words">
                          {formattedValue}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
        
        <div className="flex justify-between items-center pt-4 border-t text-xs text-muted-foreground">
          <span>{Object.keys(metadata).length} propiedades</span>
          <span>Scroll para ver más contenido</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}