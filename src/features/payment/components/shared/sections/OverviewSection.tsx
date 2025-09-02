import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PaymentStatus } from '@/features/payment/types/enums-payments'
import { PaymentConfig, UserInfo } from '@/features/payment/types/response-payment'
import { formatAmount, formatDateTime, getStatusConfig } from '@/features/payment/utils/payement.utils'
import {
    Banknote,
    Calendar,
    CreditCard,
    DollarSign,
    IdCard,
    Mail,
    Package,
    Phone,
    User
} from 'lucide-react'

interface OverviewSectionProps {
    status: PaymentStatus
    amount: number
    createdAt: string
    updatedAt: string
    paymentConfig: PaymentConfig
    id: number
    paymentMethod: string
    reviewedByEmail?: string | null
    reviewedAt?: string | null
    bankName?: string | null
    operationCode?: string | null
    rejectionReason?: string | null
    user?: UserInfo
}

export function OverviewSection(
    { amount, createdAt, status, updatedAt, paymentConfig, id, paymentMethod, rejectionReason, operationCode, reviewedAt, bankName, reviewedByEmail, user }
        : OverviewSectionProps) {
    const statusConfig = getStatusConfig(status)
    const StatusIcon = statusConfig.icon

    return (
        <div className="space-y-3">
            {/* Compact Status and Amount */}
            <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <div className="text-xl font-bold">{formatAmount(amount)}</div>
                        <div className="text-xs text-muted-foreground">{paymentConfig.name}</div>
                    </div>
                    <Badge variant={statusConfig.variant} className={`${statusConfig.className} text-xs`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig.label}
                    </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                        <span className="text-muted-foreground">ID:</span>
                        <span className="ml-1 font-medium">#{id}</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Método:</span>
                        <span className="ml-1 font-medium">{paymentMethod}</span>
                    </div>
                </div>
            </Card>

            {/* Compact Payment Details */}
            <Card className="p-4">
                <div className="space-y-2">
                    {bankName && (
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Banco:</span>
                            <span className="font-medium">{bankName}</span>
                        </div>
                    )}
                    {operationCode && (
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Código:</span>
                            <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                                {operationCode}
                            </span>
                        </div>
                    )}
                    <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Creado:</span>
                        <span>{formatDateTime(createdAt).split(' ')[0]}</span>
                    </div>
                </div>
            </Card>

            {/* Compact User Info */}
            {user && (
                <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Cliente</span>
                    </div>
                    <div className="space-y-1 text-sm">
                        <div>{user.fullName}</div>
                        {user.email && <div className="text-xs text-muted-foreground">{user.email}</div>}
                        {user.documentNumber && <div className="text-xs text-muted-foreground">Doc: {user.documentNumber}</div>}
                    </div>
                </Card>
            )}

            {/* Compact Review Info */}
            {(reviewedByEmail || reviewedAt || rejectionReason) && (
                <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Revisión</span>
                    </div>
                    <div className="space-y-1 text-sm">
                        {reviewedByEmail && <div className="text-xs">{reviewedByEmail}</div>}
                        {reviewedAt && <div className="text-xs text-muted-foreground">{formatDateTime(reviewedAt).split(' ')[0]}</div>}
                        {rejectionReason && (
                            <div className="text-xs p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded mt-2">
                                <strong>Rechazado:</strong> {rejectionReason}
                            </div>
                        )}
                    </div>
                </Card>
            )}
        </div>
    )
}
