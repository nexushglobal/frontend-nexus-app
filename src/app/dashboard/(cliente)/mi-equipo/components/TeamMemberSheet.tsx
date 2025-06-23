"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
    Mail,
    Hash,
    GitBranch,
    Activity,
    Copy,
    Eye,
    ArrowLeft,
    ArrowRight,
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
            <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader className="text-left pb-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src="" alt={member.fullName} />
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                                {getInitials(member.fullName || member.email)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="space-y-2">
                            <SheetTitle className="text-xl">
                                {member.fullName || member.email.split("@")[0]}
                            </SheetTitle>
                            <div className="flex items-center gap-2">
                                <Badge variant={member.isActive ? "default" : "secondary"}>
                                    {member.isActive ? "Activo" : "Inactivo"}
                                </Badge>
                                <Badge variant="outline">
                                    Nivel {member.depth}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </SheetHeader>

                <div className="space-y-6">
                    {/* Información principal */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                            Información Principal
                        </h3>

                        {/* Email */}
                        <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                            <Mail className="h-4 w-4 text-primary" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground">Email</p>
                                <p className="font-medium text-sm truncate">{member.email}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(member.email, "Email")}
                                className="h-8 w-8 p-0"
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Código de referido */}
                        <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                            <Hash className="h-4 w-4 text-primary" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground">Código de Referido</p>
                                <p className="font-medium text-sm font-mono">{member.referralCode}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(member.referralCode, "Código")}
                                className="h-8 w-8 p-0"
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Posición */}
                        <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                            <GitBranch className="h-4 w-4 text-primary" />
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground">Posición en la Red</p>
                                <p className="font-medium text-sm">
                                    {member.position === "LEFT"
                                        ? "Lado Izquierdo"
                                        : member.position === "RIGHT"
                                            ? "Lado Derecho"
                                            : "Nodo Raíz"
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Estado */}
                        <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                            <Activity className="h-4 w-4 text-primary" />
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground">Estado</p>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${member.isActive ? "bg-green-500" : "bg-gray-400"}`} />
                                    <p className="font-medium text-sm">
                                        {member.isActive ? "Usuario activo" : "Usuario inactivo"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Acción principal */}
                    <div className="space-y-3">
                        <Button
                            onClick={handleNavigateToMember}
                            className="w-full h-12"
                        >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver árbol de este usuario
                        </Button>
                    </div>

                    {/* Navegación a hijos */}
                    {hasChildren && (
                        <>
                            <Separator />
                            <div className="space-y-3">
                                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                    Hijos Directos
                                </h3>

                                <div className="grid gap-2">
                                    {member.children?.left && (
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                onNavigateToUser(member.children!.left!.id);
                                                onClose();
                                            }}
                                            className="justify-start h-auto p-3"
                                        >
                                            <div className="flex items-center gap-3 w-full">
                                                <ArrowLeft className="h-4 w-4 text-blue-500" />
                                                <div className="text-left flex-1">
                                                    <p className="font-medium text-sm">
                                                        {member.children.left.fullName || member.children.left.email.split("@")[0]}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">Hijo Izquierdo</p>
                                                </div>
                                            </div>
                                        </Button>
                                    )}

                                    {member.children?.right && (
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                onNavigateToUser(member.children!.right!.id);
                                                onClose();
                                            }}
                                            className="justify-start h-auto p-3"
                                        >
                                            <div className="flex items-center gap-3 w-full">
                                                <ArrowRight className="h-4 w-4 text-green-500" />
                                                <div className="text-left flex-1">
                                                    <p className="font-medium text-sm">
                                                        {member.children.right.fullName || member.children.right.email.split("@")[0]}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">Hijo Derecho</p>
                                                </div>
                                            </div>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Información adicional */}
                    <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Estadísticas</span>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                            <p>• Profundidad en la red: Nivel {member.depth}</p>
                            <p>• Posición: {member.position === "LEFT" ? "Izquierda" : member.position === "RIGHT" ? "Derecha" : "Raíz"}</p>
                            <p>• Estado: {member.isActive ? "Activo" : "Inactivo"}</p>
                            {hasChildren && (
                                <p>• Hijos directos: {(member.children?.left ? 1 : 0) + (member.children?.right ? 1 : 0)}</p>
                            )}
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}