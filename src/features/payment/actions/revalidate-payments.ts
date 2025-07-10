"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { PAYMENT_CACHE_TAGS } from "../constants/payments.constants";

export async function revalidatePayments() {
  revalidateTag(PAYMENT_CACHE_TAGS.USER_PAYMENTS);
  revalidatePath("/dashboard/mis-pagos");
}

export async function revalidatePaymentDetail(paymentId: string) {
  if (!paymentId?.trim()) {
    throw new Error("Payment ID is required");
  }

  revalidateTag(`${PAYMENT_CACHE_TAGS.PAYMENT_DETAIL}-${paymentId}`);
  revalidatePath(`/dashboard/mis-pagos/detalle/${paymentId}`);
}
