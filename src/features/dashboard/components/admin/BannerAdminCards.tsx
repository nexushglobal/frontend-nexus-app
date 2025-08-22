'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Edit, ExternalLink, Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import { useToggleBannerStatus } from '../../hooks/useBanners';
import { Banner } from '../../types/banner.types';

interface BannerAdminCardsProps {
  data: Banner[];
  onEditBanner: (bannerId: string) => void;
}

export function BannerAdminCards({
  data,
  onEditBanner,
}: BannerAdminCardsProps) {
  const [optimisticUpdates, setOptimisticUpdates] = useState<
    Record<string, boolean>
  >({});
  const toggleStatusMutation = useToggleBannerStatus();

  const handleToggleStatus = async (
    bannerId: string,
    currentStatus: boolean,
  ) => {
    try {
      // Optimistic update
      setOptimisticUpdates((prev) => ({ ...prev, [bannerId]: !currentStatus }));

      await toggleStatusMutation.mutateAsync({
        id: bannerId,
        isActive: !currentStatus,
      });

      toast.success(
        `Banner ${!currentStatus ? 'activado' : 'desactivado'} exitosamente`,
      );
    } catch {
      // Revert optimistic update
      setOptimisticUpdates((prev) => {
        const newState = { ...prev };
        delete newState[bannerId];
        return newState;
      });

      toast.error('Error al cambiar el estado del banner');
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (data.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-muted-foreground">No se encontraron banners</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {data.map((banner) => {
        const actualStatus = optimisticUpdates[banner.id] ?? banner.isActive;

        return (
          <Card key={banner.id} className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                  <Image
                    src={banner.imageUrl}
                    alt={banner.title || 'Banner'}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">
                        {banner.title || 'Sin título'}
                      </h3>
                      {banner.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {banner.description}
                        </p>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditBanner(banner.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {banner.link && (
                      <div className="flex items-center gap-1">
                        {banner.linkType === 'EXTERNAL' ? (
                          <ExternalLink className="h-3 w-3" />
                        ) : (
                          <LinkIcon className="h-3 w-3" />
                        )}
                        <Badge variant="outline" className="text-xs">
                          {banner.linkType === 'EXTERNAL'
                            ? 'Externo'
                            : 'Interno'}
                        </Badge>
                      </div>
                    )}

                    <Badge
                      variant={actualStatus ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {actualStatus ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      {banner.startDate && (
                        <div>Inicio: {formatDate(banner.startDate)}</div>
                      )}
                      {banner.endDate && (
                        <div>Fin: {formatDate(banner.endDate)}</div>
                      )}
                      <div>Creado: {formatDate(banner.createdAt)}</div>
                    </div>

                    <Switch
                      checked={actualStatus}
                      onCheckedChange={() =>
                        handleToggleStatus(banner.id, banner.isActive || false)
                      }
                      disabled={toggleStatusMutation.isPending}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
