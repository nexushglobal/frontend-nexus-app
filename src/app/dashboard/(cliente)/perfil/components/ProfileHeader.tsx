import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { ProfileData } from '@/types/profile.types';
import { Camera } from 'lucide-react';
import { PhotoUploadModal } from './modal/PhotoUploadModal';

type Props = {
    profile: ProfileData
    onUpdate: () => void
}

const ProfileHeader = ({ profile, onUpdate }: Props) => {
    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName[0]}${lastName[0]}`.toUpperCase();
    };

    return (
        <Card className="mb-6">
            <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="relative">
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

                    <div className="flex-1 space-y-2">
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
                            <Badge variant={profile.isActive ? "default" : "secondary"}>
                                {profile.isActive ? "Activo" : "Inactivo"}
                            </Badge>
                            {profile.nickname && (
                                <Badge variant="outline">@{profile.nickname}</Badge>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default ProfileHeader