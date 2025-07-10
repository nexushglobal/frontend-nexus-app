"use client";

import { Handle, Position } from "@xyflow/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Eye, GitBranch } from "lucide-react";
import { TeamMember } from "../types/team.types";

interface TeamMemberNodeData {
    member: TeamMember;
    isCurrentUser: boolean;
    isViewingUser: boolean;
    hasChildren: boolean;
    onSelect: () => void;
    onNavigate: () => void;
}

interface TeamMemberNodeProps {
    data: TeamMemberNodeData;
    selected?: boolean;
}

export function TeamMemberNode({ data, selected }: TeamMemberNodeProps) {
    const { member, isCurrentUser, isViewingUser, onSelect, onNavigate } = data;

    const getInitials = (name: string) => {
        const parts = name.split(" ");
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    const getDisplayName = () => {
        if (member.fullName) {
            return member.fullName.length > 20
                ? member.fullName.slice(0, 20) + "..."
                : member.fullName;
        }
        return member.email.split("@")[0];
    };

    const hasChildren = !!(member.children?.left || member.children?.right);

    return (
        <>
            {member.depth > 0 && (
                <Handle
                    type="target"
                    position={Position.Top}
                    id="top"
                    className="w-3 h-3 !bg-primary border-2 border-background"
                />
            )}

            <Card
                className={cn(
                    "w-[200px] h-[160px] transition-all duration-200 hover:shadow-lg cursor-pointer relative border-2 py-3",
                    isCurrentUser && "border-green-500 bg-green-50 dark:bg-green-950/20",
                    isViewingUser && "border-primary bg-primary/5",
                    selected && "border-blue-500 bg-blue-50 dark:bg-blue-950/20",
                    !isCurrentUser && !isViewingUser && !selected && "border-border hover:border-primary/50"
                )}
                onClick={onSelect}
            >
                <CardContent className=" h-full flex flex-col justify-between">
                    {/* Header con Avatar y Nombre */}
                    <div className="flex flex-col items-center space-y-2">
                        <div className="relative">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src="" alt={member.fullName} />
                                <AvatarFallback
                                    className={cn(
                                        "font-semibold text-sm",
                                        isCurrentUser && "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
                                        isViewingUser && "bg-primary/20 text-primary",
                                        !isCurrentUser && !isViewingUser && "bg-muted text-muted-foreground"
                                    )}
                                >
                                    {getInitials(member.fullName || member.email)}
                                </AvatarFallback>
                            </Avatar>

                            {/* Indicador de estado actual */}
                            {isCurrentUser && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                </div>
                            )}
                            {isViewingUser && !isCurrentUser && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-background flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                </div>
                            )}
                        </div>

                        {/* Nombre */}
                        <div className="text-center">
                            <h3 className="font-medium text-sm leading-tight text-foreground">
                                {getDisplayName()}
                            </h3>

                        </div>
                    </div>

                    {/* Footer con Acciones */}
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 h-8 text-xs"
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelect();
                            }}
                        >
                            <Eye className="h-3 w-3 mr-1" />
                            Ver
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 h-8 text-xs"
                            onClick={(e) => {
                                e.stopPropagation();
                                onNavigate();
                            }}
                        >
                            <GitBranch className="h-3 w-3 mr-1" />
                            Ir
                        </Button>
                    </div>
                </CardContent>

                {/* Efecto de resaltado para usuario actual */}
                {isViewingUser && (
                    <div className="absolute -inset-1 rounded-lg bg-primary/10 -z-10 animate-pulse" />
                )}
            </Card>

            {/* Handle de salida (hacia abajo) - solo si tiene hijos */}
            {hasChildren && (
                <Handle
                    type="source"
                    position={Position.Bottom}
                    id="bottom"
                    className="w-3 h-3 !bg-primary border-2 border-background"
                />
            )}
        </>
    );
}