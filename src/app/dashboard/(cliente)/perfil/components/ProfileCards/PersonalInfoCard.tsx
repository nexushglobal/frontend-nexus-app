import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PersonalInfo } from "@/types/profile.types";
import { Edit, User } from "lucide-react";
import { PersonalInfoModal } from "../modal/PersonalInfoModal";

interface PersonalInfoCardProps {
    personalInfo: PersonalInfo | null;
    currentEmail: string;
    currentNickname?: string | null;
    onUpdate: () => void;
}

export function PersonalInfoCard({
    personalInfo,
    currentEmail,
    currentNickname,
    onUpdate
}: PersonalInfoCardProps) {
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
                <PersonalInfoModal
                    personalInfo={personalInfo}
                    currentEmail={currentEmail}
                    currentNickname={currentNickname}
                    onUpdate={onUpdate}
                >
                    <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                    </Button>
                </PersonalInfoModal>
            </CardHeader>
            <CardContent className="space-y-4">
                {personalInfo ? (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="font-medium">{currentEmail}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Nickname</p>
                                <p className="font-medium">{currentNickname || "No establecido"}</p>
                            </div>
                        </div>
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
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="font-medium">{currentEmail}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Nickname</p>
                                <p className="font-medium">{currentNickname || "No establecido"}</p>
                            </div>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Información personal básica no completada
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}