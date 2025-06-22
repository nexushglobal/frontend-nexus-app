import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BillingInfo } from "@/types/profile.types";
import { Building, Edit, MapPin, Receipt } from "lucide-react";
import { BillingInfoModal } from "../modal/BillingInfoModal";
import { SectionHeader } from "@/components/common/card/SectionHeader";
import { ProfileInfoField } from "@/components/common/field/ProfileInfoField";
import { InfoCard } from "@/components/common/card/InfoCard";

interface BillingInfoCardProps {
    billingInfo: BillingInfo | null;
    onUpdate: () => void;
}

export function BillingInfoCard({ billingInfo, onUpdate }: BillingInfoCardProps) {
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
            <SectionHeader
                title="Información de Facturación"
                icon={Receipt}
                completionPercentage={completionPercentage}
                showProgress={true}
                actionButton={
                    <BillingInfoModal billingInfo={billingInfo} onUpdate={onUpdate}>
                        <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                        </Button>
                    </BillingInfoModal>
                }
            />

            <CardContent className="space-y-4">
                {billingInfo ? (
                    <>
                        <div className="space-y-3">
                            <ProfileInfoField
                                label="RUC"
                                value={billingInfo.ruc || "No especificado"}
                                icon={Receipt}
                                isComplete={!!billingInfo.ruc}
                                className="font-mono"
                            />

                            <ProfileInfoField
                                label="Razón Social"
                                value={billingInfo.razonSocial || "No especificada"}
                                icon={Building}
                                isComplete={!!billingInfo.razonSocial}
                            />

                            <ProfileInfoField
                                label="Dirección Fiscal"
                                value={billingInfo.address || "No especificada"}
                                icon={MapPin}
                                isComplete={!!billingInfo.address}
                            />
                        </div>

                        {billingInfo.ruc && (
                            <InfoCard
                                title="Facturación empresarial"
                                icon="📄"
                                variant="default"
                                items={["Esta información será utilizada para generar facturas y comprobantes fiscales."]}
                            />
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