'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/features/shared/components/common/PageHeader';
import { TablePagination } from '@/features/shared/components/table/TablePagination';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useComplaints } from '../../hooks/useComplaintsQuery';
import { useComplaintFiltersStore } from '../../stores/complaint-filters.store';
import { Complaint } from '../../types/complaint.types';
import { ComplaintAdminCards } from '../admin/ComplaintAdminCards';
import { ComplaintAdminFilters } from '../admin/ComplaintAdminFilters';
import { ComplaintsAdminTable } from '../admin/ComplaintsAdminTable';
import { AttendComplaintModal } from '../admin/modals/AttendComplaintModal';

export function ComplaintAdminPage() {
  const { filters, setFilter, setFilters } = useComplaintFiltersStore();
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryParams = useMemo(() => {
    const params: any = {
      page: filters.page || 1,
      limit: filters.limit || 20,
    };

    if (filters.attended !== undefined) params.attended = filters.attended;
    if (filters.startDate) params.startDate = filters.startDate;

    return params;
  }, [filters]);

  const { data, isLoading, error, isError } = useComplaints(queryParams);

  const handlePageChange = (page: number) => {
    setFilter('page', page);
  };

  const handleLimitChange = (limit: number) => {
    setFilters({ limit, page: 1 });
  };

  const handleAttendComplaint = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedComplaint(null);
  };

  if (isError) {
    return (
      <div className="container">
        <PageHeader
          title="Libro de Reclamaciones"
          subtitle="Gestiona y revisa las quejas y reclamos de los usuarios"
          className="mb-6"
          variant="gradient"
        />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar las quejas y reclamos: {error?.message || 'Error desconocido'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <div className="container">
        <PageHeader
          title="Libro de Reclamaciones"
          subtitle="Gestiona y revisa las quejas y reclamos de los usuarios"
          className="mb-6"
          variant="gradient"
        />

        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardContent>
              <ComplaintAdminFilters isLoading={isLoading} />
            </CardContent>
          </Card>

          {isLoading && !data && (
            <Card className="shadow-sm">
              <CardContent className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="text-muted-foreground">Cargando quejas y reclamos...</span>
                </div>
              </CardContent>
            </Card>
          )}

          {data && (
            <>
              <div className="hidden md:block">
                <ComplaintsAdminTable
                  data={data.items}
                  isLoading={isLoading}
                  onAttendComplaint={handleAttendComplaint}
                />
              </div>

              <div className="md:hidden">
                <ComplaintAdminCards
                  data={data.items}
                  onAttendComplaint={handleAttendComplaint}
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
      </div>

      <AttendComplaintModal
        complaint={selectedComplaint}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}