'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/features/shared/components/common/PageHeader';
import { TablePagination } from '@/features/shared/components/table/TablePagination';
import { AlertCircle, ArrowUpDown, Loader2, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useBanners } from '../../hooks/useBanners';
import { Banner } from '../../types/banner.types';
import { BannerAdminCards } from '../admin/BannerAdminCards';
import { BannerAdminTable } from '../admin/BannerAdminTable';
import { CreateBannerModal } from '../modals/CreateBannerModal';
import { EditBannerModal } from '../modals/EditBannerModal';
import { ReorderBannersModal } from '../modals/ReorderBannersModal';

export default function BannerAdminPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [reorderModalOpen, setReorderModalOpen] = useState(false);
  const [selectedBannerId, setSelectedBannerId] = useState<string | null>(null);
  const [selectedBannerData, setSelectedBannerData] = useState<
    Banner | undefined
  >(undefined);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const queryParams = useMemo(
    () => ({
      page,
      limit,
    }),
    [page, limit],
  );

  const { data, isLoading, error, isError } = useBanners(queryParams);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleEditBanner = (bannerId: string) => {
    const bannerData = data?.items.find((banner) => banner.id === bannerId);
    setSelectedBannerId(bannerId);
    setSelectedBannerData(bannerData);
    setEditModalOpen(true);
  };

  if (isError) {
    return (
      <div className="container">
        <PageHeader
          title="Gestión de Banners"
          subtitle="Administra los banners promocionales de la plataforma"
          className="mb-6"
          variant="gradient"
        />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar los banners: {error?.message || 'Error desconocido'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container">
      <PageHeader
        title="Gestión de Banners"
        subtitle="Administra los banners promocionales de la plataforma"
        className="mb-6"
        variant="gradient"
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReorderModalOpen(true)}
              className="hidden sm:flex"
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Ordenar
            </Button>
            <Button size="sm" onClick={() => setCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Banner
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        {isLoading && !data && (
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
        )}

        {data && (
          <>
            <div className="hidden md:block">
              <BannerAdminTable
                data={data.items}
                onEditBanner={handleEditBanner}
              />
            </div>

            <div className="md:hidden">
              <BannerAdminCards
                data={data.items}
                onEditBanner={handleEditBanner}
              />
            </div>

            <Card className="shadow-sm p-1">
              <CardContent>
                <TablePagination
                  pagination={data.pagination}
                  onPageChange={handlePageChange}
                  onLimitChange={handleLimitChange}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <CreateBannerModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      <EditBannerModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedBannerId(null);
          setSelectedBannerData(undefined);
        }}
        bannerId={selectedBannerId}
        bannerData={selectedBannerData}
      />

      <ReorderBannersModal
        isOpen={reorderModalOpen}
        onClose={() => setReorderModalOpen(false)}
      />
    </div>
  );
}
