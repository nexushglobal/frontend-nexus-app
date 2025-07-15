"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, Crown, DollarSign, TrendingUp } from "lucide-react";
import { UserMembership } from "../types/membership.types";
import { formatCurrency } from "@/features/shared/utils/formatCurrency";
import { formatDate } from "@/features/payment/utils/payement.utils";

interface CurrentMembershipCardProps {
    userMembership: UserMembership;
}

export function CurrentMembershipCard({ userMembership }: CurrentMembershipCardProps) {
    if (!userMembership.hasMembership || !userMembership.plan) {
        return null;
    }

    const { plan, status, endDate } = userMembership;
    const isActive = status === "ACTIVE";
    const daysRemaining = endDate ? Math.max(0, Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0;
    const progressPercentage = daysRemaining > 0 ? Math.min(100, (daysRemaining / 365) * 100) : 0;

    return (
        <Card className="shadow-sm hover-lift bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Crown className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-xl flex items-center gap-2">
                                {plan.name}
                                <Badge
                                    variant={isActive ? "default" : "secondary"}
                                    className={isActive ? "badge-success" : "badge-warning"}
                                >
                                    {status}
                                </Badge>
                            </CardTitle>
                            <p className="text-muted-foreground text-sm">Tu membresía actual</p>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Plan Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="info-field">
                        <DollarSign className="field-icon" />
                        <div>
                            <div className="font-semibold">{formatCurrency(plan.price)}</div>
                            <div className="text-xs text-muted-foreground">Valor del Plan</div>
                        </div>
                    </div>

                    <div className="info-field">
                        <TrendingUp className="field-icon" />
                        <div>
                            <div className="font-semibold">{daysRemaining}</div>
                            <div className="text-xs text-muted-foreground">Días restantes</div>
                        </div>
                    </div>

                    <div className="info-field">
                        <Calendar className="field-icon" />
                        <div>
                            <div className="font-semibold text-xs">
                                {endDate ? formatDate(endDate) : "N/A"}
                            </div>
                            <div className="text-xs text-muted-foreground">Fecha de expiración</div>
                        </div>
                    </div>

                    <div className="info-field">
                        <Crown className="field-icon" />
                        <div>
                            <div className="font-semibold">Activa</div>
                            <div className="text-xs text-muted-foreground">Estado</div>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                {endDate && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tiempo restante</span>
                            <span className="font-medium">{daysRemaining} días</span>
                        </div>
                        <Progress
                            value={progressPercentage}
                            className="h-2"
                        />
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="flex-1">
                        Ver Detalles
                    </Button>
                    <Button size="sm" className="flex-1">
                        Renovar Plan
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}