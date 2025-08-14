export type HistoryAction =
  | 'CREATED'
  | 'RENEWED'
  | 'CANCELLED'
  | 'REACTIVATED'
  | 'EXPIRED'
  | 'STATUS_CHANGED'
  | 'PAYMENT_RECEIVED'
  | 'PLAN_CHANGED'
  | 'RECONSUMPTION_ADDED'
  | 'PURCHASE'
  | 'UPGRADE';

export type MembershipStatus =
  | 'PENDING'
  | 'INACTIVE'
  | 'ACTIVE'
  | 'EXPIRED'
  | 'DELETED'
  | 'SUSPENDED';

const ACTION_LABELS: Record<HistoryAction, string> = {
  CREATED: 'Creada',
  RENEWED: 'Renovada',
  CANCELLED: 'Cancelada',
  REACTIVATED: 'Reactivada',
  EXPIRED: 'Expirada',
  STATUS_CHANGED: 'Estado cambiado',
  PAYMENT_RECEIVED: 'Pago recibido',
  PLAN_CHANGED: 'Plan cambiado',
  RECONSUMPTION_ADDED: 'Reconsumo agregado',
  PURCHASE: 'Compra',
  UPGRADE: 'Actualización',
};

const STATUS_LABELS: Record<MembershipStatus, string> = {
  PENDING: 'Pendiente',
  INACTIVE: 'Inactiva',
  ACTIVE: 'Activa',
  EXPIRED: 'Expirada',
  DELETED: 'Eliminada',
  SUSPENDED: 'Suspendida',
};

export function translateHistoryAction(action: string): string {
  return (
    (ACTION_LABELS as any)[action] ??
    capitalize(action.replaceAll('_', ' ').toLowerCase())
  );
}

export function translateMembershipStatus(
  status: string | undefined | null,
): string {
  if (!status) return '-';
  return (
    (STATUS_LABELS as any)[status] ??
    capitalize(status.replaceAll('_', ' ').toLowerCase())
  );
}

function capitalize(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}
