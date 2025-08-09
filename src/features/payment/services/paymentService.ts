import { api } from '@/features/shared/services/api';
import type {
  PaymentAdminResponse,
  PaymentUserResponse,
} from '../types/response-payment';

export class PaymentService {
  // Servicios para usuarios
  static async getUserPayments(
    params: Record<string, string | number | boolean | undefined | null>,
  ): Promise<PaymentUserResponse> {
    return api.get<PaymentUserResponse>('/api/user/payments', { params });
  }

  // Servicios para admin
  static async getAdminPayments(
    params: Record<string, string | number | boolean | undefined | null>,
  ): Promise<PaymentAdminResponse> {
    return api.get<PaymentAdminResponse>('/api/admin/payments', { params });
  }
}
