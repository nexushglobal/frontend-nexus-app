"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
    FileText,
    Landmark,
    Phone,
    Receipt,
    Share2,
    Shield,
    User
} from "lucide-react";
import { useEffect, useState } from "react";
import { useProfile } from "../hooks/useProfile";
import { OverviewSection } from "./OverviewSection";
import { BankInfoCard } from "./ProfileCards/BankInfoCard";
import { BillingInfoCard } from "./ProfileCards/BillingInfoCard";
import { ContactInfoCard } from "./ProfileCards/ContactInfoCard";
import { PersonalInfoCard } from "./ProfileCards/PersonalInfoCard";
import { ReferralCodesCard } from "./ProfileCards/ReferralCodesCard";
import { SecurityCard } from "./ProfileCards/SecurityCard";
import ProfileHeader from "./ProfileHeader";
import { ProfilePageSkeleton } from "./ProfilePageSkeleton";

const menuSections = [
    {
        id: "overview",
        label: "Resumen",
        icon: User,
        description: "Vista general del perfil"
    },
    {
        id: "personal",
        label: "Personal",
        icon: FileText,
        description: "Información personal y documentos"
    },
    {
        id: "contact",
        label: "Contacto",
        icon: Phone,
        description: "Información de contacto"
    },
    {
        id: "billing",
        label: "Facturación",
        icon: Receipt,
        description: "Datos de facturación"
    },
    {
        id: "banking",
        label: "Bancario",
        icon: Landmark,
        description: "Información bancaria"
    },
    {
        id: "referrals",
        label: "Referencias",
        icon: Share2,
        description: "Códigos de referido"
    },
    {
        id: "security",
        label: "Seguridad",
        icon: Shield,
        description: "Contraseña y seguridad"
    }
];



export function ProfilePageContent() {
    const { profile, loading, error, refetch } = useProfile();
    const [activeSection, setActiveSection] = useState("overview");
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    const renderSection = () => {
        if (!profile) return null;

        switch (activeSection) {
            case "overview":
                return <OverviewSection profile={profile} />;
            case "personal":
                return <PersonalInfoCard profile={profile} onUpdate={refetch} />;
            case "contact":
                return <ContactInfoCard contactInfo={profile.contactInfo} onUpdate={refetch} />;
            case "billing":
                return <BillingInfoCard billingInfo={profile.billingInfo} onUpdate={refetch} />;
            case "banking":
                return <BankInfoCard bankInfo={profile.bankInfo} onUpdate={refetch} />;
            case "referrals":
                return <ReferralCodesCard referralCode={profile.referralCode} />;
            case "security":
                return <SecurityCard onUpdate={refetch} />;
            default:
                return <OverviewSection profile={profile} />;
        }
    };

    if (loading) {
        return <ProfilePageSkeleton />;
    }

    if (error || !profile) {
        return (
            <div className="container mx-auto p-6">
                <div className="text-center">
                    <p className="text-muted-foreground">{error || "No se pudo cargar el perfil"}</p>
                    <Button onClick={refetch} className="mt-4">
                        Reintentar
                    </Button>
                </div>
            </div>
        );
    }

    if (isMobile) {
        return (
            <div className="container mx-auto p-4 space-y-6">
                <ProfileHeader profile={profile} onUpdate={refetch} />

                <Tabs value={activeSection} onValueChange={setActiveSection}>
                    <TabsList className="grid grid-cols-4 w-full mb-6">
                        <TabsTrigger value="overview" className="text-xs">
                            Resumen
                        </TabsTrigger>
                        <TabsTrigger value="personal" className="text-xs">
                            Personal
                        </TabsTrigger>
                        <TabsTrigger value="contact" className="text-xs">
                            Contacto
                        </TabsTrigger>
                        <TabsTrigger value="more" className="text-xs">
                            Más
                        </TabsTrigger>
                    </TabsList>

                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeSection !== "more" ? renderSection() : null}
                    </motion.div>
                </Tabs>

                {activeSection === "more" && (
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        {menuSections.slice(3).map((section) => (
                            <Button
                                key={section.id}
                                variant="outline"
                                className="h-20 flex flex-col items-center justify-center gap-2"
                                onClick={() => setActiveSection(section.id)}
                            >
                                <section.icon className="h-5 w-5" />
                                <span className="text-xs">{section.label}</span>
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <ProfileHeader profile={profile} onUpdate={refetch} />

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Configuración</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <nav className="space-y-1">
                                {menuSections.map((section) => {
                                    const isActive = activeSection === section.id;
                                    return (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSection(section.id)}
                                            className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors hover:bg-muted/50 ${isActive
                                                ? 'bg-primary/10 text-primary border-r-2 border-primary'
                                                : 'text-muted-foreground hover:text-foreground'
                                                }`}
                                        >
                                            <section.icon className="h-4 w-4" />
                                            <div className="flex-1">
                                                <div className="font-medium text-sm">{section.label}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {section.description}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </nav>
                        </CardContent>
                    </Card>
                </div>

                <div className="col-span-9">
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderSection()}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}