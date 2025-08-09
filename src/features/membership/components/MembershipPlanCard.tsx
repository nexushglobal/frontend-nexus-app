"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/features/shared/utils/formatCurrency";
import { Award, Check, Crown, DollarSign, TrendingUp, Users, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { MembershipPlan, UserMembership } from "../types/membership.types";

interface MembershipPlanCardProps {
    plan: MembershipPlan;
    isUpgrade?: boolean;
    currentMembership: UserMembership;
}

export function MembershipPlanCard({
    plan,
    isUpgrade = false,
    currentMembership
}: MembershipPlanCardProps) {
    const { push } = useRouter();
    const isCurrentPlan = currentMembership.plan?.id === plan.id;
    const viewDetails = () => {
        push(`/dashboard/cli-membresias/planes/${plan.id}`);
    }

    return (
        <Card className={`
            relative shadow-sm transition-all duration-300 hover:shadow-md h-full flex flex-col
            ${isCurrentPlan ? 'bg-primary/5 border-primary' : ''}
        `}>
            {/* Upgrade Badge */}
            {isUpgrade && (
                <div className="absolute -top-2 -right-2">
                    <div className="bg-primary text-primary-foreground rounded-full p-2 shadow-lg">
                        <Zap className="h-4 w-4" />
                    </div>
                </div>
            )}

            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Crown className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                    </div>
                    {isCurrentPlan && (
                        <Badge variant="outline" >
                            Actual
                        </Badge>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-foreground">
                            {formatCurrency(isUpgrade && plan.upgradeCost ? plan.upgradeCost : plan.price)}
                        </span>
                    </div>
                    {isUpgrade && plan.upgradeCost && plan.upgradeCost !== plan.price && (
                        <p className="text-sm text-muted-foreground">
                            Precio completo: {formatCurrency(plan.price)}
                        </p>
                    )}
                </div>
            </CardHeader>

            <Separator />

            <CardContent className="pt-6 space-y-6 h-full flex flex-col">
                {/* Plan Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {plan.checkAmount > 0 && (
                        <div className="info-field">
                            <DollarSign className="field-icon" />
                            <div>
                                <div className="font-semibold">{formatCurrency(plan.checkAmount)}</div>
                                <div className="text-xs text-muted-foreground">Monto de Cheque</div>
                            </div>
                        </div>
                    )}

                    <div className="info-field">
                        <Award className="field-icon" />
                        <div>
                            <div className="font-semibold">{plan.binaryPoints}</div>
                            <div className="text-xs text-muted-foreground">Puntos Binarios</div>
                        </div>
                    </div>

                    <div className="info-field">
                        <TrendingUp className="field-icon" />
                        <div>
                            <div className="font-semibold">{plan.commissionPercentage}%</div>
                            <div className="text-xs text-muted-foreground">Comisión</div>
                        </div>
                    </div>

                    <div className="info-field">
                        <Users className="field-icon" />
                        <div>
                            <div className="font-semibold">{formatCurrency(plan.directCommissionAmount)}</div>
                            <div className="text-xs text-muted-foreground">Comisión Directa</div>
                        </div>
                    </div>
                </div>

                {/* Products Section */}
                {plan.products && plan.products.length > 0 && (
                    <div className="space-y-3 flex-1">
                        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                            Productos Incluidos
                        </h4>
                        <div className="space-y-2">
                            {plan.products.map((product, index) => (
                                <div key={index} className="flex items-start gap-2">
                                    <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-card-foreground">{product}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Benefits Section */}
                {plan.benefits && plan.benefits.length > 0 && (
                    <div className="space-y-3 flex-1">
                        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                            Beneficios Incluidos
                        </h4>
                        <div className="space-y-2">
                            {plan.benefits.map((benefit, index) => (
                                <div key={index} className="flex items-start gap-2">
                                    <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-card-foreground">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Button - Always at bottom */}
                <div className="mt-auto pt-4">
                    <Button
                        className="w-full"
                        variant={isCurrentPlan ? "outline" : "default"}
                        disabled={isCurrentPlan || !plan.isActive}
                        onClick={viewDetails}
                    >
                        {isCurrentPlan
                            ? "Plan Actual"
                            : !plan.isActive
                                ? "No Disponible"
                                : isUpgrade
                                    ? "Actualizar Plan"
                                    : "Seleccionar Plan"
                        }
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
