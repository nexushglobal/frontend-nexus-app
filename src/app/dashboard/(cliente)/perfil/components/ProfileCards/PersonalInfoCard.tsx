import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileData } from "@/types/profile.types";
import { Edit, User } from "lucide-react";
import { PersonalInfoModal } from "../modal/PersonalInfoModal";

interface Props {
    profile: ProfileData
    onUpdate: () => void
}

export function PersonalInfoCard({
    profile, onUpdate
}: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Información Personal
                </CardTitle>
                <PersonalInfoModal
                    personalInfo={profile.personalInfo}
                    currentEmail={profile.email}
                    currentNickname={profile.nickname}
                    onUpdate={onUpdate}
                >
                    <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                    </Button>
                </PersonalInfoModal>
            </CardHeader>
            <CardContent className="space-y-4">
                {profile.personalInfo ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Nombres</p>
                            <p className="font-medium">{profile.personalInfo.firstName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Apellidos</p>
                            <p className="font-medium">{profile.personalInfo.lastName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Tipo de Documento</p>
                            <p className="font-medium">{profile.personalInfo.documentType}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Número</p>
                            <p className="font-medium">{profile.personalInfo.documentNumber}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Género</p>
                            <p className="font-medium">{profile.personalInfo.gender}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Fecha de Nacimiento</p>
                            <p className="font-medium">{formatDate(profile.personalInfo.birthdate)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{profile.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Nickname</p>
                            <p className="font-medium">{profile.nickname || "No establecido"}</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="font-medium">{profile.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Nickname</p>
                                <p className="font-medium">{profile.nickname || "No establecido"}</p>
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