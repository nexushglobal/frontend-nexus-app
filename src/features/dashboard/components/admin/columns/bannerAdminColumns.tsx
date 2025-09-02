'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { getStatusConfig } from '@/features/shared/utils/status.utils';
import { formatTableDate } from '@/features/shared/utils/table.utils';
import { BannerStatus } from '@/features/dashboard/types/enums-banner';
import { ColumnDef, VisibilityState } from '@tanstack/react-table';
import { Calendar, Edit, ExternalLink, Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';
import type { Banner } from '../../../types/banner.types';

interface CreateBannerAdminColumnsProps {
  onEditBanner: (bannerId: string) => void;
  onToggleStatus: (bannerId: string, currentStatus: boolean) => void;
  isToggling: boolean;
}

export function createBannerAdminColumns({
  onEditBanner,
  onToggleStatus,
  isToggling,
}: CreateBannerAdminColumnsProps): ColumnDef<Banner>[] {
  return [
    {
      accessorKey: 'imageUrl',
      header: 'Imagen',
      cell: ({ row }) => {
        const imageUrl = row.getValue('imageUrl') as string;
        const title = row.original.title;
        return (
          <div className="flex items-center justify-center">
            <div className="relative h-16 w-24 overflow-hidden rounded-md border bg-muted">
              <Image
                src={imageUrl}
                alt={title || 'Banner'}
                fill
                className="object-cover"
              />
            </div>
          </div>
        );
      },
      size: 120,
    },
    {
      accessorKey: 'title',
      header: 'Título',
      cell: ({ row }) => {
        const banner = row.original;
        return (
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
        );
      },
      size: 200,
    },
    {
      accessorKey: 'linkType',
      header: 'Tipo',
      cell: ({ row }) => {
        const banner = row.original;
        if (!banner.link) return null;
        
        return (
          <div className="flex items-center gap-2">
            {banner.linkType === 'EXTERNAL' ? (
              <ExternalLink className="h-4 w-4" />
            ) : (
              <LinkIcon className="h-4 w-4" />
            )}
            <Badge variant="outline">
              {banner.linkType === 'EXTERNAL' ? 'Externo' : 'Interno'}
            </Badge>
          </div>
        );
      },
      size: 120,
    },
    {
      accessorKey: 'isActive',
      header: 'Estado',
      cell: ({ row }) => {
        const banner = row.original;
        const isActive = banner.isActive || false;
        const status: BannerStatus = isActive ? BannerStatus.ACTIVE : BannerStatus.INACTIVE;
        const config = getStatusConfig(status);

        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={isActive}
              onCheckedChange={() => onToggleStatus(banner.id, isActive)}
              disabled={isToggling}
            />
            <Badge variant={config.variant} className={config.className}>
              {config.label}
            </Badge>
          </div>
        );
      },
      size: 150,
    },
    {
      id: 'dates',
      header: 'Fechas',
      cell: ({ row }) => {
        const banner = row.original;
        return (
          <div className="text-sm">
            {banner.startDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span>Inicio: {formatTableDate(banner.startDate.toString()).date}</span>
              </div>
            )}
            {banner.endDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span>Fin: {formatTableDate(banner.endDate.toString()).date}</span>
              </div>
            )}
          </div>
        );
      },
      size: 150,
    },
    {
      accessorKey: 'createdAt',
      header: 'Creado',
      cell: ({ row }) => {
        const dateString = row.getValue('createdAt') as string;
        const { date, time } = formatTableDate(dateString);
        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{date}</span>
              <span className="text-xs text-muted-foreground">{time}</span>
            </div>
          </div>
        );
      },
      size: 120,
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const banner = row.original;
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditBanner(banner.id)}
            className="h-8 px-2"
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Editar banner</span>
          </Button>
        );
      },
      size: 80,
    },
  ];
}

// Configuración por defecto de columnas visibles
export const defaultColumnVisibility: VisibilityState = {
  imageUrl: true,
  title: true,
  linkType: true,
  isActive: true,
  dates: true,
  createdAt: true,
  actions: true,
};