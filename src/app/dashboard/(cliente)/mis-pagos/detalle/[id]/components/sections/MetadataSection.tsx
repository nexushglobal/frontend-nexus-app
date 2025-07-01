import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentDetailResponse } from "../../actions";
import { FileText, Info } from "lucide-react";

interface MetadataSectionProps {
    payment: PaymentDetailResponse;
}

export function MetadataSection({ payment }: MetadataSectionProps) {
    const metadataEntries = Object.entries(payment.metadata || {});

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Metadatos Adicionales
                </CardTitle>
            </CardHeader>
            <CardContent>
                {metadataEntries.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <Info className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No hay metadatos adicionales para este pago</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {metadataEntries.map(([key, value], index) => (
                            <div key={index} className="flex justify-between items-start p-3 bg-muted/50 rounded-lg">
                                <div className="flex-1">
                                    <label className="text-sm font-medium text-muted-foreground capitalize">
                                        {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}
                                    </label>
                                    <p className="text-sm mt-1">
                                        {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}