import { WithdrawalStatus } from '../types/enums-withdrawals';

export const WITHDRAWAL_STATUS_LABELS: Record<WithdrawalStatus, string> = {
  [WithdrawalStatus.PENDING]: 'Pendiente',
  [WithdrawalStatus.APPROVED]: 'Aprobado',
  [WithdrawalStatus.REJECTED]: 'Rechazado',
  [WithdrawalStatus.PENDING_SIGNATURE]: 'Pendiente de firma',
} as const;

export const WITHDRAWAL_STATUS_VARIANTS = {
  [WithdrawalStatus.PENDING]: {
    variant: 'secondary' as const,
    className:
      'border-yellow-200 bg-yellow-100 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  },
  [WithdrawalStatus.APPROVED]: {
    variant: 'default' as const,
    className:
      'border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400',
  },
  [WithdrawalStatus.REJECTED]: {
    variant: 'destructive' as const,
    className:
      'border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400',
  },
  [WithdrawalStatus.PENDING_SIGNATURE]: {
    variant: 'outline' as const,
    className:
      'border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  },
} as const;
