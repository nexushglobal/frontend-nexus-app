import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users } from "lucide-react";
import { TeamTreeContent } from "./components/TeamTreeContent";
import { TeamTreeSkeleton } from "./components/TeamTreeSkeleton";

export default async function TeamPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/");
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Mi Equipo</h1>
                        <p className="text-muted-foreground">
                            Visualiza y gestiona la estructura de tu red de usuarios
                        </p>
                    </div>
                </div>
            </div>

            {/* Tree Content */}
            <Suspense fallback={<TeamTreeSkeleton />}>
                <TeamTreeContent currentUserId={session.user.id} />
            </Suspense>
        </div>
    );
}