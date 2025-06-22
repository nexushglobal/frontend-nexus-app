"use client";

import { ResponsiveModal } from "@/components/common/ResponsiveModal";
import { createFormField } from "@/hooks/useFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { documentTypes } from "@/data/general.data";
import { PersonalInfo } from "@/types/profile.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { AtSign, CreditCard, IdCard, Mail, Save, User, X } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updatePersonalInfo } from "../../actions/profile";
import { PersonalInfoFormData, personalInfoSchema } from "../../schemas/personal-info-schema";
import { FormSection } from "@/components/common/form/FormSection";

interface PersonalInfoModalProps {
    children: React.ReactNode;
    personalInfo: PersonalInfo | null;
    currentEmail: string;
    currentNickname?: string | null;
    onUpdate: () => void;
}

// Hook tipado específico para este formulario
const usePersonalFormField = createFormField<PersonalInfoFormData>();

// Transformar tipos de documento para el select
const documentTypeOptions = documentTypes.map(docType => ({
    value: docType.value,
    label: docType.label,
    icon: "📄"
}));

export function PersonalInfoModal({
    children,
    personalInfo,
    currentEmail,
    currentNickname,
    onUpdate
}: PersonalInfoModalProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const form = useForm<PersonalInfoFormData>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: {
            nickname: currentNickname || "",
            email: currentEmail || "",
            documentType: personalInfo?.documentType as "DNI" | "CE" | "PAS" || undefined,
            documentNumber: personalInfo?.documentNumber || "",
        },
    });

    const onSubmit = (data: PersonalInfoFormData) => {
        startTransition(async () => {
            try {
                const result = await updatePersonalInfo({
                    nickname: data.nickname || undefined,
                    email: data.email || undefined,
                    documentType: data.documentType || undefined,
                    documentNumber: data.documentNumber || undefined,
                });

                if (result.success) {
                    toast.success("Información actualizada", {
                        description: "Tu información personal se ha actualizado correctamente"
                    });
                    setOpen(false);
                    onUpdate();
                } else {
                    toast.error("Error al actualizar", {
                        description: result.message
                    });
                }
            } catch (error) {
                toast.error("Error de conexión", {
                    description: "No se pudo actualizar la información. Intenta nuevamente."
                });
            }
        });
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (newOpen) {
            form.reset({
                nickname: currentNickname || "",
                email: currentEmail || "",
                documentType: personalInfo?.documentType as "DNI" | "CE" | "PAS" || undefined,
                documentNumber: personalInfo?.documentNumber || "",
            });
        }
    };

    const formContent = (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormSection
                    title="Información de Contacto"
                    subtitle="Datos básicos de tu perfil"
                    required={false}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {usePersonalFormField(form.control, "nickname", {
                            type: "input",
                            label: "Nickname",
                            icon: AtSign,
                            placeholder: "mi_nickname",
                            disabled: isPending,
                            helpText: "Nombre único para identificarte en la plataforma"
                        })}

                        {usePersonalFormField(form.control, "email", {
                            type: "input",
                            label: "Email",
                            icon: Mail,
                            inputType: "email",
                            placeholder: "tu@email.com",
                            disabled: isPending,
                            helpText: "Correo electrónico principal"
                        })}
                    </div>
                </FormSection>

                <FormSection
                    title="Información de Documento"
                    subtitle="Datos de tu documento de identidad"
                    required={false}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {usePersonalFormField(form.control, "documentType", {
                            type: "select",
                            label: "Tipo de Documento",
                            icon: IdCard,
                            placeholder: "Selecciona un tipo",
                            options: documentTypeOptions,
                            disabled: isPending
                        })}

                        {usePersonalFormField(form.control, "documentNumber", {
                            type: "input",
                            label: "Número de Documento",
                            icon: CreditCard,
                            placeholder: "12345678",
                            className: "font-mono",
                            disabled: isPending,
                            maxLength: 20,
                            helpText: "Número de tu documento de identidad"
                        })}
                    </div>
                </FormSection>
            </form>
        </Form>
    );

    const customActions = (
        <div className="flex flex-col-reverse sm:flex-row gap-3">
            <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="flex-1 sm:flex-none"
            >
                <X className="mr-2 h-4 w-4" />
                Cancelar
            </Button>

            <Button
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
                disabled={isPending}
                className="flex-1 sm:flex-none"
            >
                {isPending ? (
                    <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Guardando...
                    </>
                ) : (
                    <>
                        <Save className="mr-2 h-4 w-4" />
                        Guardar Cambios
                    </>
                )}
            </Button>
        </div>
    );

    return (
        <ResponsiveModal
            open={open}
            onOpenChange={handleOpenChange}
            title="Información Personal"
            icon={User}
            content={formContent}
            customFooter={customActions}
            isPending={isPending}
        >
            {children}
        </ResponsiveModal>
    );
}