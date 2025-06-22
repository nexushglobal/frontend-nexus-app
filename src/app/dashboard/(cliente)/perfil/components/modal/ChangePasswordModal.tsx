"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Save, X, Shield, CheckCircle } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ChangePasswordFormData, changePasswordSchema } from "../../schemas/security-schemas";
import { changePassword } from "../../actions/profile";

interface ChangePasswordModalProps {
    children: React.ReactNode;
    onUpdate: () => void;
}

export function ChangePasswordModal({ children, onUpdate }: ChangePasswordModalProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    const onSubmit = (data: ChangePasswordFormData) => {
        startTransition(async () => {
            try {
                const result = await changePassword({
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
            setShowCurrentPassword(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);
        }
    };

    const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
        switch (field) {
            case 'current':
                setShowCurrentPassword(!showCurrentPassword);
                break;
            case 'new':
                setShowNewPassword(!showNewPassword);
                break;
            case 'confirm':
                setShowConfirmPassword(!showConfirmPassword);
                break;
        }
    };

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

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Cambiar Contraseña
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Alerta de seguridad */}
                        <Alert className="border-info/20 bg-info/5">
                            <Shield className="h-4 w-4 text-info" />
                            <AlertDescription className="text-sm">
                                <strong>Seguridad:</strong> Asegúrate de crear una contraseña fuerte y única para proteger tu cuenta.
                            </AlertDescription>
                        </Alert>

                        {/* Contraseña actual */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground">
                                Verificación de Identidad
                            </h3>

                            <FormField
                                control={form.control}
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contraseña Actual</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    {...field}
                                                    type={showCurrentPassword ? "text" : "password"}
                                                    placeholder="Ingresa tu contraseña actual"
                                                    className="pl-10 pr-10"
                                                    disabled={isPending}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-muted/80 rounded-md"
                                                    onClick={() => togglePasswordVisibility('current')}
                                                    disabled={isPending}
                                                    aria-label={showCurrentPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                                >
                                                    {showCurrentPassword ? (
                                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                    ) : (
                                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Nueva contraseña */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground">
                                Nueva Contraseña
                            </h3>

                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="newPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center justify-between">
                                                <span>Nueva Contraseña</span>
                                                {watchNewPassword && (
                                                    <span className={`text-xs font-medium ${getStrengthColor(passwordStrength.score)}`}>
                                                        Seguridad: {getStrengthLabel(passwordStrength.score)}
                                                    </span>
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        {...field}
                                                        type={showNewPassword ? "text" : "password"}
                                                        placeholder="Crea una contraseña segura"
                                                        className="pl-10 pr-10"
                                                        disabled={isPending}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-muted/80 rounded-md"
                                                        onClick={() => togglePasswordVisibility('new')}
                                                        disabled={isPending}
                                                        aria-label={showNewPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                                    >
                                                        {showNewPassword ? (
                                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                        ) : (
                                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirmar Nueva Contraseña</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        {...field}
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        placeholder="Confirma tu nueva contraseña"
                                                        className="pl-10 pr-10"
                                                        disabled={isPending}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-muted/80 rounded-md"
                                                        onClick={() => togglePasswordVisibility('confirm')}
                                                        disabled={isPending}
                                                        aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                                    >
                                                        {showConfirmPassword ? (
                                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                        ) : (
                                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

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

                        {/* Footer */}
                        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t">
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
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}