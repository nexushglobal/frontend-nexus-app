'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { PAYMENT_CACHE_TAGS } from '../constants/payments.constants';

export async function revalidateUserPayments() {
  revalidateTag(PAYMENT_CACHE_TAGS.USER_PAYMENTS);
  revalidatePath('/dashboard/cli-mis-pagos');
}

export async function revalidatePaymentDetail(paymentId: string) {
  if (!paymentId?.trim()) {
    throw new Error('Payment ID is required');
  }

  revalidateTag(`${PAYMENT_CACHE_TAGS.PAYMENT_DETAIL}-${paymentId}`);
  revalidatePath(`/dashboard/cli-mis-pagos/detalle/${paymentId}`);
}

export async function revalidateAdminPayments() {
  revalidateTag(PAYMENT_CACHE_TAGS.ADMIN_PAYMENTS);
  revalidatePath('/dashboard/fac-pagos');
}

export async function revalidateAdminPaymentDetail(paymentId: string) {
  if (!paymentId?.trim()) {
    throw new Error('Payment ID is required');
  }

  revalidateTag(`${PAYMENT_CACHE_TAGS.ADMIN_PAYMENT_DETAIL}-${paymentId}`);
  revalidatePath(`/dashboard/fac-pagos/detalle/${paymentId}`);
}
