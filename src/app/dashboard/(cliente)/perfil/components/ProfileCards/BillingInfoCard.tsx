import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BillingInfo } from "@/types/profile.types";
import { Building, Edit, MapPin, Receipt } from "lucide-react";
import { BillingInfoModal } from "../modal/BillingInfoModal";

interface BillingInfoCardProps {
    billingInfo: BillingInfo | null;
    onUpdate: () => void;
}

export function BillingInfoCard({ billingInfo, onUpdate }: BillingInfoCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5" />
                    Información de Facturación
                </CardTitle>
                <BillingInfoModal billingInfo={billingInfo} onUpdate={onUpdate}>
                    <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                    </Button>
                </BillingInfoModal>
            </CardHeader>
            <CardContent className="space-y-4">
                {billingInfo ? (
                    <>
                        {billingInfo.ruc && (
                            <div className="flex items-center gap-2">
                                <Receipt className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{billingInfo.ruc}</span>
                            </div>
                        )}
                        {billingInfo.razonSocial && (
                            <div className="flex items-center gap-2">
                                <Building className="h-4 w-4 text-muted-foreground" />
                                <span>{billingInfo.razonSocial}</span>
                            </div>
                        )}
                        {billingInfo.address && (
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{billingInfo.address}</span>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-muted-foreground">No hay información de facturación</p>
                )}
            </CardContent>
        </Card>
    );
}