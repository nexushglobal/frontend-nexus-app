import { InfoCard } from "@/components/common/card/InfoCard";
import { SectionHeader } from "@/components/common/card/SectionHeader";
import { ProfileInfoField } from "@/components/common/field/ProfileInfoField";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Edit, Lock, Shield } from "lucide-react";
import { ChangePasswordModal } from "../modal/ChangePasswordModal";

interface SecurityCardProps {
    onUpdate: () => void;
}

export function SecurityCard({ onUpdate }: SecurityCardProps) {
    // Simulamos la última actualización de contraseña (esto vendría del backend)
    const lastPasswordUpdate = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000); // 60 días atrás

    const formatLastUpdate = (date: Date) => {
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return "Hace 1 día";
        if (diffDays < 30) return `Hace ${diffDays} días`;
        if (diffDays < 60) return "Hace 1 mes";

        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getPasswordStrengthInfo = () => {
        const daysSinceUpdate = Math.ceil(Math.abs(new Date().getTime() - lastPasswordUpdate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysSinceUpdate > 90) {
            return {
                status: "Actualización recomendada",
                color: "text-warning",
                bgColor: "bg-warning/10",
                description: "Se recomienda cambiar tu contraseña periódicamente",
                variant: "warning" as const
            };
        } else if (daysSinceUpdate > 180) {
            return {
                status: "Actualización necesaria",
                color: "text-destructive",
                bgColor: "bg-destructive/10",
                description: "Tu contraseña no se ha actualizado en mucho tiempo",
                variant: "destructive" as const
            };
        } else {
            return {
                status: "Segura y actualizada",
                color: "text-success",
                bgColor: "bg-success/10",
                description: "Tu contraseña está en buen estado",
                variant: "success" as const
            };
        }
    };

    const passwordInfo = getPasswordStrengthInfo();

    return (
        <Card>
            <SectionHeader
                title="Seguridad de la Cuenta"
                icon={Shield}
                actionButton={
                    <ChangePasswordModal onUpdate={onUpdate}>
                        <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-2" />
                            Cambiar
                        </Button>
                    </ChangePasswordModal>
                }
            />

            <CardContent className="space-y-4">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 p-2.5 rounded-lg border bg-card">
                        <Lock className="h-4 w-4 text-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground">Contraseña</p>
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-medium font-mono">••••••••••••</p>
                                <span className={`text-xs px-1.5 py-0.5 rounded ${passwordInfo.bgColor} ${passwordInfo.color}`}>
                                    {passwordInfo.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <ProfileInfoField
                        label="Última actualización"
                        value={formatLastUpdate(lastPasswordUpdate)}
                        icon={Calendar}
                        isComplete={true}
                    />
                </div>

                <InfoCard
                    title="Seguridad"
                    icon="🔒"
                    variant={passwordInfo.variant}
                    items={[passwordInfo.description]}
                />

                <InfoCard
                    title="Recomendaciones de seguridad"
                    icon="💡"
                    variant="info"
                    items={[
                        "Cambia tu contraseña cada 3-6 meses",
                        "Usa una combinación de letras, números y símbolos",
                        "Evita usar información personal en tu contraseña",
                        "No compartas tu contraseña con nadie"
                    ]}
                />
            </CardContent>
        </Card>
    );
}