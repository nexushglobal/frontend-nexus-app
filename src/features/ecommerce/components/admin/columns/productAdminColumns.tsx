'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  formatCurrency,
  formatDate,
} from '@/features/shared/utils/formatCurrency';
import { ColumnDef } from '@tanstack/react-table';
import {
  Calendar,
  CheckCircle,
  DollarSign,
  ExternalLink,
  Package,
  Tag,
  XCircle,
} from 'lucide-react';
import type { ProductAdmin } from '../../../types/product.type';

interface CreateAdminColumnsProps {
  onViewDetail: (productId: number) => void;
}

export function createProductAdminColumns({
  onViewDetail,
}: CreateAdminColumnsProps): ColumnDef<ProductAdmin>[] {
  return [
    {
      accessorKey: 'mainImage',
      header: 'Imagen',
      cell: ({ row }) => {
        const mainImage = row.getValue('mainImage') as string;
        const name = row.original.name;
        return (
          <div className="flex items-center justify-center">
            {mainImage ? (
              <img
                src={mainImage}
                alt={name}
                className="h-12 w-12 rounded-lg object-cover border"
              />
            ) : (
              <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center border">
                <Package className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'name',
      header: 'Producto',
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="space-y-1">
            <p className="font-medium text-sm leading-none">{product.name}</p>
            <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
            <div className="flex items-center gap-1">
              <Tag className="h-3 w-3 text-blue-500" />
              <span className="text-xs text-muted-foreground">
                {product.category.name}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      id: 'pricing',
      header: 'Precios',
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-green-500" />
              <span className="text-sm font-medium">
                Socio: {formatCurrency(product.memberPrice)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-orange-500" />
              <span className="text-sm">
                Público: {formatCurrency(product.publicPrice)}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'stock',
      header: 'Stock',
      cell: ({ row }) => {
        const stock = row.getValue('stock') as number;
        const isLowStock = stock <= 10;

        return (
          <div className="flex items-center gap-2">
            <Badge
              variant={
                isLowStock
                  ? 'destructive'
                  : stock <= 20
                  ? 'secondary'
                  : 'default'
              }
              className="font-mono"
            >
              {stock}
            </Badge>
            {isLowStock && (
              <span className="text-xs text-red-500">Stock bajo</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Estado Producto',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const getStatusConfig = (status: string) => {
          switch (status.toLowerCase()) {
            case 'available':
              return {
                label: 'Disponible',
                variant: 'default' as const,
                icon: CheckCircle,
              };
            case 'out_of_stock':
              return {
                label: 'Sin Stock',
                variant: 'destructive' as const,
                icon: XCircle,
              };
            case 'low_stock':
              return {
                label: 'Stock Bajo',
                variant: 'secondary' as const,
                icon: Package,
              };
            default:
              return {
                label: status,
                variant: 'outline' as const,
                icon: Package,
              };
          }
        };

        const config = getStatusConfig(status);
        const IconComponent = config.icon;

        return (
          <div className="flex items-center gap-2">
            <IconComponent className="h-4 w-4" />
            <Badge variant={config.variant}>{config.label}</Badge>
          </div>
        );
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Activo',
      cell: ({ row }) => {
        const isActive = row.getValue('isActive') as boolean;
        return (
          <div className="flex items-center gap-2">
            {isActive ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <Badge variant={isActive ? 'default' : 'secondary'}>
              {isActive ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha de Creación',
      cell: ({ row }) => {
        const date = row.getValue('createdAt') as string;
        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{formatDate(date)}</span>
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const product = row.original;
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetail(product.id)}
            className="h-8 px-2"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="sr-only">Ver detalle</span>
          </Button>
        );
      },
    },
  ];
}

// Configuración por defecto de columnas visibles
export const defaultColumnVisibility = {
  createdAt: false, // Ocultar por defecto
};
