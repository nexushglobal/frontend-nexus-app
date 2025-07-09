// src/app/dashboard/(facturacion)/pagos/components/AdminPaymentsTable.tsx
'use client';

import TableTemplate from '@/components/common/table/TableTemplate';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
    Eye,
    User,
    FileText,
    Wallet,
    Receipt
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminPaymentResponse, PaymentMethod, PaymentStatus } from '@/types/admin-payments.types';

type Props = {
    data: AdminPaymentResponse[];
};

const AdminPaymentsTable = ({ data }: Props) => {
    const router = useRouter();
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        id: false,
        operationCode: false,
        ticketNumber: false,
        reviewedAt: false,
        reviewedByEmail: false
    });

    const formatDate = (dateString: string | Date) => {
        return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
    };

    const formatTime = (dateString: string | Date) => {
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
                    label: 'Desconocido',
                    variant: 'secondary' as const,
                    className: 'border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
                    icon: AlertCircle
                };
        }
    };

    const getPaymentMethodConfig = (method: PaymentMethod) => {
        switch (method) {
            case PaymentMethod.VOUCHER:
                return {
                    label: 'Voucher',
                    icon: Receipt,
                    className: 'text-purple-600 dark:text-purple-400'
                };
            case PaymentMethod.POINTS:
                return {
                    label: 'Puntos',
                    icon: Package,
                    className: 'text-orange-600 dark:text-orange-400'
                };
            case PaymentMethod.PAYMENT_GATEWAY:
                return {
                    label: 'Pasarela de Pago',
                    icon: CreditCard,
                    className: 'text-blue-600 dark:text-blue-400'
                };
            default:
                return {
                    label: 'Desconocido',
                    icon: AlertCircle,
                    className: 'text-gray-600 dark:text-gray-400'
                };
        }
    };

    const handleViewDetail = (paymentId: number) => {
        router.push(`/dashboard/pagos/${paymentId}`);
    };

    const columns: ColumnDef<AdminPaymentResponse>[] = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
                cell: ({ row }) => (
                    <span className="font-mono text-sm">
                        #{row.getValue('id')}
                    </span>
                ),
                enableHiding: true
            },
            {
                accessorKey: 'user',
                header: 'Usuario',
                cell: ({ row }) => {
                    const user = row.getValue('user') as AdminPaymentResponse['user'];
                    return (
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                                <User className="h-5 w-5" />
                            </div>
                            <div className="space-y-1">
                                <div className="font-medium text-sm">
                                    {user.fullName}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {user.email}
                                </div>
                                {user.documentNumber && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        Doc: {user.documentNumber}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                },
                enableHiding: false
            },
            {
                accessorKey: 'amount',
                header: 'Monto',
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="font-semibold text-green-600 dark:text-green-400">
                            {formatAmount(row.getValue('amount'))}
                        </span>
                    </div>
                ),
                enableHiding: false
            },
            {
                accessorKey: 'status',
                header: 'Estado',
                cell: ({ row }) => {
                    const status = row.getValue('status') as PaymentStatus;
                    const config = getStatusConfig(status);
                    const Icon = config.icon;

                    return (
                        <Badge className={config.className}>
                            <Icon className="h-3 w-3 mr-1" />
                            {config.label}
                        </Badge>
                    );
                },
                enableHiding: false
            },
            {
                accessorKey: 'paymentMethod',
                header: 'Método de Pago',
                cell: ({ row }) => {
                    const method = row.getValue('paymentMethod') as PaymentMethod;
                    const config = getPaymentMethodConfig(method);
                    const Icon = config.icon;

                    return (
                        <div className="flex items-center gap-2">
                            <Icon className={`h-4 w-4 ${config.className}`} />
                            <span className="text-sm font-medium">
                                {config.label}
                            </span>
                        </div>
                    );
                },
                enableHiding: true
            },
            {
                accessorKey: 'paymentConfig',
                header: 'Configuración',
                cell: ({ row }) => {
                    const config = row.getValue('paymentConfig') as AdminPaymentResponse['paymentConfig'];
                    return (
                        <div className="flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <div className="space-y-1">
                                <div className="text-sm font-medium">
                                    {config.name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                                    {config.code}
                                </div>
                            </div>
                        </div>
                    );
                },
                enableHiding: false
            },
            {
                accessorKey: 'operationCode',
                header: 'Código de Operación',
                cell: ({ row }) => {
                    const code = row.getValue('operationCode') as string;
                    return code ? (
                        <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {code}
                        </span>
                    ) : (
                        <span className="text-gray-400 text-sm">N/A</span>
                    );
                },
                enableHiding: true
            },
            {
                accessorKey: 'ticketNumber',
                header: 'Número de Ticket',
                cell: ({ row }) => {
                    const ticket = row.getValue('ticketNumber') as string;
                    return ticket ? (
                        <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {ticket}
                        </span>
                    ) : (
                        <span className="text-gray-400 text-sm">N/A</span>
                    );
                },
                enableHiding: true
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
                accessorKey: 'reviewedAt',
                header: 'Fecha de Revisión',
                cell: ({ row }) => {
                    const reviewedAt = row.getValue('reviewedAt') as Date;
                    return reviewedAt ? (
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">
                                    {formatDate(reviewedAt)}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatTime(reviewedAt)}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <span className="text-gray-400 text-sm">N/A</span>
                    );
                },
                enableHiding: true
            },
            {
                accessorKey: 'reviewedByEmail',
                header: 'Revisado Por',
                cell: ({ row }) => {
                    const email = row.getValue('reviewedByEmail') as string;
                    return email ? (
                        <span className="text-sm">
                            {email}
                        </span>
                    ) : (
                        <span className="text-gray-400 text-sm">N/A</span>
                    );
                },
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
        <TableTemplate<AdminPaymentResponse>
            table={table}
            columns={columns}
            showColumnVisibility={true}
            columnVisibilityLabel="Mostrar columnas"
        />
    );
};

export default AdminPaymentsTable;