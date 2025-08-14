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

export const PAYMENT_METHODS = {
  VOUCHER: 'Voucher',
  POINTS: 'Puntos',
  PAYMENT_GATEWAY: 'Pasarela de Pago',
} as const;

export const PAYMENT_METHOD_OPTIONS = Object.entries(PAYMENT_METHODS).map(
  ([key, value]) => ({
    value: key,
    label: value,
  }),
);

// Transacciones de Lote
export const LOT_TRANSACTION_TYPES = {
  LOT_BINARY_COMMISSION: 'Comisión Binaria de Lote',
  LOT_DIRECT_BONUS: 'Bono Directo de Lote',
  LOT_WITHDRAWAL: 'Retiro de Lote',
} as const;

export const LOT_TRANSACTION_TYPE_OPTIONS = Object.entries(
  LOT_TRANSACTION_TYPES,
).map(([key, value]) => ({
  value: key,
  label: value,
}));

// Volúmenes Semanales
export const VOLUME_SITE = {
  LEFT: 'Izquierda',
  RIGHT: 'Derecha',
} as const;

export const VOLUME_STATUS = {
  PENDING: 'Pendiente',
  PROCESSED: 'Procesado',
  CANCELLED: 'Cancelado',
} as const;

export const VOLUME_STATUS_OPTIONS = Object.entries(VOLUME_STATUS).map(
  ([key, value]) => ({
    value: key,
    label: value,
  }),
);
