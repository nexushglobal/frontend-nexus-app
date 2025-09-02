'use client';

import { DataTable } from '@/features/shared/components/table/DataTable';
import { VisibilityState } from '@tanstack/react-table';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useToggleBannerStatus } from '../../hooks/useBanners';
import { Banner } from '../../types/banner.types';
import {
  createBannerAdminColumns,
  defaultColumnVisibility,
} from './columns/bannerAdminColumns';

interface BannerAdminTableProps {
  data: Banner[];
  onEditBanner: (bannerId: string) => void;
}

export function BannerAdminTable({
  data,
  onEditBanner,
}: BannerAdminTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    defaultColumnVisibility,
  );
  const toggleStatusMutation = useToggleBannerStatus();

  const handleToggleStatus = async (
    bannerId: string,
    currentStatus: boolean,
  ) => {
    try {
      await toggleStatusMutation.mutateAsync({
        id: bannerId,
        isActive: !currentStatus,
      });

      toast.success(
        `Banner ${!currentStatus ? 'activado' : 'desactivado'} exitosamente`,
      );
    } catch {
      toast.error('Error al cambiar el estado del banner');
    }
  };

  const columns = useMemo(
    () =>
      createBannerAdminColumns({
        onEditBanner,
        onToggleStatus: handleToggleStatus,
        isToggling: toggleStatusMutation.isPending,
      }),
    [onEditBanner, toggleStatusMutation.isPending],
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={setColumnVisibility}
      emptyMessage="No se encontraron banners. Cuando agregues banners, aparecerán aquí."
    />
  );
}
