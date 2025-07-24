export enum SaleStatus {
  // Estados de Reserva
  RESERVATION_PENDING = "RESERVATION_PENDING", // Reserva registrada, sin pago
  RESERVATION_PENDING_APPROVAL = "RESERVATION_PENDING_APPROVAL", // Pago de reserva pendiente de aprobación (reserva)
  RESERVED = "RESERVED", // Reserva completada y aprobada

  // Estados de Venta
  PENDING = "PENDING", // Venta pendiente de procesamiento
  PENDING_APPROVAL = "PENDING_APPROVAL", // Venta pendiente de aprobación
  APPROVED = "APPROVED", // Venta aprobada
  IN_PAYMENT_PROCESS = "IN_PAYMENT_PROCESS", // En proceso de pago
  COMPLETED = "COMPLETED", // Venta completada
  REJECTED = "REJECTED", // Rechazada (incluye reservas rechazadas/expiradas)
  WITHDRAWN = "WITHDRAWN", // Retirada (incluye reservas anuladas)
}

export enum CurrencyType {
  USD = "USD",
  PEN = "PEN",
}

export enum SaleType {
  FINANCED = "FINANCED",
  DIRECT_PAYMENT = "DIRECT_PAYMENT",
}

export enum DocumentType {
  DNI = "DNI",
  CE = "CE",
  RUC = "RUC",
}

export enum StatusPayment {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export enum LotTransactionRole {
  BUYER = 'Comprador',
  SELLER = 'Vendedor',
}
