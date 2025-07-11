export function formatCurrency(
  amount: number,
  currency: string = "PEN"
): string {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: currency,
  }).format(amount);
}
