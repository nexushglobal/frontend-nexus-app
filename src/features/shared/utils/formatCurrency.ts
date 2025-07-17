import { format } from "date-fns";
import { es } from "date-fns/locale";

export function formatCurrency(
  amount: number,
  currency: string = "PEN"
): string {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return format(new Date(dateString), "dd/MM/yyyy", { locale: es });
}
