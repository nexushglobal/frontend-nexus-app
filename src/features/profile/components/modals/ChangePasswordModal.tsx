"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Lock, Save, Shield, X } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ChangePasswordFormData, changePasswordSchema } from "../../schemas/security-schemas";
import { ChangePasswordAction } from "../../actions/change-password";
import { createFormField } from "@/features/shared/hooks/useFormField";
import { FormSection } from "@/features/shared/components/form/FormSection";
import { ResponsiveModal } from "@/features/shared/components/modal/ResponsiveModal";

interface ChangePasswordModalProps {
    children: React.ReactNode;
    onUpdate: () => void;
}

// Hook tipado específico para este formulario
const usePasswordFormField = createFormField<ChangePasswordFormData>();

export function ChangePasswordModal({
    children,
    onUpdate
}: ChangePasswordModalProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const form = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const watchNewPassword = form.watch("newPassword");

    // Validaciones de seguridad en tiempo real
    const getPasswordStrength = (password: string) => {
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[^A-Za-z0-9]/.test(password),
        };

        const score = Object.values(checks).filter(Boolean).length;
        return { checks, score };
    };

    const passwordStrength = getPasswordStrength(watchNewPassword || "");

    const getStrengthColor = (score: number) => {
        if (score < 2) return "text-destructive";
        if (score < 4) return "text-warning";
        return "text-success";
    };

    const getStrengthLabel = (score: number) => {
        if (score < 2) return "Débil";
        if (score < 4) return "Media";
        return "Fuerte";
    };

    const onSubmit = (data: ChangePasswordFormData) => {
        startTransition(async () => {
            try {
                const result = await ChangePasswordAction({
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword,
                });

                if (result.success) {
                    toast.success("¡Contraseña actualizada!", {
                        description: "Tu contraseña ha sido cambiada correctamente",
                        duration: 3000,
                    });
                    setOpen(false);
                    form.reset();
                    onUpdate();
                } else {
                    toast.error("Error al cambiar contraseña", {
                        description: result.message,
                    });
                }
            } catch (error) {
                toast.error("Error de conexión", {
                    description: "No se pudo conectar con el servidor. Intenta nuevamente.",
                });
            }
        });
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            form.reset();
        }
    };

    const formContent = (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Alerta de seguridad */}
                <Alert className="border-info/20 bg-info/5">
                    <Shield className="h-4 w-4 text-info" />
                    <AlertDescription className="text-sm">
                        <strong>Seguridad:</strong> Asegúrate de crear una contraseña fuerte y única para proteger tu cuenta.
                    </AlertDescription>
                </Alert>

                {/* Verificación de Identidad */}
                <FormSection
                    title="Verificación de Identidad"
                    subtitle="Confirma tu contraseña actual para continuar"
                    required={true}
                >
                    {usePasswordFormField(form.control, "currentPassword", {
                        type: "input",
                        label: "Contraseña Actual",
                        icon: Lock,
                        inputType: "password",
                        placeholder: "Ingresa tu contraseña actual",
                        disabled: isPending,
                        required: true
                    })}
                </FormSection>

                {/* Nueva Contraseña */}
                <FormSection
                    title="Nueva Contraseña"
                    subtitle="Crea una contraseña segura"
                    required={true}
                >
                    <div className="space-y-4">
                        {usePasswordFormField(form.control, "newPassword", {
                            type: "input",
                            label: watchNewPassword ? `Nueva Contraseña (Seguridad: ${getStrengthLabel(passwordStrength.score)})` : "Nueva Contraseña",
                            icon: Lock,
                            inputType: "password",
                            placeholder: "Crea una contraseña segura",
                            disabled: isPending,
                            required: true
                        })}

                        {usePasswordFormField(form.control, "confirmPassword", {
                            type: "input",
                            label: "Confirmar Nueva Contraseña",
                            icon: Lock,
                            inputType: "password",
                            placeholder: "Confirma tu nueva contraseña",
                            disabled: isPending,
                            required: true
                        })}
                    </div>
                </FormSection>

                {/* Indicador de fortaleza de contraseña */}
                {watchNewPassword && (
                    <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                            🔒 Requisitos de seguridad
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                            {Object.entries({
                                length: "Mínimo 8 caracteres",
                                uppercase: "Una letra mayúscula",
                                lowercase: "Una letra minúscula",
                                number: "Un número",
                                special: "Un carácter especial"
                            }).map(([key, label]) => (
                                <div key={key} className="flex items-center gap-2">
                                    <CheckCircle
                                        className={`h-3 w-3 ${passwordStrength.checks[key as keyof typeof passwordStrength.checks]
                                            ? "text-success"
                                            : "text-muted-foreground"
                                            }`}
                                    />
                                    <span
                                        className={`text-xs ${passwordStrength.checks[key as keyof typeof passwordStrength.checks]
                                            ? "text-success"
                                            : "text-muted-foreground"
                                            }`}
                                    >
                                        {label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
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
                disabled={isPending || passwordStrength.score < 3}
                className="flex-1 sm:flex-none"
            >
                {isPending ? (
                    <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Cambiando...
                    </>
                ) : (
                    <>
                        <Save className="mr-2 h-4 w-4" />
                        Cambiar Contraseña
                    </>
                )}
            </Button>
        </div>
    );

    return (
        <ResponsiveModal
            open={open}
            onOpenChange={handleOpenChange}
            title="Cambiar Contraseña"
            icon={Shield}
            content={formContent}
            customFooter={customActions}
            isPending={isPending}
        >
            {children}
        </ResponsiveModal>
    );
}