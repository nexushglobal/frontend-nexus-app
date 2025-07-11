'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AtSign, Calendar, Edit, IdCard, Mail, User } from 'lucide-react'
import { DOCUMENT_TYPES, GENDER_OPTIONS } from '../../constants/profile.constants'
import { ProfileData } from '../../types/profile.types'
import { PersonalInfoModal } from '../modals/PersonalInfoModal'

interface PersonalInfoCardProps {
    profile: ProfileData
    onUpdate: () => void
}

export const PersonalInfoCard = ({ profile, onUpdate }: PersonalInfoCardProps) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const getDocumentTypeLabel = (type: string) => {
        const docType = DOCUMENT_TYPES.find(doc => doc.value === type)
        return docType?.label || type
    }

    const getGenderLabel = (gender: string) => {
        const genderOption = GENDER_OPTIONS.find(g => g.value === gender)
        return genderOption?.label || gender
    }

    const getCompletionPercentage = () => {
        let completed = 0
        const total = 6

        if (profile.email) completed++
        if (profile.nickname) completed++
        if (profile.personalInfo?.firstName) completed++
        if (profile.personalInfo?.lastName) completed++
        if (profile.personalInfo?.documentType) completed++
        if (profile.personalInfo?.documentNumber) completed++

        return Math.round((completed / total) * 100)
    }

    const completionPercentage = getCompletionPercentage()

    const fields = [
        {
            label: "Email",
            value: profile.email,
            icon: Mail,
            isComplete: true
        },
        {
            label: "Nickname",
            value: profile.nickname ? `@${profile.nickname}` : "No establecido",
            icon: AtSign,
            isComplete: !!profile.nickname
        },
        {
            label: "Nombre Completo",
            value: profile.personalInfo
                ? `${profile.personalInfo.firstName} ${profile.personalInfo.lastName}`
                : "No registrado",
            icon: User,
            isComplete: !!(profile.personalInfo?.firstName && profile.personalInfo?.lastName)
        },
        {
            label: "Documento",
            value: profile.personalInfo
                ? `${getDocumentTypeLabel(profile.personalInfo.documentType)} - ${profile.personalInfo.documentNumber}`
                : "No registrado",
            icon: IdCard,
            isComplete: !!(profile.personalInfo?.documentType && profile.personalInfo?.documentNumber)
        },
        {
            label: "Fecha de Nacimiento",
            value: profile.personalInfo?.birthdate
                ? formatDate(profile.personalInfo.birthdate)
                : "No registrada",
            icon: Calendar,
            isComplete: !!profile.personalInfo?.birthdate
        },
        {
            label: "Género",
            value: profile.personalInfo?.gender
                ? getGenderLabel(profile.personalInfo.gender)
                : "No especificado",
            icon: User,
            isComplete: !!profile.personalInfo?.gender
        }
    ]

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <User className="h-5 w-5" />
                        <div>
                            <CardTitle>Información Personal</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-full max-w-[200px] bg-muted rounded-full h-1.5">
                                    <div
                                        className={`h-1.5 rounded-full transition-all duration-300 ${completionPercentage >= 80
                                            ? 'bg-green-500'
                                            : completionPercentage >= 50
                                                ? 'bg-yellow-500'
                                                : 'bg-red-500'
                                            }`}
                                        style={{ width: `${completionPercentage}%` }}
                                    />
                                </div>
                                <span className="text-xs text-muted-foreground">{completionPercentage}%</span>
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
                </div>
            </CardHeader>

            <CardContent className="space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fields.map((field, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-muted/50">
                                <field.icon className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">{field.label}</p>
                                <p className={`text-sm ${field.isComplete
                                    ? 'text-foreground'
                                    : 'text-muted-foreground italic'
                                    }`}>
                                    {field.value}
                                </p>
                            </div>
                        </div>
                        {
                            field.isComplete ? null : <Badge variant="secondary" className="text-xs">Incompleto</Badge>
                        }

                    </div>
                ))}


            </CardContent>
        </Card>
    )
}