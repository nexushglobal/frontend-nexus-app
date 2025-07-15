"use client";

import { UserMembership } from "../types/membership.types";


interface CurrentMembershipCardProps {
    userMembership: UserMembership;
}

export function CurrentMembershipCard({ userMembership }: CurrentMembershipCardProps) {
    if (!userMembership.hasMembership || !userMembership.plan) {
        return null;
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-PE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'bg-success/10 text-success border-success/20';
            case 'INACTIVE':
                return 'bg-warning/10 text-warning border-warning/20';
            case 'EXPIRED':
                return 'bg-destructive/10 text-destructive border-destructive/20';
            default:
                return 'bg-muted text-muted-foreground border-border';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'Activa';
            case 'INACTIVE':
                return 'Inactiva';
            case 'EXPIRED':
                return 'Expirada';
            default:
                return status;
        }
    };

    return (
        <div className="bg-card border rounded-lg p-6">
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span className="text-primary text-lg font-semibold">
                            {userMembership.plan.name.charAt(0)}
                        </span>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-card-foreground">
                            {userMembership.plan.name}
                        </h3>
                        <p className="text-muted-foreground">
                            {formatPrice(userMembership.plan.price)}
                        </p>
                    </div>
                </div>

                {userMembership.status && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(userMembership.status)}`}>
                        {getStatusText(userMembership.status)}
                    </span>
                )}
            </div>

            <div className="bg-muted/30 rounded-lg p-4 mb-4">
                <p className="text-card-foreground text-center text-sm">
                    {userMembership.message}
                </p>
            </div>

            <div className="space-y-3 text-sm">
                {userMembership.endDate && (
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Vence el:</span>
                        <span className="font-medium text-card-foreground">
                            {formatDate(userMembership.endDate)}
                        </span>
                    </div>
                )}

                {userMembership.membershipId && (
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">ID:</span>
                        <span className="font-medium text-card-foreground">
                            #{userMembership.membershipId}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}