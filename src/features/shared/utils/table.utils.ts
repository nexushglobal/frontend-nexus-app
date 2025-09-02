import { format } from "date-fns";
import { es } from "date-fns/locale";

// Date formatting utilities
export const DATE_FORMAT = "dd/MM/yyyy" as const;
export const TIME_FORMAT = "HH:mm" as const;
export const DATETIME_FORMAT = `${DATE_FORMAT} ${TIME_FORMAT}` as const;

export function formatDate(dateString: string): string {
  return format(new Date(dateString), DATE_FORMAT, { locale: es });
}

export function formatTime(dateString: string): string {
  return format(new Date(dateString), TIME_FORMAT, { locale: es });
}

export function formatDateTime(dateString: string): string {
  return format(new Date(dateString), DATETIME_FORMAT, { locale: es });
}

// Currency formatting utilities
export const CURRENCY_FORMAT_OPTIONS = {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
} as const;

export function formatAmount(amount: number): string {
  return new Intl.NumberFormat("es-PE", CURRENCY_FORMAT_OPTIONS).format(amount);
}

export function formatCurrency(amount: number, currency: string = 'PEN'): string {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

// ID formatting utilities
export function formatId(id: number, prefix?: string): string {
  const formattedId = `#${id}`;
  return prefix ? `${prefix} ${formattedId}` : formattedId;
}

export function formatSimpleId(id: number): string {
  return `#${id}`;
}

export function formatPaymentId(id: number): string {
  return formatId(id, 'Pago');
}

export function formatWithdrawalId(id: number): string {
  return formatSimpleId(id);
}

export function formatOrderId(id: number): string {
  return formatId(id, 'Pedido');
}

// Generic table formatting utilities
export function formatTableDate(dateString: string): {
  date: string;
  time: string;
} {
  return {
    date: formatDate(dateString),
    time: formatTime(dateString)
  };
}

export function formatTableAmount(amount: number): {
  formatted: string;
  currency: string;
} {
  return {
    formatted: formatAmount(amount),
    currency: 'PEN'
  };
}