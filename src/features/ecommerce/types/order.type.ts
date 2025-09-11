import { BasePaymentRequest } from '@/features/membership/types/membership-detail.type';
import { ApiPaginationMeta } from '@/features/shared/types/api.types';

export interface Client {
  userId: string;
  userEmail: string;
  userName: string;
}

export interface Producto {
  SKU: string;
  Nombre: string;
  Cantidad: number;
  Precio: number;
}

export interface OrderBase extends Client {
  id: number;
  totalItems: number;
  totalAmount: number;
  status:
    | 'PENDING'
    | 'APPROVED'
    | 'SENT'
    | 'DELIVERED'
    | 'REJECTED'
    | 'CANCELED';

  createdAt: Date;
  updatedAt: Date;
}
export interface OrderAdminItem extends OrderBase {
  metadata: Metadata;
}
export interface OrderClientItem extends OrderBase {
  metadata: Metadata;
}

export interface OrderDetails {
  id: string;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
}
export interface OrderHistory extends Client {
  id: string;
  action:
    | 'CREADO'
    | 'APROBADO'
    | 'ENVIADO'
    | 'ENTREGADO'
    | 'RECHAZADO'
    | 'CANCELADO';
  notes: string;
  createdAt: Date;
  changes: Record<string, any> | null;
  metadata: Record<string, any> | null;
}
export interface OrderAdminDetailResponse extends OrderBase {
  orderDetails: OrderDetails[];
  orderHistory: OrderHistory[];
}

export interface Metadata {
  Productos: Producto[];
}

export interface OrderAdminResponse {
  pagination: ApiPaginationMeta;
  items: OrderAdminItem[];
}

export interface OrderClientResponse {
  pagination: ApiPaginationMeta;
  items: OrderClientItem[];
}

export interface OrderClientDetailResponse extends OrderBase {
  orderDetails: OrderDetails[];
  orderHistory: OrderHistory[];
}

export interface OrderItem {
  productId: number;
  quantity: number;
}
export interface PaymentOrderRequest extends BasePaymentRequest {
  notes?: string;
  paymentReference?: string;
  totalAmount: number;
  items: OrderItem[];
}

export interface OrderResult {
  totalAmount: number;
  paymentId: number;
  order: {
    totalItems: number;
    items: {
      productId: number;
      name: string;
      quantity: number;
    }[];
  };
}
