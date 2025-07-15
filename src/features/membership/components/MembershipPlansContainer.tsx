"use client";

import { MembershipData } from "../types/membership.types";
import { CurrentMembershipCard } from "./CurrentMembershipCard";
import { MembershipPlanCard } from "./MembershipPlanCard";

interface MembershipPlansContainerProps {
    membershipData: MembershipData;
}
export function MembershipPlansContainer({ membershipData }: MembershipPlansContainerProps) {
    const { plans, userMembership } = membershipData;

    return (
        <div className="space-y-12">
            {/* Membresía Actual */}
            {userMembership.hasMembership && (
                <section>
                    <h2 className="text-lg font-medium text-foreground mb-6">
                        Tu Membresía Actual
                    </h2>
                    <CurrentMembershipCard userMembership={userMembership} />
                </section>
            )}

            {/* Planes Disponibles */}
            <section>
                <h2 className="text-lg font-medium text-foreground mb-8">
                    {userMembership.hasMembership
                        ? plans.length > 0
                            ? "Planes de Actualización"
                            : "¡Excelente! Tienes el plan más alto"
                        : "Planes de Membresía"
                    }
                </h2>

                {plans.length === 0 ? (
                    <div className="bg-card border rounded-lg p-8 text-center">
                        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">✓</span>
                        </div>
                        <h3 className="font-medium text-card-foreground mb-2">Plan Máximo Activo</h3>
                        <p className="text-muted-foreground text-sm">
                            Ya tienes el plan de membresía más alto disponible
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {plans.map((plan) => (
                            <MembershipPlanCard
                                key={plan.id}
                                plan={plan}
                                isUpgrade={plan.isUpgrade}
                                currentMembership={userMembership}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}