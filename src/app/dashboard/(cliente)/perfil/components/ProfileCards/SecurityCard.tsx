import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Shield, Lock, Calendar } from "lucide-react";
import { ChangePasswordModal } from "../modal/ChangePasswordModal";

interface Props {
    onUpdate: () => void;
}

export function SecurityCard({ onUpdate }: Props) {
    // Simulamos la última actualización de contraseña (esto vendría del backend)
    const lastPasswordUpdate = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000); // 30 días atrás

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
                description: "Se recomienda cambiar tu contraseña periódicamente"
            };
        } else if (daysSinceUpdate > 180) {
            return {
                status: "Actualización necesaria",
                color: "text-destructive",
                bgColor: "bg-destructive/10",
                description: "Tu contraseña no se ha actualizado en mucho tiempo"
            };
        } else {
            return {
                status: "Segura y actualizada",
                color: "text-success",
                bgColor: "bg-success/10",
                description: "Tu contraseña está en buen estado"
            };
        }
    };

    const passwordInfo = getPasswordStrengthInfo();

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">Seguridad de la Cuenta</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                            <div className={`px-2 py-1 rounded-md text-xs font-medium ${passwordInfo.bgColor} ${passwordInfo.color}`}>
                                {passwordInfo.status}
                            </div>
                        </div>
                    </div>
                </div>
                <ChangePasswordModal onUpdate={onUpdate}>
                    <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Cambiar
                    </Button>
                </ChangePasswordModal>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Información de la contraseña */}
                <div className="space-y-3">
                    {/* Estado de la contraseña */}
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

                    {/* Última actualización */}
                    <div className="flex items-center gap-2 p-2.5 rounded-lg border bg-card">
                        <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground">Última actualización</p>
                            <p className="text-sm font-medium">{formatLastUpdate(lastPasswordUpdate)}</p>
                        </div>
                    </div>
                </div>

                {/* Información de seguridad */}
                <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                    <p className="text-xs text-muted-foreground">
                        🔒 <strong>Seguridad:</strong> {passwordInfo.description}
                    </p>
                </div>

                {/* Recomendaciones de seguridad */}
                <div className="bg-info/5 border border-info/20 rounded-lg p-3">
                    <h4 className="text-xs font-semibold text-info uppercase tracking-wide mb-2">
                        💡 Recomendaciones de seguridad
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Cambia tu contraseña cada 3-6 meses</li>
                        <li>• Usa una combinación de letras, números y símbolos</li>
                        <li>• Evita usar información personal en tu contraseña</li>
                        <li>• No compartas tu contraseña con nadie</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}