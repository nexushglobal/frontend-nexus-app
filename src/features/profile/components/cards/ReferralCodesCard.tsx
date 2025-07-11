"use client";

import { InfoCard } from "@/components/common/card/InfoCard";
import { SectionHeader } from "@/components/common/card/SectionHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { ProfileInfoField } from "../field/ProfileInfoField";

interface ReferralCodesCardProps {
    referralCode: string;
}

export function ReferralCodesCard({ referralCode }: ReferralCodesCardProps) {
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
            <SectionHeader
                title="Códigos de Referido"
                icon={Share2}
            />

            <CardContent className="space-y-4">
                <ProfileInfoField
                    label="Tu Código de Referido"
                    value={referralCode}
                    icon={Share2}
                    isComplete={true}
                    className="font-mono"
                />

                <div className="w-full">
                    <div className="inline-flex w-full rounded-md bg-muted p-1 text-muted-foreground dark:bg-gray-800/50">
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

                            {activeTab === "izquierda" && (
                                <span className="absolute -bottom-0 left-1/2 -translate-x-1/2 w-1/4 h-0.5 bg-primary rounded-full dark:bg-primary dark:shadow-[0_0_5px_rgba(var(--primary),0.8)]" />
                            )}
                        </button>

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

                            {activeTab === "derecha" && (
                                <span className="absolute -bottom-0 left-1/2 -translate-x-1/2 w-1/4 h-0.5 bg-primary rounded-full dark:bg-primary dark:shadow-[0_0_5px_rgba(var(--primary),0.8)]" />
                            )}
                        </button>
                    </div>

                    <div className="mt-4">
                        {activeTab === "izquierda" && (
                            <div className="space-y-3 animate-in fade-in-50 duration-300">
                                <ProfileInfoField
                                    label="Enlace de Referido - Izquierda"
                                    value={getShareUrl("izquierda")}
                                    icon={LinkIcon}
                                    isComplete={true}
                                    className="text-xs font-mono"
                                />

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
                                <ProfileInfoField
                                    label="Enlace de Referido - Derecha"
                                    value={getShareUrl("derecha")}
                                    icon={LinkIcon}
                                    isComplete={true}
                                    className="text-xs font-mono"
                                />

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

                <InfoCard
                    title="Tip"
                    icon="💡"
                    variant="info"
                    items={["Utiliza diferentes lados para organizar tu red de referidos de manera equilibrada."]}
                />
            </CardContent>
        </Card>
    );
}