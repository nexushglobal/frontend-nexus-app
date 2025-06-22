import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProfileData } from "@/types/profile.types";
import { Edit, User, Mail, IdCard, Calendar, Hash, AtSign } from "lucide-react";
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

    const getDocumentTypeLabel = (type: string) => {
        const types = {
            'DNI': 'Documento Nacional de Identidad',
            'CE': 'Carnet de Extranjería',
            'PAS': 'Pasaporte'
        };
        return types[type as keyof typeof types] || type;
    };

    const getGenderLabel = (gender: string) => {
        const genders = {
            'MASCULINO': 'Masculino',
            'FEMENINO': 'Femenino',
            'OTRO': 'Otro'
        };
        return genders[gender as keyof typeof genders] || gender;
    };

    const getCompletionPercentage = () => {
        let completed = 0;
        const total = 6;

        if (profile.email) completed++;
        if (profile.nickname) completed++;
        if (profile.personalInfo?.firstName) completed++;
        if (profile.personalInfo?.lastName) completed++;
        if (profile.personalInfo?.documentType) completed++;
        if (profile.personalInfo?.documentNumber) completed++;

        return Math.round((completed / total) * 100);
    };

    const completionPercentage = getCompletionPercentage();

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">Información Personal</CardTitle>
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
                <PersonalInfoModal
                    personalInfo={profile.personalInfo}
                    currentEmail={profile.email}
                    currentNickname={profile.nickname}
                    onUpdate={onUpdate}
                >
                    <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                    </Button>
                </PersonalInfoModal>
            </CardHeader>

            <CardContent className="space-y-4">
                {profile.personalInfo ? (
                    <>
                        {/* Grid compacto con toda la información */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {/* Email */}
                            <div className="flex items-center gap-2 p-2.5 rounded-lg border bg-card">
                                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground">Email</p>
                                    <p className="text-sm font-medium truncate">{profile.email}</p>
                                </div>
                            </div>

                            {/* Nickname */}
                            <div className="flex items-center gap-2 p-2.5 rounded-lg border bg-card">
                                <AtSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground">Nickname</p>
                                    {profile.nickname ? (
                                        <p className="text-sm font-medium">@{profile.nickname}</p>
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">No establecido</p>
                                    )}
                                </div>
                            </div>

                            {/* Nombres */}
                            <div className="flex items-center gap-2 p-2.5 rounded-lg border bg-card">
                                <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground">Nombres</p>
                                    <p className="text-sm font-medium">{profile.personalInfo.firstName}</p>
                                </div>
                            </div>

                            {/* Apellidos */}
                            <div className="flex items-center gap-2 p-2.5 rounded-lg border bg-card">
                                <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground">Apellidos</p>
                                    <p className="text-sm font-medium">{profile.personalInfo.lastName}</p>
                                </div>
                            </div>

                            {/* Documento */}
                            <div className="flex items-center gap-2 p-2.5 rounded-lg border bg-card">
                                <IdCard className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground">Documento</p>
                                    <div className="flex items-center gap-1.5">
                                        <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                                            {profile.personalInfo.documentType}
                                        </Badge>
                                        <span className="text-sm font-medium font-mono">
                                            {profile.personalInfo.documentNumber}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Género */}
                            <div className="flex items-center gap-2 p-2.5 rounded-lg border bg-card">
                                <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground">Género</p>
                                    <p className="text-sm font-medium">{getGenderLabel(profile.personalInfo.gender)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Fecha de nacimiento en una fila separada por ser más larga */}
                        <div className="flex items-center gap-2 p-2.5 rounded-lg border bg-card">
                            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground">Fecha de Nacimiento</p>
                                <p className="text-sm font-medium">{formatDate(profile.personalInfo.birthdate)}</p>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <div className="p-4 rounded-full bg-muted/30 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <User className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h4 className="font-medium text-foreground mb-2">
                            Información Personal Incompleta
                        </h4>
                        <p className="text-sm text-muted-foreground mb-4">
                            Completa tu información personal para tener un perfil más completo
                        </p>
                        <PersonalInfoModal
                            personalInfo={profile.personalInfo}
                            currentEmail={profile.email}
                            currentNickname={profile.nickname}
                            onUpdate={onUpdate}
                        >
                            <Button>
                                <Edit className="h-4 w-4 mr-2" />
                                Completar Información
                            </Button>
                        </PersonalInfoModal>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}