'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/features/shared/components/common/PageHeader';
import { useBanners } from '../../hooks/useBanners';
import { useBannerFiltersStore } from '../../stores/banner-filters.store';
import { BannersTable } from '../admin/BannersTable';
import { BannersFilters } from '../admin/BannersFilters';
import { BannerCreateModal } from '../admin/BannerCreateModal';
import { BannerEditModal } from '../admin/BannerEditModal';
import { BannersTableSkeleton } from '../skeletons/BannersTableSkeleton';
import type { Banner } from '../../types/banner.types';

export function BannersAdminPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  
  // Get filters from store
  const { isActive, linkType, search } = useBannerFiltersStore();
  
  // Fetch banners with filters
  const {
    data: bannersData,
    isLoading,
    isError,
    error,
    refetch,
  } = useBanners({
    page: 1, // Could be managed by pagination state
    limit: 20,
    // Add filters to query when API supports them
    ...(isActive !== undefined && { isActive }),
    ...(linkType && { linkType }),
    ...(search && { search }),
  });

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    refetch(); // Refetch to show updated data
  };

  const handleEditSuccess = () => {
    setEditingBanner(null);
    refetch(); // Refetch to show updated data
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
  };

  const handleCloseEditModal = () => {
    setEditingBanner(null);
  };

  if (isError) {
    return (
      <div className="container mx-auto py-6">
        <PageHeader
          title="Banner Management"
          description="Manage website banners and promotional content"
        />
        <div className="mt-6 flex flex-col items-center justify-center py-12">
          <p className="text-destructive mb-4">
            {error instanceof Error ? error.message : 'Failed to load banners'}
          </p>
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Banner Management"
        description="Manage website banners and promotional content"
        action={
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Banner
          </Button>
        }
      />

      <div className="mt-6 space-y-6">
        {/* Filters */}
        <BannersFilters />

        {/* Table */}
        {isLoading ? (
          <BannersTableSkeleton />
        ) : (
          <BannersTable
            banners={bannersData?.items || []}
            pagination={bannersData?.pagination}
            onEdit={handleEdit}
          />
        )}
      </div>

      {/* Create Modal */}
      <BannerCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Edit Modal */}
      {editingBanner && (
        <BannerEditModal
          banner={editingBanner}
          isOpen={true}
          onClose={handleCloseEditModal}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}