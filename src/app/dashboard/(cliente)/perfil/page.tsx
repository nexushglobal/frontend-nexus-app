
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileData } from "@/types/profile.types";
import {
    Building,
    Camera,
    Check,
    Copy,
    CreditCard,
    Edit,
    Globe,
    Hash,
    IdCard,
    Landmark,
    MapPin,
    Phone,
    Receipt,
    User,
    UserCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getProfile } from "./actions/profile";
import { BankInfoModal } from "./components/BankInfoModal";
import { BillingInfoModal } from "./components/BillingInfoModal";
import { ContactInfoModal } from "./components/ContactInfoModal";
import { PhotoUploadModal } from "./components/PhotoUploadModal";

export default function ProfilePage() {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const fetchProfile = async () => {
        try {
            const result = await getProfile();
            if (result.success && result.data) {
                setProfile(result.data);
            } else {
                toast.error("Error", {
                    description: result.message,
                });
            }
        } catch (error) {
            toast.error("Error", {
                description: "Error al cargar el perfil",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleUpdate = () => {
        fetchProfile();
    };

    const copyToClipboard = async (text: string, fieldName: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(fieldName);
            toast.success("Copiado", {
                description: `${fieldName} copiado al portapapeles`,
            });
            setTimeout(() => setCopiedField(null), 2000);
        } catch (error) {
            toast.error("Error", {
                description: "No se pudo copiar al portapapeles",
            });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName[0]}${lastName[0]}`.toUpperCase();
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6 space-y-6">
                <div className="flex items-center gap-4 mb-6">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-64 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="container mx-auto p-6">
                <div className="text-center">
                    <p className="text-muted-foreground">No se pudo cargar el perfil</p>
                    <Button onClick={fetchProfile} className="mt-4">
                        Reintentar
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
                <div className="relative">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={profile.photo || undefined} alt="Perfil" />
                        <AvatarFallback className="text-xl">
                            {profile.personalInfo
                                ? getInitials(profile.personalInfo.firstName, profile.personalInfo.lastName)
                                : "U"
                            }
                        </AvatarFallback>
                    </Avatar>
                    <PhotoUploadModal
                        currentPhoto={profile.photo}
                        userName={profile.personalInfo
                            ? `${profile.personalInfo.firstName} ${profile.personalInfo.lastName}`
                            : profile.email
                        }
                        onUpdate={handleUpdate}
                    >
                        <Button
                            size="sm"
                            className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                        >
                            <Camera className="h-4 w-4" />
                        </Button>
                    </PhotoUploadModal>
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">
                        {profile.personalInfo
                            ? `${profile.personalInfo.firstName} ${profile.personalInfo.lastName}`
                            : "Mi Perfil"
                        }
                    </h1>
                    <p className="text-muted-foreground">{profile.email}</p>
                    <div className="flex items-center gap-2">
                        <Badge variant={profile.isActive ? "default" : "secondary"}>
                            {profile.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                        {profile.nickname && (
                            <Badge variant="outline">@{profile.nickname}</Badge>
                        )}
                    </div>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Información Personal */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Información Personal
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {profile.personalInfo ? (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Nombre</p>
                                        <p className="font-medium">{profile.personalInfo.firstName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Apellidos</p>
                                        <p className="font-medium">{profile.personalInfo.lastName}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Documento</p>
                                        <p className="font-medium">{profile.personalInfo.documentType}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Número</p>
                                        <p className="font-medium">{profile.personalInfo.documentNumber}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Género</p>
                                        <p className="font-medium">{profile.personalInfo.gender}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Fecha de Nacimiento</p>
                                        <p className="font-medium">{formatDate(profile.personalInfo.birthdate)}</p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p className="text-muted-foreground">No hay información personal disponible</p>
                        )}
                    </CardContent>
                </Card>

                {/* Información de Contacto */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="flex items-center gap-2">
                            <Phone className="h-5 w-5" />
                            Información de Contacto
                        </CardTitle>
                        <ContactInfoModal contactInfo={profile.contactInfo} onUpdate={handleUpdate}>
                            <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                            </Button>
                        </ContactInfoModal>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {profile.contactInfo ? (
                            <>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">{profile.contactInfo.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe className="h-4 w-4 text-muted-foreground" />
                                    <span>{profile.contactInfo.country}</span>
                                </div>
                                {profile.contactInfo.address && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span>{profile.contactInfo.address}</span>
                                    </div>
                                )}
                                {profile.contactInfo.postalCode && (
                                    <div className="flex items-center gap-2">
                                        <IdCard className="h-4 w-4 text-muted-foreground" />
                                        <span>{profile.contactInfo.postalCode}</span>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="text-muted-foreground">No hay información de contacto</p>
                        )}
                    </CardContent>
                </Card>

                {/* Información de Facturación */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="flex items-center gap-2">
                            <Receipt className="h-5 w-5" />
                            Información de Facturación
                        </CardTitle>
                        <BillingInfoModal billingInfo={profile.billingInfo} onUpdate={handleUpdate}>
                            <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                            </Button>
                        </BillingInfoModal>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {profile.billingInfo ? (
                            <>
                                {profile.billingInfo.ruc && (
                                    <div className="flex items-center gap-2">
                                        <Receipt className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">{profile.billingInfo.ruc}</span>
                                    </div>
                                )}
                                {profile.billingInfo.razonSocial && (
                                    <div className="flex items-center gap-2">
                                        <Building className="h-4 w-4 text-muted-foreground" />
                                        <span>{profile.billingInfo.razonSocial}</span>
                                    </div>
                                )}
                                {profile.billingInfo.address && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span>{profile.billingInfo.address}</span>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="text-muted-foreground">No hay información de facturación</p>
                        )}
                    </CardContent>
                </Card>

                {/* Información Bancaria */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="flex items-center gap-2">
                            <Landmark className="h-5 w-5" />
                            Información Bancaria
                        </CardTitle>
                        <BankInfoModal bankInfo={profile.bankInfo} onUpdate={handleUpdate}>
                            <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                            </Button>
                        </BankInfoModal>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {profile.bankInfo ? (
                            <>
                                {profile.bankInfo.bankName && (
                                    <div className="flex items-center gap-2">
                                        <Landmark className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">{profile.bankInfo.bankName}</span>
                                    </div>
                                )}
                                {profile.bankInfo.accountNumber && (
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                                        <span>{profile.bankInfo.accountNumber}</span>
                                    </div>
                                )}
                                {profile.bankInfo.cci && (
                                    <div className="flex items-center gap-2">
                                        <Hash className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-mono">{profile.bankInfo.cci}</span>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="text-muted-foreground">No hay información bancaria</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Códigos de Referido */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserCircle className="h-5 w-5" />
                        Códigos de Referido
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Mi Código de Referido</p>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 bg-muted px-3 py-2 rounded text-lg font-mono">
                                    {profile.referralCode}
                                </code>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => copyToClipboard(profile.referralCode, "Código de referido")}
                                >
                                    {copiedField === "Código de referido" ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        {profile.referrerCode && (
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Referido por</p>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 bg-muted px-3 py-2 rounded text-lg font-mono">
                                        {profile.referrerCode}
                                    </code>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => copyToClipboard(profile.referrerCode!, "Código del referidor")}
                                    >
                                        {copiedField === "Código del referidor" ? (
                                            <Check className="h-4 w-4" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}