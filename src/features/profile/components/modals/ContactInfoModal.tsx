"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Globe, Mail, MapPin, Phone, Save, X } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ContactInfoFormData, contactInfoSchema } from "../../schemas/profile-schemas";
import { updateContactInfoAction } from "../../actions/update-contact-info";
import { createFormField } from "@/features/shared/hooks/useFormField";
import { ContactInfo } from "../../types/profile.types";
import { COUNTRIES } from "../../constants/profile.constants";
import { FormSection } from "@/features/shared/components/form/FormSection";
import { ResponsiveModal } from "@/features/shared/components/modal/ResponsiveModal";

interface ContactInfoModalProps {
    children: React.ReactNode;
    contactInfo: ContactInfo | null;
    onUpdate: () => void;
}

// Hook tipado específico para este formulario
const useContactFormField = createFormField<ContactInfoFormData>();

// Transformar países para el select
const countryOptions = COUNTRIES.map(country => ({
    value: country.value,
    label: country.label,
    icon: country.flag
}));

export function ContactInfoModal({
    children,
    contactInfo,
    onUpdate
}: ContactInfoModalProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const form = useForm<ContactInfoFormData>({
        resolver: zodResolver(contactInfoSchema),
        defaultValues: {
            phone: contactInfo?.phone || "",
            address: contactInfo?.address || "",
            postalCode: contactInfo?.postalCode || "",
            country: contactInfo?.country || "Peru",
        },
    });

    const onSubmit = (data: ContactInfoFormData) => {
        startTransition(async () => {
            try {
                const result = await updateContactInfoAction({
                    phone: data.phone,
                    address: data.address || undefined,
                    postalCode: data.postalCode || undefined,
                    country: data.country,
                });

                if (result.success) {
                    toast.success("Información actualizada", {
                        description: "Tu información de contacto se ha actualizado correctamente",
                    });
                    setOpen(false);
                    onUpdate();
                } else {
                    toast.error("Error al actualizar", {
                        description: result.message,
                    });
                }
            } catch (error) {
                toast.error("Error de conexión", {
                    description: "No se pudo actualizar la información. Intenta nuevamente.",
                });
            }
        });
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (newOpen) {
            form.reset({
                phone: contactInfo?.phone || "",
                address: contactInfo?.address || "",
                postalCode: contactInfo?.postalCode || "",
                country: contactInfo?.country || "Peru",
            });
        }
    };

    const formContent = (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Información Principal (Requerida) */}
                <FormSection
                    title="Información Principal"
                    subtitle="Datos básicos de contacto"
                    required={true}
                >
                    {useContactFormField(form.control, "phone", {
                        type: "input",
                        label: "Teléfono",
                        icon: Phone,
                        inputType: "tel",
                        placeholder: "958920823",
                        disabled: isPending,
                        required: true,
                        helpText: "Número de teléfono para contactarte"
                    })}

                    {useContactFormField(form.control, "country", {
                        type: "select",
                        label: "País",
                        icon: Globe,
                        placeholder: "Selecciona un país",
                        options: countryOptions,
                        disabled: isPending,
                        required: true
                    })}
                </FormSection>

                <FormSection
                    title="Información Adicional"
                    subtitle="Datos opcionales para completar tu perfil"
                    required={false}
                >
                    {useContactFormField(form.control, "address", {
                        type: "input",
                        label: "Dirección",
                        icon: MapPin,
                        placeholder: "Av. Principal 123, Distrito",
                        disabled: isPending,
                        helpText: "Dirección completa donde residir"
                    })}

                    {useContactFormField(form.control, "postalCode", {
                        type: "input",
                        label: "Código Postal",
                        icon: Mail,
                        placeholder: "15001",
                        className: "font-mono",
                        disabled: isPending,
                        helpText: "Código postal de tu zona"
                    })}
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
            title="Información de Contacto"
            icon={Phone}
            content={formContent}
            customFooter={customActions}
            isPending={isPending}
        >
            {children}
        </ResponsiveModal>
    );
}