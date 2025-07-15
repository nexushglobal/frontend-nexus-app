import { getMembershipPlansAction } from "@/features/membership/actions/get-membership-plans";
import { MembershipPlansContainer } from "@/features/membership/components/MembershipPlansContainer";
import { Suspense } from "react";

export default async function MembershipPlansPage() {
    const result = await getMembershipPlansAction();

    if (!result.success || !result.data) {
        return (
            <div className="container mx-auto px-6 py-8">
                <div className="max-w-2xl mx-auto text-center">
                    <h1 className="text-2xl font-semibold text-foreground mb-6">
                        Planes de Membresía
                    </h1>
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
                        <p className="text-destructive">{result.message}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-12 text-center">
                    <h1 className="text-3xl font-semibold text-foreground mb-3">
                        Planes de Membresía
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Elige el plan que mejor se adapte a tus objetivos y necesidades de crecimiento
                    </p>
                </div>

                <Suspense fallback={
                    <div className="flex items-center justify-center py-12">
                        <div className="text-muted-foreground">Cargando planes...</div>
                    </div>
                }>
                    <MembershipPlansContainer membershipData={result.data} />
                </Suspense>
            </div>
        </div>
    );
}