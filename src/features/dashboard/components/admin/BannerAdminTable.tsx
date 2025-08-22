'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit, ExternalLink, Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import { useToggleBannerStatus } from '../../hooks/useBanners';
import { Banner } from '../../types/banner.types';

interface BannerAdminTableProps {
  data: Banner[];
  onEditBanner: (bannerId: string) => void;
}

export function BannerAdminTable({
  data,
  onEditBanner,
}: BannerAdminTableProps) {
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
    <Card className="shadow-sm">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Imagen</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fechas</TableHead>
              <TableHead>Creado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((banner) => {
              const actualStatus =
                optimisticUpdates[banner.id] ?? banner.isActive;

              return (
                <TableRow key={banner.id}>
                  <TableCell>
                    <div className="relative h-16 w-24 overflow-hidden rounded-md border bg-muted">
                      <Image
                        src={banner.imageUrl}
                        alt={banner.title || 'Banner'}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {banner.title || 'Sin título'}
                      </p>
                      {banner.description && (
                        <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {banner.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {banner.link && (
                      <div className="flex items-center gap-2">
                        {banner.linkType === 'EXTERNAL' ? (
                          <ExternalLink className="h-4 w-4" />
                        ) : (
                          <LinkIcon className="h-4 w-4" />
                        )}
                        <Badge variant="outline">
                          {banner.linkType === 'EXTERNAL'
                            ? 'Externo'
                            : 'Interno'}
                        </Badge>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={actualStatus}
                        onCheckedChange={() =>
                          handleToggleStatus(
                            banner.id,
                            banner.isActive || false,
                          )
                        }
                        disabled={toggleStatusMutation.isPending}
                      />
                      <Badge variant={actualStatus ? 'default' : 'secondary'}>
                        {actualStatus ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {banner.startDate && (
                        <div>Inicio: {formatDate(banner.startDate)}</div>
                      )}
                      {banner.endDate && (
                        <div>Fin: {formatDate(banner.endDate)}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(banner.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditBanner(banner.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
