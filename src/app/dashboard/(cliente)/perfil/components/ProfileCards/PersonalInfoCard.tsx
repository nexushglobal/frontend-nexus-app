import { SectionHeader } from "@/components/common/card/SectionHeader";
import { ProfileInfoField } from "@/components/common/field/ProfileInfoField";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileData } from "@/types/profile.types";
import { AtSign, Calendar, Edit, IdCard, Mail, User } from "lucide-react";
import { PersonalInfoModal } from "../modal/PersonalInfoModal";

interface PersonalInfoCardProps {
    profile: ProfileData;
    onUpdate: () => void;
}

export function PersonalInfoCard({ profile, onUpdate }: PersonalInfoCardProps) {
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
            <SectionHeader
                title="Información Personal"
                icon={User}
                completionPercentage={completionPercentage}
                showProgress={true}
                actionButton={
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
                }
            />

            <CardContent className="space-y-4">
                {profile.personalInfo ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            <ProfileInfoField
                                label="Email"
                                value={profile.email}
                                icon={Mail}
                                isComplete={true}
                                showStatus={true}
                            />

                            <ProfileInfoField
                                label="Nickname"
                                value={profile.nickname ? `@${profile.nickname}` : "No establecido"}
                                icon={AtSign}
                                isComplete={!!profile.nickname}
                                showStatus={true}
                            />

                            <ProfileInfoField
                                label="Nombres"
                                value={profile.personalInfo.firstName}
                                icon={User}
                                isComplete={true}
                                showStatus={true}
                            />

                            <ProfileInfoField
                                label="Apellidos"
                                value={profile.personalInfo.lastName}
                                icon={User}
                                isComplete={true}
                                showStatus={true}
                            />

                            <div className="flex items-center gap-2 p-2.5 rounded-lg border bg-card">
                                <IdCard className="h-4 w-4 text-primary flex-shrink-0" />
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

                            <ProfileInfoField
                                label="Género"
                                value={getGenderLabel(profile.personalInfo.gender)}
                                icon={User}
                                isComplete={true}
                                showStatus={true}
                            />
                        </div>

                        <ProfileInfoField
                            label="Fecha de Nacimiento"
                            value={formatDate(profile.personalInfo.birthdate)}
                            icon={Calendar}
                            isComplete={true}
                            showStatus={true}
                        />
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