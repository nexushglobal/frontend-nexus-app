'use server';

import { api } from '@/features/shared/services/api';
import { BillingInfoRequest } from '../types/requests-profile.types';

export async function updateBillingInfoAction(updateData: BillingInfoRequest) {
  try {
    await api.put('/api/user/profile/billing-info', JSON.stringify(updateData));

    return {
      success: true,
      message: 'Información de facturación actualizada exitosamente',
    };
  } catch (error) {
    console.error('Error updating billing info:', error);
    return {
      success: false,
      message: 'Error al actualizar información de facturación',
      errors: error,
    };
  }
}
