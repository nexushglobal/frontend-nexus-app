"use client";

import { Handle, Position } from "@xyflow/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Eye, GitBranch, Info } from "lucide-react";
import { TeamMember } from "../actions/teamTree";

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
            return member.fullName.length > 18
                ? member.fullName.slice(0, 18) + "..."
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
                    "w-52 transition-all duration-200 hover:shadow-md cursor-pointer relative ",
                    isCurrentUser && "ring-2 ring-green-500 ring-offset-2",
                    isViewingUser && "ring-2 ring-primary ring-offset-2",
                    selected && "ring-2 ring-blue-500 ring-offset-2",
                    !member.isActive && "opacity-70"
                )}
                onClick={onSelect}
            >
                <CardContent className="p-4">
                    <div className="flex flex-col items-center space-y-3">
                        {/* Avatar con indicadores */}
                        <div className="relative">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src="" alt={member.fullName} />
                                <AvatarFallback
                                    className={cn(
                                        "font-semibold text-sm",
                                        isCurrentUser && "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
                                        isViewingUser && "bg-primary/10 text-primary",
                                        !isCurrentUser && !isViewingUser && "bg-muted text-muted-foreground"
                                    )}
                                >
                                    {getInitials(member.fullName || member.email)}
                                </AvatarFallback>
                            </Avatar>

                            {/* Indicadores de estado */}
                            <div className="absolute -top-1 -right-1 flex flex-col space-y-1">
                                {isCurrentUser && (
                                    <div className="w-3 h-3 bg-green-500 rounded-full border border-background"
                                        title="Tu usuario" />
                                )}
                                {isViewingUser && !isCurrentUser && (
                                    <div className="w-3 h-3 bg-primary rounded-full border border-background"
                                        title="Vista actual" />
                                )}
                                {!member.isActive && (
                                    <div className="w-3 h-3 bg-red-500 rounded-full border border-background"
                                        title="Inactivo" />
                                )}
                            </div>
                        </div>

                        {/* Información básica */}
                        <div className="text-center space-y-1 w-full">
                            <h3 className="font-medium text-sm leading-tight">
                                {getDisplayName()}
                            </h3>

                            <div className="text-xs text-muted-foreground font-mono">
                                {member.referralCode}
                            </div>

                            {/* Estado y nivel */}
                            <div className="flex items-center justify-center gap-2">
                                <Badge
                                    variant={member.isActive ? "default" : "secondary"}
                                    className="text-xs px-2 py-0"
                                >
                                    {member.isActive ? "Activo" : "Inactivo"}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                    N{member.depth}
                                </span>
                            </div>
                        </div>

                        {/* Acciones */}
                        <div className="flex gap-1 w-full">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 h-7 text-xs"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelect();
                                }}
                            >
                                <Info className="h-3 w-3 mr-1" />
                                Detalles
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 h-7 text-xs"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onNavigate();
                                }}
                            >
                                <GitBranch className="h-3 w-3 mr-1" />
                                Ver
                            </Button>
                        </div>
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