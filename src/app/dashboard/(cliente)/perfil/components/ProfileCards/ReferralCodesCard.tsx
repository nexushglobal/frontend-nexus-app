"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    ArrowRight,
    Copy,
    ExternalLink,
    Gift,
    Link,
    Share,
    UserCircle
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
                toast.success(`Link de ${side} copiado`, {
                    description: "El enlace se ha copiado al portapapeles",
                    duration: 1500,
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
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <UserCircle className="h-5 w-5" />
                    Códigos de Referido
                </CardTitle>
            </CardHeader>
            <CardContent>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                >
                    <div className="bg-secondary/30 dark:bg-secondary/20 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Gift className="h-5 w-5 text-primary" />
                            <p className="text-sm font-medium">Enlaces de Referido</p>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4">
                            Selecciona el lado para referir nuevos miembros:
                        </p>

                        <Tabs
                            defaultValue="izquierda"
                            className="w-full"
                            onValueChange={setActiveTab}
                        >
                            <TabsList className="grid grid-cols-2 w-full mb-4">
                                <TabsTrigger
                                    value="izquierda"
                                    className="flex items-center gap-1"
                                >
                                    <ArrowLeft className="h-3.5 w-3.5" />
                                    <span>Izquierda</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="derecha"
                                    className="flex items-center gap-1"
                                >
                                    <span>Derecha</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="izquierda" className="space-y-3">
                                <div className="bg-primary/10 dark:bg-primary/5 rounded-md p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2 truncate flex-1">
                                        <Link className="h-4 w-4 flex-shrink-0 text-primary" />
                                        <span className="text-xs truncate">
                                            {getShareUrl("izquierda")}
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => copyToClipboard("izquierda")}
                                        className="flex-shrink-0"
                                        disabled={copying}
                                    >
                                        {copying ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full"
                                            />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant="outline"
                                        className="flex items-center gap-2 justify-center"
                                        onClick={() => shareReferral("izquierda")}
                                    >
                                        <Share className="h-4 w-4" />
                                        <span>Compartir</span>
                                    </Button>

                                    <Button
                                        variant="default"
                                        className="flex items-center gap-2 justify-center"
                                        onClick={() => openReferralLink("izquierda")}
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                        <span>Abrir link</span>
                                    </Button>
                                </div>
                            </TabsContent>

                            <TabsContent value="derecha" className="space-y-3">
                                <div className="bg-primary/10 dark:bg-primary/5 rounded-md p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2 truncate flex-1">
                                        <Link className="h-4 w-4 flex-shrink-0 text-primary" />
                                        <span className="text-xs truncate">
                                            {getShareUrl("derecha")}
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => copyToClipboard("derecha")}
                                        className="flex-shrink-0"
                                        disabled={copying}
                                    >
                                        {copying ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full"
                                            />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant="outline"
                                        className="flex items-center gap-2 justify-center"
                                        onClick={() => shareReferral("derecha")}
                                    >
                                        <Share className="h-4 w-4" />
                                        <span>Compartir</span>
                                    </Button>

                                    <Button
                                        variant="default"
                                        className="flex items-center gap-2 justify-center"
                                        onClick={() => openReferralLink("derecha")}
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                        <span>Abrir link</span>
                                    </Button>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </motion.div>
            </CardContent>
        </Card>
    );
}