'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  OnChangeFn,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { Loader2, Settings2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  onSortingChange?: (sorting: SortingState) => void;
  sorting?: SortingState;
  className?: string;
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
  showColumnToggle?: boolean;
  emptyMessage?: string;
  getRowClassName?: (row: any) => string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  onSortingChange,
  sorting = [],
  className,
  columnVisibility,
  onColumnVisibilityChange,
  showColumnToggle = true,
  emptyMessage = 'No hay resultados.',
  getRowClassName,
}: DataTableProps<TData, TValue>) {
  const [internalSorting, setInternalSorting] = useState<SortingState>(sorting);
  const [internalVisibility, setInternalVisibility] = useState<
    VisibilityState | undefined
  >(undefined);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: (updaterOrValue) => {
      const value =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(onSortingChange ? sorting : internalSorting)
          : updaterOrValue;
      if (onSortingChange) {
        onSortingChange(value);
      } else {
        setInternalSorting(value);
      }
    },
    onColumnVisibilityChange: (updaterOrValue) => {
      const current = onColumnVisibilityChange
        ? columnVisibility ?? {}
        : internalVisibility ?? {};
      const value =
        typeof updaterOrValue === 'function'
          ? (updaterOrValue as (old: VisibilityState) => VisibilityState)(
              current,
            )
          : updaterOrValue;
      if (onColumnVisibilityChange) {
        onColumnVisibilityChange(value as VisibilityState);
      } else {
        setInternalVisibility(value as VisibilityState);
      }
    },
    state: {
      sorting: onSortingChange ? sorting : internalSorting,
      columnVisibility: onColumnVisibilityChange
        ? columnVisibility
        : internalVisibility,
    },
    manualSorting: !!onSortingChange,
  });

  useEffect(() => {
    if (onSortingChange) {
      setInternalSorting(sorting);
    }
  }, [sorting, onSortingChange]);

  useEffect(() => {
    if (onColumnVisibilityChange) {
      setInternalVisibility(columnVisibility);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnVisibility, onColumnVisibilityChange]);

  return (
    <Card className={className}>
      <CardContent className="p-0">
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          <Table>
            <TableHeader className="bg-muted/30">
              {table.getHeaderGroups().map((headerGroup, index) => (
                <TableRow key={headerGroup.id} className="">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                  {index === 0 && showColumnToggle && (
                    <TableHead className="w-[50px] ">
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Settings2 className="h-4 w-4" />
                              <span className="sr-only">
                                Mostrar/ocultar columnas
                              </span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-[200px]"
                          >
                            <div className="px-2 py-1.5 text-sm font-semibold">
                              Mostrar columnas
                            </div>
                            {table
                              .getAllColumns()
                              .filter((column) => column.getCanHide())
                              .map((column) => {
                                const columnDef = column.columnDef as ColumnDef<
                                  TData,
                                  TValue
                                >;
                                const header = columnDef.header;

                                let headerText = column.id;
                                if (typeof header === 'string') {
                                  headerText = header;
                                } else if (typeof header === 'function') {
                                  headerText = column.id;
                                }

                                return (
                                  <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) =>
                                      column.toggleVisibility(!!value)
                                    }
                                  >
                                    {headerText}
                                  </DropdownMenuCheckboxItem>
                                );
                              })}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableHead>
                  )}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={`hover:bg-muted/50 transition-colors ${
                      getRowClassName ? getRowClassName(row) : ''
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                    {showColumnToggle && <TableCell className="w-[50px]" />}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (showColumnToggle ? 1 : 0)}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
