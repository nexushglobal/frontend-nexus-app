import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";

import {
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_VARIANTS,
  PAYMENT_METHOD_LABELS,
  CURRENCY_FORMAT_OPTIONS,
  DATE_FORMAT,
  TIME_FORMAT,
} from "../constants/payments.constants";
import { PaymentStatus } from "../types/enums-payments";
import { PaymentUserDetailResponse } from "../types/response-payment";

export function formatDate(dateString: string): string {
  return format(new Date(dateString), DATE_FORMAT, { locale: es });
}

export function formatTime(dateString: string): string {
  return format(new Date(dateString), TIME_FORMAT, { locale: es });
}

export function formatDateTime(dateString: string): string {
  return format(new Date(dateString), `${DATE_FORMAT} ${TIME_FORMAT}`, {
    locale: es,
  });
}

export function formatAmount(amount: number): string {
  return new Intl.NumberFormat("es-PE", CURRENCY_FORMAT_OPTIONS).format(amount);
}

// Deprecated: Use getStatusConfig from @/features/shared/utils/status.utils instead
export function getStatusConfig(status: PaymentStatus) {
  const config = PAYMENT_STATUS_VARIANTS[status];
  return {
    ...config,
    label: PAYMENT_STATUS_LABELS[status],
    icon: getStatusIcon(status),
  };
}

export function getStatusIcon(status: PaymentStatus): LucideIcon {
  switch (status) {
    case PaymentStatus.PENDING:
      return Clock;
    case PaymentStatus.APPROVED:
      return CheckCircle;
    case PaymentStatus.REJECTED:
      return XCircle;
    case PaymentStatus.COMPLETED:
      return CheckCircle;
    default:
      return AlertCircle;
  }
}

export function generateTimelineEvents(payment: PaymentUserDetailResponse) {
  const events = [
    {
      id: 1,
      type: "created",
      title: "Pago Creado",
      description: `Pago iniciado con método ${translatePaymentMethod(payment.paymentMethod)}`,
      timestamp: payment.createdAt,
      icon: "Plus",
      status: "completed",
    },
  ];

  if (payment.updatedAt !== payment.createdAt) {
    events.push({
      id: 2,
      type: "updated",
      title: "Información Actualizada",
      description: "Los datos del pago fueron modificados",
      timestamp: payment.updatedAt,
      icon: "Edit",
      status: "completed",
    });
  }

  if (payment.reviewedAt) {
    const reviewTitle =
      payment.status === PaymentStatus.APPROVED
        ? "Pago Aprobado"
        : payment.status === PaymentStatus.REJECTED
        ? "Pago Rechazado"
        : "Pago Revisado";

    events.push({
      id: 3,
      type: "reviewed",
      title: reviewTitle,
      description: `Revisado por ${payment.reviewedByEmail || "Sistema"}`,
      timestamp: payment.reviewedAt,
      icon:
        payment.status === PaymentStatus.APPROVED
          ? "CheckCircle"
          : payment.status === PaymentStatus.REJECTED
          ? "XCircle"
          : "User",
      status:
        payment.status === PaymentStatus.APPROVED
          ? "success"
          : payment.status === PaymentStatus.REJECTED
          ? "error"
          : "info",
    });
  }

  return events.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
}

export function validatePaymentId(id: string): boolean {
  return !!(id && id.trim() && !isNaN(Number(id)) && Number(id) > 0);
}

// Deprecated: Use translatePaymentMethod from @/features/shared/utils/status.utils instead
export function translatePaymentMethod(method: string): string {
  return PAYMENT_METHOD_LABELS[method as keyof typeof PAYMENT_METHOD_LABELS] || method;
}
