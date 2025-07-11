import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentDetailResponse } from "../../actions";
import {
    FileText,
    Info,
    Database,
    Key
} from "lucide-react";

interface MetadataSectionProps {
    payment: PaymentDetailResponse;
}

export function MetadataSection({ payment }: MetadataSectionProps) {
    const metadataEntries = Object.entries(payment.metadata || {});

    const formatKey = (key: string) => {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/_/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const formatValue = (value: any) => {
        if (value === null || value === undefined) {
            return 'Sin valor';
        }

        if (typeof value === 'boolean') {
            return value ? 'Sí' : 'No';
        }

        if (typeof value === 'object') {
            return JSON.stringify(value, null, 2);
        }

        return String(value);
    };

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary/10">
                        <Database className="h-5 w-5 text-secondary" />
                    </div>
                    Metadatos Adicionales
                </CardTitle>
            </CardHeader>
            <CardContent>
                {metadataEntries.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <div className="p-4 rounded-full bg-muted/30 w-fit mx-auto mb-4">
                            <Info className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                        <h3 className="font-medium text-foreground mb-1">Sin metadatos</h3>
                        <p className="text-sm">No hay información adicional asociada a este pago</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {metadataEntries.map(([key, value], index) => {
                            const formattedValue = formatValue(value);
                            const isObject = typeof value === 'object' && value !== null;

                            return (
                                <div key={index} className="info-field-start">
                                    <div className="p-2 rounded-lg bg-accent/10">
                                        <Key className="field-icon text-accent" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="section-title mb-2">
                                            {formatKey(key)}
                                        </p>

                                        <div className={`${isObject ? 'font-mono text-xs' : 'text-sm'} text-foreground bg-muted/50 px-3 py-2 rounded-md border`}>
                                            {isObject ? (
                                                <pre className="whitespace-pre-wrap text-xs">
                                                    {formattedValue}
                                                </pre>
                                            ) : (
                                                <p className="break-words">
                                                    {formattedValue}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}