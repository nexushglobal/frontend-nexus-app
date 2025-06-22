import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileData } from "@/types/profile.types";
import { FileText, Share2, User } from "lucide-react";

interface Props {
    profile: ProfileData
}

export function OverviewSection({ profile }: Props) {
    const getCompletionPercentage = () => {
        let completedFields = 0;
        const totalFields = 7;

        if (profile.personalInfo) completedFields++;
        if (profile.contactInfo) completedFields++;
        if (profile.billingInfo?.ruc) completedFields++;
        if (profile.bankInfo?.bankName) completedFields++;
        if (profile.nickname) completedFields++;
        if (profile.photo) completedFields++;
        completedFields++; // Email siempre presente

        return Math.round((completedFields / totalFields) * 100);
    };

    const stats = [
        {
            label: "Estado de Cuenta",
            value: profile.isActive ? "Activa" : "Inactiva",
            icon: User,
            color: profile.isActive ? "text-green-600" : "text-red-600"
        },
        {
            label: "Información Completada",
            value: `${getCompletionPercentage()}%`,
            icon: FileText,
            color: "text-blue-600"
        },
        {
            label: "Código de Referido",
            value: profile.referralCode,
            icon: Share2,
            color: "text-purple-600"
        }
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardContent className="pt-6">
                            <div className="flex items-center space-x-2">
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                <div>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                    <p className="text-lg font-semibold">{stat.value}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Información Rápida</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{profile.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Teléfono</p>
                            <p className="font-medium">{profile.contactInfo?.phone || "No registrado"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">País</p>
                            <p className="font-medium">{profile.contactInfo?.country || "No registrado"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Documento</p>
                            <p className="font-medium">
                                {profile.personalInfo
                                    ? `${profile.personalInfo.documentType} - ${profile.personalInfo.documentNumber}`
                                    : "No registrado"
                                }
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}