'use client';

import { DataTable } from '@/features/shared/components/table/DataTable';
import { VisibilityState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { Complaint } from '../../types/complaint.types';
import { createComplaintAdminColumns, defaultColumnVisibility } from './columns/complaintAdminColumns';

interface ComplaintsAdminTableProps {
  data: Complaint[];
  isLoading?: boolean;
  onAttendComplaint: (complaint: Complaint) => void;
}

export function ComplaintsAdminTable({
  data,
  isLoading,
  onAttendComplaint,
}: ComplaintsAdminTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(defaultColumnVisibility);

  const columns = useMemo(
    () =>
      createComplaintAdminColumns({
        onAttendComplaint,
      }),
    [onAttendComplaint]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={setColumnVisibility}
    />
  );
}