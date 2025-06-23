"use client";

import { useState } from "react";
import { useTeamTree } from "../hooks/useTeamTree";
import { TeamMember } from "../actions/teamTree";
import { TeamTreeSkeleton } from "./TeamTreeSkeleton";
import { TeamTreeControls } from "./TeamTreeControls";
import { TeamTreeFlow } from "./TeamTreeFlow";
import { TeamMemberSheet } from "./TeamMemberSheet";

interface TeamTreeContentProps {
    currentUserId: string;
}

export function TeamTreeContent({ currentUserId }: TeamTreeContentProps) {
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

    const {
        treeData,
        loading,
        error,
        currentViewUserId,
        currentDepth,
        canGoUp,
        isAtRoot,
        navigateToUser,
        navigateToRoot,
        navigateToParent,
        changeDepth,
        refresh,
        findMemberById,
    } = useTeamTree(currentUserId);

    // Seleccionar miembro para ver detalles
    const handleSelectMember = (member: TeamMember) => {
        setSelectedMember(member);
    };

    // Navegación con cierre del sheet
    const handleNavigateToUser = (userId: string) => {
        navigateToUser(userId);
        setSelectedMember(null);
    };

    if (loading) {
        return <TeamTreeSkeleton />;
    }

    if (error || !treeData) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">
                    {error || "No se pudieron cargar los datos del equipo"}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Controles */}
            <TeamTreeControls
                canGoUp={canGoUp}
                isAtRoot={isAtRoot}
                currentDepth={currentDepth}
                onNavigateToRoot={navigateToRoot}
                onNavigateToParent={navigateToParent}
                onChangeDepth={changeDepth}
                onRefresh={refresh}
                onNavigateToUser={handleNavigateToUser}
            />

            {/* Flow Diagram */}
            <TeamTreeFlow
                tree={treeData.tree}
                currentUserId={currentUserId}
                viewingUserId={currentViewUserId}
                onSelectMember={handleSelectMember}
                onNavigateToUser={handleNavigateToUser}
                currentDepth={currentDepth}
            />

            {/* Sheet de detalles */}
            <TeamMemberSheet
                member={selectedMember}
                isOpen={!!selectedMember}
                onClose={() => setSelectedMember(null)}
                onNavigateToUser={handleNavigateToUser}
            />
        </div>
    );
}