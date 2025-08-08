'use client';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({
  message = 'Cargando producto...',
}: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

interface ErrorStateProps {
  error?: string;
}

export function ErrorState({
  error = 'Producto no encontrado',
}: ErrorStateProps) {
  return (
    <div className="text-center py-12">
      <p className="text-destructive mb-4">{error}</p>
    </div>
  );
}
