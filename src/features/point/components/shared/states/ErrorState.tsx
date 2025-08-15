'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: Error | null;
  className?: string;
}

export function ErrorState({
  title = 'Error al cargar los datos',
  message,
  error,
  className = '',
}: ErrorStateProps) {
  const errorMessage = message || error?.message || 'Error desconocido';

  return (
    <Alert variant="destructive" className={className}>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        {title}: {errorMessage}
      </AlertDescription>
    </Alert>
  );
}
