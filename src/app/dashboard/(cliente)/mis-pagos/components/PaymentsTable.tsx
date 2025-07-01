'use client';

import TableTemplate from '@/components/common/table/TableTemplate';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Payment, PaymentMethod, PaymentStatus } from '@/types/payments/payments.types';
import {
    ColumnDef,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
    VisibilityState
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    Calendar,
    CreditCard,
    DollarSign,
    Package,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Eye
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
    data: Payment[];
};

const PaymentsTable = ({ data }: Props) => {
    const router = useRouter();
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        id: false,
        updatedAt: false,
        paymentMethod: false
    });

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
    };

    const formatTime = (dateString: string) => {
        return format(new Date(dateString), 'HH:mm', { locale: es });
    };

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 2
        }).format(amount);
    };

    const getStatusConfig = (status: PaymentStatus) => {
        switch (status) {
            case PaymentStatus.PENDING:
                return {
                    label: 'Pendiente',
                    variant: 'secondary' as const,
                    className: 'border-yellow-200 bg-yellow-100 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
                    icon: Clock
                };
            case PaymentStatus.APPROVED:
                return {
                    label: 'Aprobado',
                    variant: 'default' as const,
                    className: 'border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400',
                    icon: CheckCircle
                };
            case PaymentStatus.REJECTED:
                return {
                    label: 'Rechazado',
                    variant: 'destructive' as const,
                    className: 'border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400',
                    icon: XCircle
                };
            case PaymentStatus.COMPLETED:
                return {
                    label: 'Completado',
                    variant: 'default' as const,
                    className: 'border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
                    icon: CheckCircle
                };
            default:
                return {
                    label: status,
                    variant: 'secondary' as const,
                    className: 'border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400',
                    icon: AlertCircle
                };
        }
    };

    const getPaymentMethodLabel = (method: PaymentMethod) => {
        switch (method) {
            case PaymentMethod.POINTS:
                return 'Puntos';
            case PaymentMethod.CASH:
                return 'Efectivo';
            case PaymentMethod.BANK_TRANSFER:
                return 'Transferencia';
            case PaymentMethod.CREDIT_CARD:
                return 'Tarjeta de crédito';
            default:
                return method;
        }
    };

    const getPaymentMethodIcon = (method: PaymentMethod) => {
        switch (method) {
            case PaymentMethod.POINTS:
                return Package;
            case PaymentMethod.CASH:
                return DollarSign;
            case PaymentMethod.BANK_TRANSFER:
                return CreditCard;
            case PaymentMethod.CREDIT_CARD:
                return CreditCard;
            default:
                return DollarSign;
        }
    };

    const handleViewDetail = (paymentId: number) => {
        router.push(`/dashboard/mis-pagos/detalle/${paymentId}`);
    };

    const columns = useMemo<ColumnDef<Payment>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
                cell: ({ row }) => (
                    <div className="text-sm font-medium">
                        #{row.getValue('id')}
                    </div>
                ),
                enableHiding: true
            },
            {
                id: 'paymentInfo',
                header: 'Información del Pago',
                cell: ({ row }) => {
                    const payment = row.original;
                    const PaymentIcon = getPaymentMethodIcon(payment.paymentMethod);

                    return (
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                                <PaymentIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            </div>
                            <div>
                                <div className="font-medium text-gray-900 dark:text-gray-100">
                                    {payment.paymentConfig.name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {getPaymentMethodLabel(payment.paymentMethod)}
                                </div>
                            </div>
                        </div>
                    );
                },
                enableHiding: false
            },
            {
                accessorKey: 'amount',
                header: 'Monto',
                cell: ({ row }) => {
                    const amount = row.getValue('amount') as number;
                    return (
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">
                                {formatAmount(amount)}
                            </span>
                        </div>
                    );
                },
                enableHiding: false
            },
            {
                accessorKey: 'status',
                header: 'Estado',
                cell: ({ row }) => {
                    const status = row.getValue('status') as PaymentStatus;
                    const statusConfig = getStatusConfig(status);
                    const StatusIcon = statusConfig.icon;

                    return (
                        <Badge className={statusConfig.className}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {statusConfig.label}
                        </Badge>
                    );
                },
                enableHiding: false
            },
            {
                accessorKey: 'createdAt',
                header: 'Fecha de Creación',
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">
                                {formatDate(row.getValue('createdAt'))}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatTime(row.getValue('createdAt'))}
                            </span>
                        </div>
                    </div>
                ),
                enableHiding: false
            },
            {
                accessorKey: 'updatedAt',
                header: 'Fecha de Actualización',
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">
                                {formatDate(row.getValue('updatedAt'))}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatTime(row.getValue('updatedAt'))}
                            </span>
                        </div>
                    </div>
                ),
                enableHiding: true
            },
            {
                id: 'actions',
                header: 'Acciones',
                cell: ({ row }) => {
                    const payment = row.original;

                    return (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetail(payment.id)}
                            className="flex items-center gap-2"
                        >
                            <Eye className="h-4 w-4" />
                            Ver detalle
                        </Button>
                    );
                },
                enableHiding: false
            }
        ],
        [router]
    );

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            columnVisibility
        }
    });

    return (
        <TableTemplate<Payment>
            table={table}
            columns={columns}
            showColumnVisibility={true}
            columnVisibilityLabel="Mostrar columnas"
        />
    );
};

export default PaymentsTable;