import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    AlertCircle,
    Building,
    CheckCircle,
    FileText,
    Globe,
    IdCard,
    Landmark,
    Mail,
    MapPin,
    Phone,
    Share2,
    TrendingUp,
    User
} from "lucide-react";
import { ProfileData } from "../types/profile.types";

interface Props {
    profile: ProfileData
}

export function OverviewSection({ profile }: Props) {
    const getCompletionPercentage = () => {
        let completedFields = 0;
        const totalFields = 6; // Reducido porque quitamos estado de cuenta

        if (profile.personalInfo) completedFields++;
        if (profile.contactInfo) completedFields++;
        if (profile.billingInfo?.ruc) completedFields++;
        if (profile.bankInfo?.bankName) completedFields++;
        if (profile.nickname) completedFields++;
        if (profile.photo) completedFields++;

        return Math.round((completedFields / totalFields) * 100);
    };

    const getCompletionStatus = (percentage: number) => {
        if (percentage >= 80) return { label: "Perfil Completo", color: "text-success", bgColor: "bg-success/10", icon: CheckCircle };
        if (percentage >= 50) return { label: "Perfil Incompleto", color: "text-warning", bgColor: "bg-warning/10", icon: AlertCircle };
        return { label: "Perfil Básico", color: "text-muted-foreground", bgColor: "bg-muted/30", icon: TrendingUp };
    };

    const completionPercentage = getCompletionPercentage();
    const completionStatus = getCompletionStatus(completionPercentage);

    const stats = [
        {
            label: "Perfil Completado",
            value: `${completionPercentage}%`,
            icon: completionStatus.icon,
            color: completionStatus.color,
            bgColor: completionStatus.bgColor,
            description: completionStatus.label
        },
        {
            label: "Código de Referido",
            value: profile.referralCode,
            icon: Share2,
            color: "text-primary",
            bgColor: "bg-primary/10",
            description: "Para invitar nuevos miembros"
        }
    ];

    // Función para verificar si un dato está completo
    const isDataComplete = (data: any) => data && data !== "";

    const profileSections = [
        {
            title: "Información Personal",
            items: [
                {
                    label: "Email",
                    value: profile.email,
                    icon: Mail,
                    isComplete: true // El email siempre está presente
                },
                {
                    label: "Nickname",
                    value: profile.nickname ? `@${profile.nickname}` : "No establecido",
                    icon: User,
                    isComplete: !!profile.nickname
                },
                {
                    label: "Documento",
                    value: profile.personalInfo
                        ? `${profile.personalInfo.documentType} - ${profile.personalInfo.documentNumber}`
                        : "No registrado",
                    icon: IdCard,
                    isComplete: !!profile.personalInfo
                }
            ]
        },
        {
            title: "Información de Contacto",
            items: [
                {
                    label: "Teléfono",
                    value: profile.contactInfo?.phone || "No registrado",
                    icon: Phone,
                    isComplete: !!profile.contactInfo?.phone
                },
                {
                    label: "País",
                    value: profile.contactInfo?.country || "No registrado",
                    icon: Globe,
                    isComplete: !!profile.contactInfo?.country
                },
                {
                    label: "Dirección",
                    value: profile.contactInfo?.address || "No especificada",
                    icon: MapPin,
                    isComplete: !!profile.contactInfo?.address
                }
            ]
        },
        {
            title: "Información Empresarial",
            items: [
                {
                    label: "RUC",
                    value: profile.billingInfo?.ruc || "No configurado",
                    icon: Building,
                    isComplete: !!profile.billingInfo?.ruc
                },
                {
                    label: "Razón Social",
                    value: profile.billingInfo?.razonSocial || "No especificada",
                    icon: Building,
                    isComplete: !!profile.billingInfo?.razonSocial
                },
                {
                    label: "Banco",
                    value: profile.bankInfo?.bankName || "No configurado",
                    icon: Landmark,
                    isComplete: !!profile.bankInfo?.bankName
                }
            ]
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header con estadísticas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                    <Card key={index} className="relative overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground font-medium">
                                            {stat.label}
                                        </p>
                                        <p className="text-2xl font-bold">{stat.value}</p>
                                        <p className={`text-xs font-medium ${stat.color}`}>
                                            {stat.description}
                                        </p>
                                    </div>
                                </div>
                                {index === 0 && (
                                    <div className="flex flex-col items-end">
                                        <div className="w-16 h-16 relative">
                                            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                                                <path
                                                    className="text-muted stroke-current"
                                                    strokeWidth="3"
                                                    fill="transparent"
                                                    d="M18 2.0845
                                                    a 15.9155 15.9155 0 0 1 0 31.831
                                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                                />
                                                <path
                                                    className={`${stat.color.replace('text-', 'text-')} stroke-current`}
                                                    strokeWidth="3"
                                                    strokeDasharray={`${completionPercentage}, 100`}
                                                    strokeLinecap="round"
                                                    fill="transparent"
                                                    d="M18 2.0845
                                                    a 15.9155 15.9155 0 0 1 0 31.831
                                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className={`text-xs font-bold ${stat.color}`}>
                                                    {completionPercentage}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Secciones de información detallada */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {profileSections.map((section, sectionIndex) => (
                    <Card key={sectionIndex}>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                {section.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {section.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="flex items-start gap-3 p-2 rounded-lg border bg-card/50">
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                        <item.icon className={`h-4 w-4 flex-shrink-0 ${item.isComplete ? 'text-success' : 'text-muted-foreground'
                                            }`} />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-muted-foreground font-medium">
                                                {item.label}
                                            </p>
                                            <p className={`text-sm font-medium truncate ${item.isComplete ? 'text-foreground' : 'text-muted-foreground italic'
                                                }`}>
                                                {item.value}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        {item.isComplete ? (
                                            <CheckCircle className="h-4 w-4 text-success" />
                                        ) : (
                                            <AlertCircle className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Sugerencias para completar perfil */}
            {completionPercentage < 100 && (
                <Card className="border-primary/20 bg-primary/5 py-0">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <TrendingUp className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-foreground mb-2">
                                    Completa tu perfil para una mejor experiencia
                                </h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Un perfil completo te ayuda a aprovechar al máximo todas las funcionalidades de la plataforma.
                                </p>

                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}