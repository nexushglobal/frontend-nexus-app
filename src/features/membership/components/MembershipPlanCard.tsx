"use client";

import Link from "next/link";
import { MembershipPlan, UserMembership } from "../types/membership.types";


interface MembershipPlanCardProps {
    plan: MembershipPlan;
    isUpgrade?: boolean;
    currentMembership?: UserMembership;
}

export function MembershipPlanCard({
    plan,
    isUpgrade = false,
    currentMembership
}: MembershipPlanCardProps) {



    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
        }).format(price);
    };

    return (
        <div className="group bg-card border rounded-lg p-6 transition-all duration-200 hover:shadow-md hover:border-border/80 flex flex-col h-full">

            {/* Header del Plan */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-card-foreground">{plan.name}</h3>
                    {isUpgrade && (
                        <span className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs font-medium">
                            Actualización
                        </span>
                    )}
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-card-foreground">
                        {formatPrice(isUpgrade && plan.upgradeCost ? plan.upgradeCost : plan.price)}
                    </span>
                </div>
                {isUpgrade && plan.upgradeCost && (
                    <p className="text-sm text-muted-foreground mt-1">
                        Desde {currentMembership?.plan?.name}
                    </p>
                )}
            </div>

            {/* Contenido principal - crece para ocupar espacio disponible */}
            <div className="flex-1 space-y-6">
                {/* Productos */}
                <div>
                    <h4 className="text-sm font-medium text-card-foreground mb-3">Productos incluidos</h4>
                    <div className="space-y-2">
                        {plan.products.map((product, index) => (
                            <div key={index} className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                <span className="text-sm text-muted-foreground">{product}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Beneficios */}
                <div>
                    <h4 className="text-sm font-medium text-card-foreground mb-3">Beneficios</h4>
                    <div className="space-y-2">
                        {plan.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0" />
                                <span className="text-sm text-muted-foreground">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Detalles Técnicos */}
                <div className="bg-muted/50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-xs text-muted-foreground">Puntos Binarios</span>
                            <p className="text-sm font-medium text-card-foreground">{plan.binaryPoints.toLocaleString()}</p>
                        </div>
                        <div>
                            <span className="text-xs text-muted-foreground">Comisión</span>
                            <p className="text-sm font-medium text-card-foreground">{plan.commissionPercentage}%</p>
                        </div>
                        {plan.checkAmount > 0 && (
                            <div className="col-span-2">
                                <span className="text-xs text-muted-foreground">Monto Check</span>
                                <p className="text-sm font-medium text-card-foreground">{formatPrice(plan.checkAmount)}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Botón de Acción - siempre al final */}
            <div className="mt-6  flex ">
                <Link
                    href={`/membership/plan/${plan.id}`}
                    className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium transition-colors duration-200 hover:bg-primary-hover"
                >
                    {isUpgrade ? 'Actualizar Plan' : 'Seleccionar Plan'}
                </Link>
            </div>
        </div>
    );
}