import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/features/shared/components/common/PageHeader';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="container">
      <PageHeader
        title="Gestión de Banners"
        subtitle="Administra los banners promocionales de la plataforma"
        className="mb-6"
        variant="gradient"
      />

      <div className="space-y-6">
        {/* Filters skeleton */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-16"></div>
                <div className="h-9 bg-muted rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-20"></div>
                <div className="h-9 bg-muted rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-9 bg-muted rounded"></div>
              </div>
              <div className="flex items-end">
                <div className="h-9 bg-muted rounded w-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading indicator */}
        <Card className="shadow-sm">
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-muted-foreground">
                Cargando banners...
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}