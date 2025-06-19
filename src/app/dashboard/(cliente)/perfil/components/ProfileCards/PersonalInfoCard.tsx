import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PersonalInfo } from "@/types/profile.types";
import { User } from "lucide-react";

interface PersonalInfoCardProps {
    personalInfo: PersonalInfo | null;
}

export function PersonalInfoCard({ personalInfo }: PersonalInfoCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Información Personal
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {personalInfo ? (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Nombre</p>
                                <p className="font-medium">{personalInfo.firstName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Apellidos</p>
                                <p className="font-medium">{personalInfo.lastName}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Documento</p>
                                <p className="font-medium">{personalInfo.documentType}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Número</p>
                                <p className="font-medium">{personalInfo.documentNumber}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Género</p>
                                <p className="font-medium">{personalInfo.gender}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Fecha de Nacimiento</p>
                                <p className="font-medium">{formatDate(personalInfo.birthdate)}</p>
                            </div>
                        </div>
                    </>
                ) : (
                    <p className="text-muted-foreground">No hay información personal disponible</p>
                )}
            </CardContent>
        </Card>
    );
}