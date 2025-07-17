"use server";
import { api } from "@/features/shared/services/api";
import {
  ApprovePaymentRequest,
  CompletePaymentRequest,
  PaymentApprovalResponse,
  PaymentCompleteResponse,
  PaymentRejectionResponse,
  RejectPaymentRequest,
} from "../types/approval.type";
import { revalidateAdminPaymentDetail } from "./revalidate-payments";

export async function approvePayment(
  paymentId: string,
  data: ApprovePaymentRequest
) {
  try {
    const response = await api.post<PaymentApprovalResponse>(
      `/api/admin/payments/approval/${paymentId}/approve`,
      data
    );
    revalidateAdminPaymentDetail(paymentId);
    return {
      data: response,
      success: true,
      message: "Pago aprobado exitosamente",
    };
  } catch (error) {
    return {
      data: null,
      success: false,
      message: "Error al aprobar el pago",
    };
  }
}

export async function rejectPayment(
  paymentId: string,
  data: RejectPaymentRequest
) {
  try {
    const response = await api.post<PaymentRejectionResponse>(
      `/api/admin/payments/approval/${paymentId}/reject`,
      data
    );
    revalidateAdminPaymentDetail(paymentId);
    return {
      data: response,
      success: true,
      message: "Pago rechazado exitosamente",
    };
  } catch (error) {
    return {
      data: null,
      success: false,
      message: "Error al rechazar el pago",
    };
  }
}

export async function completePayment(
  paymentId: string,
  data: CompletePaymentRequest
) {
  try {
    const response = await api.put<PaymentCompleteResponse>(
      `/api/admin/payments/approval/${paymentId}/complete`,
      data
    );
    revalidateAdminPaymentDetail(paymentId);
    return {
      data: response,
      success: true,
      message: "Pago completado exitosamente",
    };
  } catch (error) {
    return {
      data: null,
      success: false,
      message: "Error al completar el pago",
    };
  }
}
