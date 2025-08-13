import { format, isValid, parse } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatCurrency(
  amount: number,
  currency: string = 'PEN',
): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function formatDate(
  dateInput: string | Date | number,
  pattern: string = 'dd/MM/yyyy',
): string {
  if (!dateInput) return '-';

  let date: Date | undefined;

  if (dateInput instanceof Date) {
    date = dateInput;
  } else if (typeof dateInput === 'number') {
    date = new Date(dateInput);
  } else if (typeof dateInput === 'string') {
    // Try native parse first
    let s = dateInput.trim();
    date = new Date(s);

    // Try with 'T' separator if needed
    if (isNaN(date.getTime()) && s.includes(' ')) {
      date = new Date(s.replace(' ', 'T'));
    }

    // Try common patterns if still invalid
    if (isNaN(date.getTime())) {
      const candidates = [
        "yyyy-MM-dd'T'HH:mm:ss.SSSX",
        "yyyy-MM-dd'T'HH:mm:ssXXX",
        "yyyy-MM-dd'T'HH:mm:ssX",
        "yyyy-MM-dd'T'HH:mm:ss",
        'yyyy-MM-dd',
        'dd/MM/yyyy',
        'MM/dd/yyyy',
      ];
      for (const fmt of candidates) {
        const parsed = parse(s, fmt, new Date());
        if (isValid(parsed)) {
          date = parsed;
          break;
        }
      }
    }
  }

  if (!date || isNaN(date.getTime())) return '-';
  return format(date, pattern, { locale: es });
}
