"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { MembershipData } from "../types/membership.types";
import { CurrentMembershipCard } from "./CurrentMembershipCard";
import { MembershipPlanCard } from "./MembershipPlanCard";

interface MembershipPlansContainerProps {
    membershipData: MembershipData;
}

export function MembershipPlansContainer({ membershipData }: MembershipPlansContainerProps) {
    const { plans, userMembership } = membershipData;

    return (
        <div className="space-y-8">
            {/* Current Membership Section */}
            {userMembership.hasMembership && (
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="section-icon">
                            <CheckCircle className="h-5 w-5 text-success" />
                        </div>
                        <h2 className="text-lg font-medium text-foreground">
                            Tu Membresía Actual
                        </h2>

                    </div>
                    <CurrentMembershipCard userMembership={userMembership} />
                </section>
            )}

            {/* Available Plans Section */}
            <section className="space-y-6">
                <div className="text-center space-y-2">
                    <h2 className="text-xl font-semibold text-foreground">
                        {userMembership.hasMembership
                            ? plans.length > 0
                                ? "Planes de Actualización"
                                : "¡Excelente! Tienes el plan más alto"
                            : "Planes de Membresía Disponibles"
                        }
                    </h2>
                    <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
                        {userMembership.hasMembership && plans.length > 0
                            ? "Actualiza tu membresía para acceder a más beneficios y oportunidades"
                            : !userMembership.hasMembership
                                ? "Selecciona el plan que mejor se adapte a tus objetivos"
                                : "Estás disfrutando de todos los beneficios disponibles"
                        }
                    </p>
                </div>

                {plans.length === 0 ? (
                    <Card className="shadow-sm hover-lift">
                        <CardContent className="p-8 text-center">
                            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="h-8 w-8 text-success" />
                            </div>
                            <h3 className="font-semibold text-card-foreground mb-2">
                                Plan Máximo Activo
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                Ya tienes el plan de membresía más alto disponible. ¡Disfruta de todos los beneficios!
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {plans.map((plan, index) => (
                            <div key={plan.id} className="hover-lift">
                                <MembershipPlanCard
                                    plan={plan}
                                    isUpgrade={plan.isUpgrade}
                                    currentMembership={userMembership}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
