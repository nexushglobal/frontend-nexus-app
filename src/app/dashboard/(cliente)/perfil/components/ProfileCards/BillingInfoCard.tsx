import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BillingInfo } from "@/types/profile.types";
import { Building, Edit, MapPin, Receipt } from "lucide-react";
import { BillingInfoModal } from "../modal/BillingInfoModal";

interface Props {
    billingInfo: BillingInfo | null;
    onUpdate: () => void;
}

export function BillingInfoCard({ billingInfo, onUpdate }: Props) {
    const getCompletionPercentage = () => {
        if (!billingInfo) return 0;

        let completed = 0;
        const total = 3;

        if (billingInfo.ruc) completed++;
        if (billingInfo.razonSocial) completed++;
        if (billingInfo.address) completed++;

        return Math.round((completed / total) * 100);
    };

    const completionPercentage = getCompletionPercentage();

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <Receipt className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">Información de Facturación</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="h-1.5 w-20 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary rounded-full transition-all duration-500"
                                    style={{ width: `${completionPercentage}%` }}
                                />
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {completionPercentage}% completo
                            </span>
                        </div>
                    </div>
                </div>
                <BillingInfoModal billingInfo={billingInfo} onUpdate={onUpdate}>
                    <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                    </Button>
                </BillingInfoModal>
            </CardHeader>

            <CardContent className="space-y-4">
                {billingInfo ? (
                    <>
                        {/* Información de facturación en layout compacto */}
                        <div className="space-y-3">
                            {/* RUC */}
                            <div className="flex items-center gap-2 p-2.5 rounded-lg border bg-card">
                                <Receipt className="h-4 w-4 text-primary flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground">RUC</p>
                                    {billingInfo.ruc ? (
                                        <p className="text-sm font-medium font-mono">{billingInfo.ruc}</p>
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">No especificado</p>
                                    )}
                                </div>
                            </div>

                            {/* Razón Social */}
                            <div className="flex items-center gap-2 p-2.5 rounded-lg border bg-card">
                                <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground">Razón Social</p>
                                    {billingInfo.razonSocial ? (
                                        <p className="text-sm font-medium">{billingInfo.razonSocial}</p>
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">No especificada</p>
                                    )}
                                </div>
                            </div>

                            {/* Dirección Fiscal */}
                            <div className="flex items-center gap-2 p-2.5 rounded-lg border bg-card">
                                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground">Dirección Fiscal</p>
                                    {billingInfo.address ? (
                                        <p className="text-sm font-medium">{billingInfo.address}</p>
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">No especificada</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Nota informativa */}
                        {billingInfo.ruc && (
                            <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                                <p className="text-xs text-muted-foreground">
                                    📄 <strong>Facturación empresarial:</strong> Esta información será utilizada para generar facturas y comprobantes fiscales.
                                </p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-8">
                        <div className="p-4 rounded-full bg-muted/30 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <Receipt className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h4 className="font-medium text-foreground mb-2">
                            Información de Facturación No Configurada
                        </h4>
                        <p className="text-sm text-muted-foreground mb-4">
                            Configura tu información de facturación para recibir comprobantes
                        </p>
                        <BillingInfoModal billingInfo={billingInfo} onUpdate={onUpdate}>
                            <Button>
                                <Edit className="h-4 w-4 mr-2" />
                                Configurar Facturación
                            </Button>
                        </BillingInfoModal>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}