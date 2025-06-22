"use client";

import { useState, useTransition } from "react";
import { Mail, Lock, ArrowLeft, Check, Loader2, Eye, EyeOff } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { requestPasswordReset, resetPassword, validatePasswordResetToken } from "../actions/password-reset";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-opt";

interface PasswordResetModalProps {
    children: React.ReactNode;
}

type Step = "email" | "code" | "password" | "success";

export function PasswordResetModal({ children }: PasswordResetModalProps) {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState<Step>("email");
    const [isPending, startTransition] = useTransition();
    const [focusedField, setFocusedField] = useState<string | null>(null);

    // Form state
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Password visibility state
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Validation errors
    const [errors, setErrors] = useState<{
        email?: string;
        code?: string;
        newPassword?: string;
        confirmPassword?: string;
    }>({});

    const resetForm = () => {
        setStep("email");
        setEmail("");
        setCode("");
        setNewPassword("");
        setConfirmPassword("");
        setShowNewPassword(false);
        setShowConfirmPassword(false);
        setErrors({});
        setFocusedField(null);
    };

    const validateEmail = (email: string) => {
        if (!email) return "El email es requerido";
        if (!/\S+@\S+\.\S+/.test(email)) return "El email no es válido";
        return null;
    };

    const validateCode = (code: string) => {
        if (!code) return "El código es requerido";
        if (code.length !== 5) return "El código debe tener 5 dígitos";
        return null;
    };

    const validatePassword = (password: string) => {
        if (!password) return "La contraseña es requerida";
        if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres";
        return null;
    };

    const handleRequestReset = () => {
        const emailError = validateEmail(email);
        if (emailError) {
            setErrors({ email: emailError });
            return;
        }

        setErrors({});
        startTransition(async () => {
            const result = await requestPasswordReset(email);

            if (result.success) {
                toast.success("Código enviado", {
                    description: "Revisa tu correo electrónico para obtener el código de verificación",
                });
                setStep("code");
            } else {
                toast.error("Error", {
                    description: result.message,
                });
            }
        });
    };

    const handleValidateCode = () => {
        const codeError = validateCode(code);
        if (codeError) {
            setErrors({ code: codeError });
            return;
        }

        setErrors({});
        startTransition(async () => {
            const result = await validatePasswordResetToken(email, code);

            if (result.success) {
                toast.success("Código válido", {
                    description: "Ahora puedes establecer tu nueva contraseña",
                });
                setStep("password");
            } else {
                toast.error("Código inválido", {
                    description: result.message,
                });
            }
        });
    };

    const handleResetPassword = () => {
        const passwordError = validatePassword(newPassword);
        const confirmError = newPassword !== confirmPassword ? "Las contraseñas no coinciden" : null;

        if (passwordError || confirmError) {
            setErrors({
                newPassword: passwordError || undefined,
                confirmPassword: confirmError || undefined
            });
            return;
        }

        setErrors({});
        startTransition(async () => {
            const result = await resetPassword(email, code, newPassword);

            if (result.success) {
                toast.success("¡Contraseña restablecida!", {
                    description: "Tu contraseña ha sido actualizada correctamente",
                });
                setStep("success");
            } else {
                toast.error("Error", {
                    description: result.message,
                });
            }
        });
    };

    const handleClose = () => {
        setOpen(false);
        // Reset after animation
        setTimeout(resetForm, 300);
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            setTimeout(resetForm, 300);
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case "email":
                return (
                    <div className="px-6 pb-6">
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="reset-email" className="text-sm font-medium text-foreground">
                                    Correo Electrónico
                                </Label>
                                <div className="relative">
                                    <div className={cn(
                                        "absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200",
                                        focusedField === "email" || email ? "text-primary" : "text-muted-foreground"
                                    )}>
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <Input
                                        id="reset-email"
                                        type="email"
                                        placeholder="tu@email.com"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (errors.email) setErrors({ ...errors, email: undefined });
                                        }}
                                        onFocus={() => setFocusedField("email")}
                                        onBlur={() => setFocusedField(null)}
                                        className={cn(
                                            "pl-10 h-11 border-2 transition-all duration-200 rounded-lg bg-background/50",
                                            errors.email
                                                ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                                                : "border-border focus:border-primary focus:ring-primary/20 hover:border-border/80"
                                        )}
                                        disabled={isPending}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-destructive animate-in fade-in duration-200">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <Button
                                onClick={handleRequestReset}
                                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <div className="flex items-center">
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Enviando código...
                                    </div>
                                ) : (
                                    "Enviar Código"
                                )}
                            </Button>
                        </div>
                    </div>
                );

            case "code":
                return (
                    <div className="px-6 pb-6">
                        <div className="space-y-5">
                            <div className="text-center space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    Ingresa el código de 5 dígitos enviado a <strong className="text-foreground">{email}</strong>
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-center block text-sm font-medium text-foreground">
                                        Código de Verificación
                                    </Label>
                                    <div className="flex justify-center">
                                        <InputOTP
                                            maxLength={5}
                                            value={code}
                                            onChange={(value) => {
                                                setCode(value);
                                                if (errors.code) setErrors({ ...errors, code: undefined });
                                            }}
                                            disabled={isPending}
                                        >
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>
                                    {errors.code && (
                                        <p className="text-sm text-destructive text-center animate-in fade-in duration-200">
                                            {errors.code}
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setStep("email")}
                                        disabled={isPending}
                                        className="flex-1 h-11 border-2 rounded-lg transition-all duration-200"
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Volver
                                    </Button>
                                    <Button
                                        onClick={handleValidateCode}
                                        disabled={isPending || code.length !== 5}
                                        className="flex-1 h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                                    >
                                        {isPending ? (
                                            <div className="flex items-center">
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Verificando...
                                            </div>
                                        ) : (
                                            "Verificar"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case "password":
                return (
                    <div className="px-6 pb-6">
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="new-password" className="text-sm font-medium text-foreground">
                                    Nueva Contraseña
                                </Label>
                                <div className="relative">
                                    <div className={cn(
                                        "absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200",
                                        focusedField === "newPassword" || newPassword ? "text-primary" : "text-muted-foreground"
                                    )}>
                                        <Lock className="h-4 w-4" />
                                    </div>
                                    <Input
                                        id="new-password"
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={newPassword}
                                        onChange={(e) => {
                                            setNewPassword(e.target.value);
                                            if (errors.newPassword) setErrors({ ...errors, newPassword: undefined });
                                        }}
                                        onFocus={() => setFocusedField("newPassword")}
                                        onBlur={() => setFocusedField(null)}
                                        className={cn(
                                            "pl-10 pr-10 h-11 border-2 transition-all duration-200 rounded-lg bg-background/50",
                                            errors.newPassword
                                                ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                                                : "border-border focus:border-primary focus:ring-primary/20 hover:border-border/80"
                                        )}
                                        disabled={isPending}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-muted/80 rounded-md"
                                        onClick={toggleNewPasswordVisibility}
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
                                {errors.newPassword && (
                                    <p className="text-sm text-destructive animate-in fade-in duration-200">
                                        {errors.newPassword}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirm-password" className="text-sm font-medium text-foreground">
                                    Confirmar Contraseña
                                </Label>
                                <div className="relative">
                                    <div className={cn(
                                        "absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200",
                                        focusedField === "confirmPassword" || confirmPassword ? "text-primary" : "text-muted-foreground"
                                    )}>
                                        <Lock className="h-4 w-4" />
                                    </div>
                                    <Input
                                        id="confirm-password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                                        }}
                                        onFocus={() => setFocusedField("confirmPassword")}
                                        onBlur={() => setFocusedField(null)}
                                        className={cn(
                                            "pl-10 pr-10 h-11 border-2 transition-all duration-200 rounded-lg bg-background/50",
                                            errors.confirmPassword
                                                ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                                                : "border-border focus:border-primary focus:ring-primary/20 hover:border-border/80"
                                        )}
                                        disabled={isPending}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-muted/80 rounded-md"
                                        onClick={toggleConfirmPasswordVisibility}
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
                                {errors.confirmPassword && (
                                    <p className="text-sm text-destructive animate-in fade-in duration-200">
                                        {errors.confirmPassword}
                                    </p>
                                )}
                            </div>

                            <div className="bg-muted/30 border border-border/50 rounded-lg p-3">
                                <p className="text-sm font-medium mb-2 text-foreground">
                                    Requisitos de la contraseña:
                                </p>
                                <ul className="text-xs text-muted-foreground space-y-1">
                                    <li>• Mínimo 6 caracteres</li>
                                    <li>• Al menos una letra mayúscula</li>
                                    <li>• Al menos una letra minúscula</li>
                                    <li>• Al menos un número</li>
                                </ul>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setStep("code")}
                                    disabled={isPending}
                                    className="flex-1 h-11 border-2 rounded-lg transition-all duration-200"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Volver
                                </Button>
                                <Button
                                    onClick={handleResetPassword}
                                    disabled={isPending}
                                    className="flex-1 h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                                >
                                    {isPending ? (
                                        <div className="flex items-center">
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Actualizando...
                                        </div>
                                    ) : (
                                        "Actualizar Contraseña"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                );

            case "success":
                return (
                    <div className="px-6 pb-6">
                        <div className="text-center space-y-5">
                            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold text-foreground">
                                    ¡Contraseña Actualizada!
                                </h3>
                                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                                    Tu contraseña ha sido restablecida correctamente. Ya puedes iniciar sesión con tu nueva contraseña.
                                </p>
                            </div>

                            <Button
                                onClick={handleClose}
                                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                            >
                                Continuar
                            </Button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const getStepTitle = () => {
        switch (step) {
            case "email":
                return "Restablecer Contraseña";
            case "code":
                return "Verificar Código";
            case "password":
                return "Nueva Contraseña";
            case "success":
                return "¡Completado!";
            default:
                return "Restablecer Contraseña";
        }
    };

    const getStepDescription = () => {
        switch (step) {
            case "email":
                return "Ingresa tu email para recibir un código de verificación";
            case "code":
                return "Verifica tu identidad con el código enviado";
            case "password":
                return "Crea tu nueva contraseña segura";
            case "success":
                return "Tu contraseña ha sido actualizada exitosamente";
            default:
                return "";
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md p-0 gap-0 border-0 bg-transparent shadow-none">
                <div className="bg-background/95 backdrop-blur-md border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="relative bg-gradient-to-br from-primary/8 via-primary/4 to-transparent px-6 pt-8 pb-6">
                        <div className="space-y-2">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-semibold tracking-tight">
                                    {getStepTitle()}
                                </DialogTitle>
                            </DialogHeader>
                            <p className="text-sm text-muted-foreground">
                                {getStepDescription()}
                            </p>
                        </div>
                    </div>

                    {renderStepContent()}
                </div>
            </DialogContent>
        </Dialog>
    );
}