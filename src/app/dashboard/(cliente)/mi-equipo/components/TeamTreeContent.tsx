"use client";

import { useState } from "react";
import { TeamMember } from "../actions/teamTree";
import { useTeamTree } from "../hooks/useTeamTree";
import { TeamMemberSheet } from "./TeamMemberSheet";
import { TeamTreeControls } from "./TeamTreeControls";
import { TeamTreeFlow } from "./TeamTreeFlow";
import { TeamTreeSkeleton } from "./TeamTreeSkeleton";

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
    } = useTeamTree(currentUserId);

    const handleSelectMember = (member: TeamMember) => {
        setSelectedMember(member);
    };

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

            <TeamTreeFlow
                tree={treeData.tree}
                currentUserId={currentUserId}
                viewingUserId={currentViewUserId}
                onSelectMember={handleSelectMember}
                onNavigateToUser={handleNavigateToUser}
                currentDepth={currentDepth}
            />

            <TeamMemberSheet
                member={selectedMember}
                isOpen={!!selectedMember}
                onClose={() => setSelectedMember(null)}
                onNavigateToUser={handleNavigateToUser}
            />
        </div>
    );
}