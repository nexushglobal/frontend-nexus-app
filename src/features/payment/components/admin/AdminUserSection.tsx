import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    User,
    Mail,
    Phone,
    FileText,
    Calendar,
    Copy,
    ExternalLink,
    MapPin,
    Hash
} from "lucide-react";
import { toast } from "sonner";

interface UserInfo {
    id: number;
    email: string;
    fullName: string;
    documentNumber: string;
    phone: string;
}

interface AdminUserSectionProps {
    user: UserInfo;
}

export function AdminUserSection({ user }: AdminUserSectionProps) {
    const handleCopyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copiado al portapapeles`);
    };

    const handleViewUserProfile = () => {
        // Aquí podrías navegar al perfil del usuario si existe esa funcionalidad
        toast.info("Funcionalidad de perfil de usuario no implementada");
    };

    return (
        <div className="space-y-6">
            {/* User Header */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">{user.fullName}</CardTitle>
                                <p className="text-muted-foreground">
                                    ID de Usuario: #{user.id}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleViewUserProfile}
                                className="flex items-center gap-2"
                            >
                                <ExternalLink className="h-4 w-4" />
                                Ver Perfil
                            </Button>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Contact Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-blue-600" />
                        Información de Contacto
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Email */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Número de Documento
                                </span>
                            </div>
                            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                                <span className="font-mono font-medium text-lg">{user.documentNumber}</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleCopyToClipboard(user.documentNumber, "Documento")}
                                    className="h-8 w-8 p-0"
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>


        </div>
    )
}