import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { ProfileData } from '@/types/profile.types';
import { Camera, AtSign } from 'lucide-react';
import { PhotoUploadModal } from './modal/PhotoUploadModal';

type Props = {
    profile: ProfileData
    onUpdate: () => void
}

const ProfileHeader = ({ profile, onUpdate }: Props) => {
    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName[0]}${lastName[0]}`.toUpperCase();
    };

    const getCompletionPercentage = () => {
        let completedFields = 0;
        const totalFields = 6;

        if (profile.personalInfo) completedFields++;
        if (profile.contactInfo) completedFields++;
        if (profile.billingInfo?.ruc) completedFields++;
        if (profile.bankInfo?.bankName) completedFields++;
        if (profile.nickname) completedFields++;
        if (profile.photo) completedFields++;

        return Math.round((completedFields / totalFields) * 100);
    };

    const completionPercentage = getCompletionPercentage();

    return (
        <Card className="mb-6">
            <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    {/* Avatar Section */}
                    <div className="relative flex-shrink-0">
                        <Avatar className="h-20 w-20 md:h-24 md:w-24">
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
                            onUpdate={onUpdate}
                        >
                            <Button
                                size="sm"
                                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                            >
                                <Camera className="h-4 w-4" />
                            </Button>
                        </PhotoUploadModal>
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1 space-y-3">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">
                                {profile.personalInfo
                                    ? `${profile.personalInfo.firstName} ${profile.personalInfo.lastName}`
                                    : "Mi Perfil"
                                }
                            </h1>
                            <p className="text-muted-foreground">{profile.email}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                                {completionPercentage}% Completo
                            </Badge>
                            {profile.nickname && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    <AtSign className="h-3 w-3" />
                                    {profile.nickname}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default ProfileHeader