"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
    ArrowLeft,
    ArrowRight,
    Copy,
    ExternalLink,
    Link as LinkIcon,
    Share,
    Share2
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ReferralCodesCardProps {
    referralCode: string;
}

export function ReferralCodesCard({
    referralCode,
}: ReferralCodesCardProps) {
    const [activeTab, setActiveTab] = useState<string>("izquierda");
    const [copying, setCopying] = useState(false);

    const getShareUrl = (side: string) => {
        return `${window.location.origin}/register/${referralCode}?lado=${side}`;
    };

    const copyToClipboard = (side: string) => {
        setCopying(true);
        const url = getShareUrl(side);

        navigator.clipboard
            .writeText(url)
            .then(() => {
                toast.success(`Enlace copiado`, {
                    description: `Link del lado ${side} copiado al portapapeles`,
                    duration: 2000,
                });
                setTimeout(() => setCopying(false), 1500);
            })
            .catch((err) => {
                toast.error("Error al copiar", {
                    description: "No se pudo copiar el enlace al portapapeles",
                });
                setCopying(false);
            });
    };

    const shareReferral = (side: string) => {
        const url = getShareUrl(side);
        const title = `Únete a mi equipo (${side})`;
        const text = `Únete a mi organización usando mi código de referido: ${referralCode} (lado ${side})`;

        if (navigator.share) {
            navigator
                .share({
                    title,
                    text,
                    url,
                })
                .catch((error) => {
                    toast.error("Error al compartir", {
                        description: "No se pudo compartir el enlace",
                    });
                });
        } else {
            copyToClipboard(side);
        }
    };

    const openReferralLink = (side: string) => {
        const url = getShareUrl(side);
        window.open(url, "_blank");
    };

    return (
        <Card>
            <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <Share2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">Códigos de Referido</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            Comparte tus enlaces para referir nuevos miembros
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Código de referido principal */}
                <div className="flex items-center gap-2 p-2.5 rounded-lg border bg-card">
                    <Share2 className="h-4 w-4 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">Tu Código de Referido</p>
                        <p className="text-sm font-medium font-mono">{referralCode}</p>
                    </div>
                </div>

                {/* Tabs mejorados para mejor visibilidad en modo oscuro */}
                <div className="w-full">
                    {/* Custom TabsList */}
                    <div className="inline-flex w-full rounded-md bg-muted p-1 text-muted-foreground dark:bg-gray-800/50">
                        {/* Custom TabsTrigger para Izquierda */}
                        <button
                            onClick={() => setActiveTab("izquierda")}
                            className={cn(
                                "flex items-center justify-center gap-2 flex-1 rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all relative",
                                activeTab === "izquierda"
                                    ? "bg-background text-foreground shadow-sm dark:bg-gray-700 dark:text-primary-foreground dark:shadow-[0_0_0_1px_rgba(var(--primary),0.2)]"
                                    : "hover:bg-muted/80 hover:text-foreground"
                            )}
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            <span>Izquierda</span>

                            {/* Indicador visual para el tab activo */}
                            {activeTab === "izquierda" && (
                                <span className="absolute -bottom-0 left-1/2 -translate-x-1/2 w-1/4 h-0.5 bg-primary rounded-full dark:bg-primary dark:shadow-[0_0_5px_rgba(var(--primary),0.8)]" />
                            )}
                        </button>

                        {/* Custom TabsTrigger para Derecha */}
                        <button
                            onClick={() => setActiveTab("derecha")}
                            className={cn(
                                "flex items-center justify-center gap-2 flex-1 rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all relative",
                                activeTab === "derecha"
                                    ? "bg-background text-foreground shadow-sm dark:bg-gray-700 dark:text-primary-foreground dark:shadow-[0_0_0_1px_rgba(var(--primary),0.2)]"
                                    : "hover:bg-muted/80 hover:text-foreground"
                            )}
                        >
                            <span>Derecha</span>
                            <ArrowRight className="h-3.5 w-3.5" />

                            {/* Indicador visual para el tab activo */}
                            {activeTab === "derecha" && (
                                <span className="absolute -bottom-0 left-1/2 -translate-x-1/2 w-1/4 h-0.5 bg-primary rounded-full dark:bg-primary dark:shadow-[0_0_5px_rgba(var(--primary),0.8)]" />
                            )}
                        </button>
                    </div>

                    {/* Content panel for active tab */}
                    <div className="mt-4">
                        {/* Contenido para Izquierda */}
                        {activeTab === "izquierda" && (
                            <div className="space-y-3 animate-in fade-in-50 duration-300">
                                {/* URL del lado izquierdo */}
                                <div className="flex items-center gap-2 p-2.5 rounded-lg border bg-card">
                                    <LinkIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-muted-foreground">Enlace de Referido - Izquierda</p>
                                        <p className="text-xs text-muted-foreground font-mono truncate">
                                            {getShareUrl("izquierda")}
                                        </p>
                                    </div>
                                </div>

                                {/* Botones de acción */}
                                <div className="grid grid-cols-3 gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => copyToClipboard("izquierda")}
                                        disabled={copying}
                                        className="flex items-center gap-1.5"
                                    >
                                        <Copy className="h-3.5 w-3.5" />
                                        Copiar
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => shareReferral("izquierda")}
                                        className="flex items-center gap-1.5"
                                    >
                                        <Share className="h-3.5 w-3.5" />
                                        Compartir
                                    </Button>

                                    <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => openReferralLink("izquierda")}
                                        className="flex items-center gap-1.5"
                                    >
                                        <ExternalLink className="h-3.5 w-3.5" />
                                        Abrir
                                    </Button>
                                </div>
                            </div>
                        )}

                        {activeTab === "derecha" && (
                            <div className="space-y-3 animate-in fade-in-50 duration-300">
                                {/* URL del lado derecho */}
                                <div className="flex items-center gap-2 p-2.5 rounded-lg border bg-card">
                                    <LinkIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-muted-foreground">Enlace de Referido - Derecha</p>
                                        <p className="text-xs text-muted-foreground font-mono truncate">
                                            {getShareUrl("derecha")}
                                        </p>
                                    </div>
                                </div>

                                {/* Botones de acción */}
                                <div className="grid grid-cols-3 gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => copyToClipboard("derecha")}
                                        disabled={copying}
                                        className="flex items-center gap-1.5"
                                    >
                                        <Copy className="h-3.5 w-3.5" />
                                        Copiar
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => shareReferral("derecha")}
                                        className="flex items-center gap-1.5"
                                    >
                                        <Share className="h-3.5 w-3.5" />
                                        Compartir
                                    </Button>

                                    <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => openReferralLink("derecha")}
                                        className="flex items-center gap-1.5"
                                    >
                                        <ExternalLink className="h-3.5 w-3.5" />
                                        Abrir
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Nota informativa */}
                <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                    <p className="text-xs text-muted-foreground">
                        💡 <strong>Tip:</strong> Utiliza diferentes lados para organizar tu red de referidos de manera equilibrada.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}