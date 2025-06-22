"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Loader2, Lock, LogIn, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { PasswordResetModal } from "./PasswordResetModal";

interface LoginModalProps {
    children: React.ReactNode;
}

export function LoginModal({ children }: LoginModalProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const router = useRouter();

    const validateForm = () => {
        const newErrors: { email?: string; password?: string } = {};

        if (!email) {
            newErrors.email = "El email es requerido";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "El email no es válido";
        }

        if (!password) {
            newErrors.password = "La contraseña es requerida";
        } else if (password.length < 6) {
            newErrors.password = "La contraseña debe tener al menos 6 caracteres";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                if (result.error === "CredentialsSignin") {
                    toast.error("Credenciales incorrectas", {
                        description: "Por favor verifica tu email y contraseña",
                    });
                } else {
                    toast.error("Error de autenticación", {
                        description: "Ha ocurrido un error durante el inicio de sesión",
                    });
                }
            } else {
                toast.success("¡Bienvenido!", {
                    description: "Has iniciado sesión correctamente",
                });
                setOpen(false);
                setEmail("");
                setPassword("");
                setShowPassword(false);
                setErrors({});
                setFocusedField(null);
                router.push("/dashboard");
                router.refresh();
            }
        } catch (error) {
            toast.error("Error de conexión", {
                description: "Por favor intenta nuevamente",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            setEmail("");
            setPassword("");
            setShowPassword(false);
            setErrors({});
            setFocusedField(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md p-0 gap-0 border-0 bg-transparent shadow-none">
                <div className="bg-background/95 backdrop-blur-md border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header elegante */}
                    <div className="relative bg-gradient-to-br from-primary/8 via-primary/4 to-transparent px-6 pt-8 pb-6">
                        <div className=" space-y-2">

                            <DialogHeader>
                                <DialogTitle className="text-2xl font-semibold tracking-tight">
                                    Iniciar Sesión
                                </DialogTitle>
                            </DialogHeader>
                            <p className="text-sm text-muted-foreground">
                                Accede a tu cuenta de Nexus H. Global
                            </p>
                        </div>
                    </div>

                    {/* Formulario */}
                    <div className="px-6 pb-6">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Campo Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-foreground">
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
                                        id="email"
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
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-destructive animate-in fade-in duration-200">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Campo Contraseña */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                                    Contraseña
                                </Label>
                                <div className="relative">
                                    <div className={cn(
                                        "absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200",
                                        focusedField === "password" || password ? "text-primary" : "text-muted-foreground"
                                    )}>
                                        <Lock className="h-4 w-4" />
                                    </div>
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            if (errors.password) setErrors({ ...errors, password: undefined });
                                        }}
                                        onFocus={() => setFocusedField("password")}
                                        onBlur={() => setFocusedField(null)}
                                        className={cn(
                                            "pl-10 pr-10 h-11 border-2 transition-all duration-200 rounded-lg bg-background/50",
                                            errors.password
                                                ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                                                : "border-border focus:border-primary focus:ring-primary/20 hover:border-border/80"
                                        )}
                                        disabled={isLoading}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-muted/80 rounded-md"
                                        onClick={togglePasswordVisibility}
                                        disabled={isLoading}
                                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </Button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-destructive animate-in fade-in duration-200">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-end">
                                <PasswordResetModal>
                                    <Button
                                        type="button"
                                        variant="link"
                                        className="h-auto p-0 text-sm text-primary hover:text-primary/80 font-medium"
                                        disabled={isLoading}
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </Button>
                                </PasswordResetModal>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Iniciando sesión...
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <LogIn className="mr-2 h-4 w-4" />
                                        Iniciar Sesión
                                    </div>
                                )}
                            </Button>
                        </form>


                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}