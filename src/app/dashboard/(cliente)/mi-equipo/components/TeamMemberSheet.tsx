"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
    ArrowLeft,
    ArrowRight,
    Copy,
    GitBranch,
    Mail,
    Navigation,
    Users
} from "lucide-react";
import { toast } from "sonner";
import { TeamMember } from "../actions/teamTree";

interface TeamMemberSheetProps {
    member: TeamMember | null;
    isOpen: boolean;
    onClose: () => void;
    onNavigateToUser: (userId: string) => void;
}

export function TeamMemberSheet({
    member,
    isOpen,
    onClose,
    onNavigateToUser,
}: TeamMemberSheetProps) {
    if (!member) return null;

    const getInitials = (name: string) => {
        const parts = name.split(" ");
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    const copyToClipboard = async (text: string, label: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success(`${label} copiado`, {
                description: "Se ha copiado al portapapeles",
            });
        } catch (error) {
            toast.error("Error al copiar", {
                description: "No se pudo copiar al portapapeles",
            });
        }
    };

    const handleNavigateToMember = () => {
        onNavigateToUser(member.id);
        onClose();
    };

    const hasChildren = !!(member.children?.left || member.children?.right);

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="w-full sm:max-w-md flex flex-col">
                <SheetHeader className="px-6 pt-6 pb-4 text-left flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src="" alt={member.fullName} />
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                                {getInitials(member.fullName || member.email)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="space-y-2 flex-1 min-w-0">
                            <SheetTitle className="text-xl truncate">
                                {member.fullName || member.email.split("@")[0]}
                            </SheetTitle>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                    Nivel {member.depth}
                                </Badge>
                                {member.position && (
                                    <Badge variant="secondary" className="text-xs">
                                        {member.position === "LEFT" ? "Izquierda" : "Derecha"}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-6 pb-6">
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-muted-foreground">
                                Información de Contacto
                            </h3>

                            <Card>
                                <CardContent className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <Mail className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-muted-foreground mb-1">Email</p>
                                        <p className="font-medium text-sm truncate">{member.email}</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyToClipboard(member.email, "Email")}
                                        className="h-8 w-8 p-0 shrink-0"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-muted-foreground">
                                Posición en la Red
                            </h3>

                            <Card>
                                <CardContent className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <GitBranch className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground mb-1">Ubicación</p>
                                        <p className="font-medium text-sm">
                                            {member.position === "LEFT"
                                                ? "Lado Izquierdo"
                                                : member.position === "RIGHT"
                                                    ? "Lado Derecho"
                                                    : "Nodo Raíz"
                                            } - Nivel {member.depth}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-3">
                            <Button
                                onClick={handleNavigateToMember}
                                className="w-full h-11"
                                size="lg"
                            >
                                <Navigation className="h-4 w-4 mr-2" />
                                Ver árbol de este usuario
                            </Button>
                        </div>

                        {hasChildren && (
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Hijos Directos
                                </h3>

                                <div className="space-y-2">
                                    {member.children?.left && (
                                        <Card className="overflow-hidden">
                                            <Button
                                                variant="ghost"
                                                onClick={() => {
                                                    onNavigateToUser(member.children!.left!.id);
                                                    onClose();
                                                }}
                                                className="w-full h-auto p-0 justify-start"
                                            >
                                                <CardContent className="flex items-center gap-3 w-full">
                                                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                                                        <ArrowLeft className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <div className="text-left flex-1 min-w-0">
                                                        <p className="font-medium text-sm truncate">
                                                            {member.children.left.fullName || member.children.left.email.split("@")[0]}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">Hijo Izquierdo</p>
                                                    </div>
                                                    <Navigation className="h-4 w-4 text-muted-foreground shrink-0" />
                                                </CardContent>
                                            </Button>
                                        </Card>
                                    )}

                                    {member.children?.right && (
                                        <Card className="overflow-hidden">
                                            <Button
                                                variant="ghost"
                                                onClick={() => {
                                                    onNavigateToUser(member.children!.right!.id);
                                                    onClose();
                                                }}
                                                className="w-full h-auto p-0 justify-start"
                                            >
                                                <CardContent className="flex items-center gap-3 w-full">
                                                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                                                        <ArrowRight className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                    </div>
                                                    <div className="text-left flex-1 min-w-0">
                                                        <p className="font-medium text-sm truncate">
                                                            {member.children.right.fullName || member.children.right.email.split("@")[0]}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">Hijo Derecho</p>
                                                    </div>
                                                    <Navigation className="h-4 w-4 text-muted-foreground shrink-0" />
                                                </CardContent>
                                            </Button>
                                        </Card>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-muted-foreground">
                                Información del Equipo
                            </h3>

                            <Card>
                                <CardContent className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <Users className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground mb-1">Estructura</p>
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Nivel en la red:</span>
                                                <span className="font-medium">{member.depth}</span>
                                            </div>
                                            {hasChildren && (
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">Hijos directos:</span>
                                                    <span className="font-medium">
                                                        {(member.children?.left ? 1 : 0) + (member.children?.right ? 1 : 0)}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Posición:</span>
                                                <span className="font-medium">
                                                    {member.position === "LEFT" ? "Izquierda" : member.position === "RIGHT" ? "Derecha" : "Raíz"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}