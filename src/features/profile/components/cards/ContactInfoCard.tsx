import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/features/shared/components/card/SectionHeader";
import { Edit, Globe, Mail, MapPin, Phone } from "lucide-react";
import { ContactInfo } from "../../types/profile.types";
import { ProfileInfoField } from "../field/ProfileInfoField";
import { ContactInfoModal } from "../modals/ContactInfoModal";

interface ContactInfoCardProps {
    contactInfo: ContactInfo | null;
    onUpdate: () => void;
    isUpdating?: boolean;
}

export function ContactInfoCard({ contactInfo, onUpdate, isUpdating = false }: ContactInfoCardProps) {
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
            <SectionHeader
                title="Información de Contacto"
                icon={Phone}
                completionPercentage={completionPercentage}
                showProgress={true}
                actionButton={
                    <ContactInfoModal contactInfo={contactInfo} onUpdate={onUpdate} isUpdating={isUpdating}>
                        <Button size="sm" variant="outline" disabled={isUpdating}>
                            <Edit className="h-4 w-4 mr-2" />
                            {isUpdating ? 'Actualizando...' : 'Editar'}
                        </Button>
                    </ContactInfoModal>
                }
            />

            <CardContent className="space-y-4">
                {contactInfo ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <ProfileInfoField
                                label="Teléfono"
                                value={contactInfo.phone}
                                icon={Phone}
                                isComplete={true}
                                showStatus={true}
                            />

                            <ProfileInfoField
                                label="País"
                                value={contactInfo.country}
                                icon={Globe}
                                isComplete={true}
                                showStatus={true}
                            />

                            <ProfileInfoField
                                label="Dirección"
                                value={contactInfo.address || "No especificada"}
                                icon={MapPin}
                                isComplete={!!contactInfo.address}
                                showStatus={true}
                            />

                            <ProfileInfoField
                                label="Código Postal"
                                value={contactInfo.postalCode || "No especificado"}
                                icon={Mail}
                                isComplete={!!contactInfo.postalCode}
                                showStatus={true}
                                className="font-mono"
                            />
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