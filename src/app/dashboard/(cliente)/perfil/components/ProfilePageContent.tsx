"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { useClipboard } from "../hooks/useClipboard";
import { useProfile } from "../hooks/useProfile";

import { PhotoUploadModal } from "./modal/PhotoUploadModal";
import { BankInfoCard } from "./ProfileCards/BankInfoCard";
import { BillingInfoCard } from "./ProfileCards/BillingInfoCard";
import { ContactInfoCard } from "./ProfileCards/ContactInfoCard";
import { PersonalInfoCard } from "./ProfileCards/PersonalInfoCard";
import { ReferralCodesCard } from "./ProfileCards/ReferralCodesCard";
import { SecurityCard } from "./ProfileCards/SecurityCard";
import { ProfilePageSkeleton } from "./ProfilePageSkeleton";

export function ProfilePageContent() {
    const { profile, loading, error, refetch } = useProfile();
    const { copiedField, copyToClipboard } = useClipboard();

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName[0]}${lastName[0]}`.toUpperCase();
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
                        onUpdate={refetch}
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <PersonalInfoCard
                    personalInfo={profile.personalInfo}
                    currentEmail={profile.email}
                    currentNickname={profile.nickname}
                    onUpdate={refetch}
                />

                <ContactInfoCard
                    contactInfo={profile.contactInfo}
                    onUpdate={refetch}
                />

                <BillingInfoCard
                    billingInfo={profile.billingInfo}
                    onUpdate={refetch}
                />

                <BankInfoCard
                    bankInfo={profile.bankInfo}
                    onUpdate={refetch}
                />

                <SecurityCard
                    onUpdate={refetch}
                />
            </div>

            {/* Referral Codes */}
            <ReferralCodesCard
                referralCode={profile.referralCode}
                referrerCode={profile.referrerCode}
                copiedField={copiedField}
                onCopy={copyToClipboard}
            />
        </div>
    );
}