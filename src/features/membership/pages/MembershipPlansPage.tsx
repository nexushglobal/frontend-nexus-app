import { Alert, AlertDescription } from "@/components/ui/alert";
import { getMembershipPlansAction } from "@/features/membership/actions/get-membership-plans";
import { PageHeader } from "@/features/shared/components/common/PageHeader";
import { AlertCircle } from "lucide-react";
import { Suspense } from "react";
import { MembershipPlansContainer } from "../components/MembershipPlansContainer";
import { MembershipPlansLoading } from "../components/skeleton/MembershipPlansLoading";


export async function MembershipPlansPage() {
    const result = await getMembershipPlansAction();

    if (!result.success || !result.data) {
        return (
            <div className="container">
                <PageHeader
                    title="Planes de Membresía"
                    subtitle="Elige el plan que mejor se adapte a tus objetivos y necesidades de crecimiento"
                    className="mb-6"
                    variant="gradient"
                />
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {result.message || 'Error al cargar los planes de membresía'}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container">
            <PageHeader
                title="Planes de Membresía"
                subtitle="Elige el plan que mejor se adapte a tus objetivos y necesidades de crecimiento"
                className="mb-6"
                variant="gradient"
            />

            <div className="space-y-6">
                <Suspense fallback={<MembershipPlansLoading />}>
                    <MembershipPlansContainer membershipData={result.data} />
                </Suspense>
            </div>
        </div>
    );
}
