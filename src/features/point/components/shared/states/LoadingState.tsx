'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = 'Cargando...',
  className = 'py-12',
}: LoadingStateProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className={`flex items-center justify-center ${className}`}>
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-muted-foreground">{message}</span>
        </div>
      </CardContent>
    </Card>
  );
}
