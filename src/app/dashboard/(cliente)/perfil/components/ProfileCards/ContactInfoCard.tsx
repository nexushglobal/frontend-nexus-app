import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactInfo } from "@/types/profile.types";
import { Edit, FileText, Globe, MapPin, Phone } from "lucide-react";
import { ContactInfoModal } from "../modal/ContactInfoModal";

interface Props {
    contactInfo: ContactInfo | null;
    onUpdate: () => void;
}

export function ContactInfoCard({ contactInfo, onUpdate }: Props) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Información de Contacto
                </CardTitle>
                <ContactInfoModal contactInfo={contactInfo} onUpdate={onUpdate}>
                    <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                    </Button>
                </ContactInfoModal>
            </CardHeader>
            <CardContent className="space-y-4">
                {contactInfo ? (
                    <>
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{contactInfo.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <span>{contactInfo.country}</span>
                        </div>
                        {contactInfo.address && (
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{contactInfo.address}</span>
                            </div>
                        )}
                        {contactInfo.postalCode && (
                            <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span>{contactInfo.postalCode}</span>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-muted-foreground">No hay información de contacto</p>
                )}
            </CardContent>
        </Card>
    );
}