import { PaginationMeta } from '@/features/shared/types/api.types';

export interface Producto {
  SKU: string;
  Nombre: string;
  Cantidad: number;
  Precio: number;
}
export interface OrderAdminItem {
  id: number;
  userId: string;
  userEmail: string;
  userName: string;
  totalItems: number;
  totalAmount: number;
  status:
    | 'PENDING'
    | 'APPROVED'
    | 'SENT'
    | 'DELIVERED'
    | 'REJECTED'
    | 'CANCELED';
  metadata: Metadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface Metadata {
  Productos: Producto[];
}

export interface OrderAdminResponse extends PaginationMeta {
  items: OrderAdminItem[];
}
