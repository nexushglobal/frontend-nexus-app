import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactInfo } from "@/types/profile.types";
import { Edit, Phone, Globe, MapPin, Mail } from "lucide-react";
import { ContactInfoModal } from "../modal/ContactInfoModal";

interface Props {
    contactInfo: ContactInfo | null;
    onUpdate: () => void;
}

export function ContactInfoCard({ contactInfo, onUpdate }: Props) {
    const getCompletionPercentage = () => {
        if (!contactInfo) return 0;

        let completed = 0;
        const total = 4;

        if (contactInfo.phone) completed++;
        if (contactInfo.country) completed++;
        if (contactInfo.address) completed++;
        if (contactInfo.postalCode) completed++;

        return Math.round((completed / total) * 100);
    };

    const completionPercentage = getCompletionPercentage();

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">Información de Contacto</CardTitle>
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
                <ContactInfoModal contactInfo={contactInfo} onUpdate={onUpdate}>
                    <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                    </Button>
                </ContactInfoModal>
            </CardHeader>

            <CardContent className="space-y-4">
                {contactInfo ? (
                    <>
                        {/* Grid compacto con información de contacto */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* Teléfono - Campo requerido */}
                            <div className="flex items-center gap-2 p-2.5 rounded-lg border bg-card">
                                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground">Teléfono</p>
                                    <p className="text-sm font-medium">{contactInfo.phone}</p>
                                </div>
                            </div>

                            {/* País - Campo requerido */}
                            <div className="flex items-center gap-2 p-2.5 rounded-lg border bg-card">
                                <Globe className="h-4 w-4 text-primary flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground">País</p>
                                    <p className="text-sm font-medium">{contactInfo.country}</p>
                                </div>
                            </div>

                            {/* Dirección - Campo opcional */}
                            <div className="flex items-center gap-2 p-2.5 rounded-lg border bg-card">
                                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground">Dirección</p>
                                    {contactInfo.address ? (
                                        <p className="text-sm font-medium">{contactInfo.address}</p>
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">No especificada</p>
                                    )}
                                </div>
                            </div>

                            {/* Código Postal - Campo opcional */}
                            <div className="flex items-center gap-2 p-2.5 rounded-lg border bg-card">
                                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground">Código Postal</p>
                                    {contactInfo.postalCode ? (
                                        <p className="text-sm font-medium font-mono">{contactInfo.postalCode}</p>
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">No especificado</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <div className="p-4 rounded-full bg-muted/30 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <Phone className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h4 className="font-medium text-foreground mb-2">
                            Información de Contacto Incompleta
                        </h4>
                        <p className="text-sm text-muted-foreground mb-4">
                            Agrega tu información de contacto para mantenernos comunicados
                        </p>
                        <ContactInfoModal contactInfo={contactInfo} onUpdate={onUpdate}>
                            <Button>
                                <Edit className="h-4 w-4 mr-2" />
                                Agregar Información
                            </Button>
                        </ContactInfoModal>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}