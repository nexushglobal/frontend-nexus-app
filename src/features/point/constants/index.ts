export const TRANSACTION_TYPES = {
  BINARY_COMMISSION: 'Comisión Binaria',
  DIRECT_BONUS: 'Bono Directo',
  WITHDRAWAL: 'Retiro',
} as const;

export const TRANSACTION_STATUS = {
  PENDING: 'Pendiente',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
  FAILED: 'Fallido',
} as const;

export const TRANSACTION_TYPE_OPTIONS = Object.entries(TRANSACTION_TYPES).map(
  ([key, value]) => ({
    value: key,
    label: value,
  }),
);

export const TRANSACTION_STATUS_OPTIONS = Object.entries(
  TRANSACTION_STATUS,
).map(([key, value]) => ({
  value: key,
  label: value,
}));
