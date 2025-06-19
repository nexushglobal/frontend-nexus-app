"use client";

import { useState, useTransition } from "react";
import { Mail, Lock, ArrowLeft, Check, Loader2 } from "lucide-react";
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

    // Form state
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

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
        setErrors({});
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

    const renderStepContent = () => {
        switch (step) {
            case "email":
                return (
                    <div className="space-y-4">
                        <div className="text-center space-y-2">
                            <h3 className="text-lg font-semibold">Restablecer Contraseña</h3>
                            <p className="text-sm text-muted-foreground">
                                Ingresa tu email para recibir un código de verificación
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reset-email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="reset-email"
                                    type="email"
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (errors.email) setErrors({ ...errors, email: undefined });
                                    }}
                                    className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                                    disabled={isPending}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-sm text-destructive">{errors.email}</p>
                            )}
                        </div>

                        <Button
                            onClick={handleRequestReset}
                            className="w-full"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Enviando código...
                                </>
                            ) : (
                                "Enviar Código"
                            )}
                        </Button>
                    </div>
                );

            case "code":
                return (
                    <div className="space-y-4">
                        <div className="text-center space-y-2">
                            <h3 className="text-lg font-semibold">Verificar Código</h3>
                            <p className="text-sm text-muted-foreground">
                                Ingresa el código de 5 dígitos enviado a <strong>{email}</strong>
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-center block">Código de Verificación</Label>
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
                                    <p className="text-sm text-destructive text-center">{errors.code}</p>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setStep("email")}
                                    disabled={isPending}
                                    className="flex-1"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Volver
                                </Button>
                                <Button
                                    onClick={handleValidateCode}
                                    disabled={isPending || code.length !== 5}
                                    className="flex-1"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Verificando...
                                        </>
                                    ) : (
                                        "Verificar"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                );

            case "password":
                return (
                    <div className="space-y-4">
                        <div className="text-center space-y-2">
                            <h3 className="text-lg font-semibold">Nueva Contraseña</h3>
                            <p className="text-sm text-muted-foreground">
                                Ingresa tu nueva contraseña
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="new-password">Nueva Contraseña</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="new-password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={newPassword}
                                        onChange={(e) => {
                                            setNewPassword(e.target.value);
                                            if (errors.newPassword) setErrors({ ...errors, newPassword: undefined });
                                        }}
                                        className={`pl-10 ${errors.newPassword ? 'border-destructive' : ''}`}
                                        disabled={isPending}
                                    />
                                </div>
                                {errors.newPassword && (
                                    <p className="text-sm text-destructive">{errors.newPassword}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                                        }}
                                        className={`pl-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                                        disabled={isPending}
                                    />
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setStep("code")}
                                    disabled={isPending}
                                    className="flex-1"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Volver
                                </Button>
                                <Button
                                    onClick={handleResetPassword}
                                    disabled={isPending}
                                    className="flex-1"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Actualizando...
                                        </>
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
                    <div className="space-y-4 text-center">
                        <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                            <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">¡Contraseña Actualizada!</h3>
                            <p className="text-sm text-muted-foreground">
                                Tu contraseña ha sido restablecida correctamente. Ya puedes iniciar sesión con tu nueva contraseña.
                            </p>
                        </div>

                        <Button onClick={handleClose} className="w-full">
                            Continuar
                        </Button>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="sr-only">
                        Restablecer Contraseña
                    </DialogTitle>
                </DialogHeader>

                {renderStepContent()}
            </DialogContent>
        </Dialog>
    );
}