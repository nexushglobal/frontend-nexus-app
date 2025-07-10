'use client'

import { Users } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { TeamTreeContent } from './TeamTreeContent'
import { TeamTreeSkeleton } from './TeamTreeSkeleton'

export function TeamPage() {
    const { data: session, status } = useSession()
    if (status === 'loading' || !session) {
        return <TeamTreeSkeleton />
    }




    return (
        <div className="container mx-auto p-6 space-y-6">
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

            <Suspense fallback={<TeamTreeSkeleton />}>

                <TeamTreeContent currentUserId={session.user.id} />
            </Suspense>
        </div>
    )
}
