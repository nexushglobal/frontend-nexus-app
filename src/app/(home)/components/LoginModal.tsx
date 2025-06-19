"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock } from "lucide-react";
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
import { PasswordResetModal } from "./PasswordResetModal";

interface LoginModalProps {
    children: React.ReactNode;
}

export function LoginModal({ children }: LoginModalProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
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
                // Manejar diferentes tipos de errores
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
                setErrors({});
                router.push("/dashboard");
                router.refresh(); // Refresh para actualizar el estado de la sesión
            }
        } catch (error) {
            toast.error("Error de conexión", {
                description: "Por favor intenta nuevamente",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl font-semibold">
                        Iniciar Sesión
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email) setErrors({ ...errors, email: undefined });
                                }}
                                className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                                disabled={isLoading}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (errors.password) setErrors({ ...errors, password: undefined });
                                }}
                                className={`pl-10 ${errors.password ? 'border-destructive' : ''}`}
                                disabled={isLoading}
                            />
                        </div>
                        {errors.password && (
                            <p className="text-sm text-destructive">{errors.password}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-end">
                        <PasswordResetModal>
                            <Button
                                type="button"
                                variant="link"
                                className="h-auto p-0 text-sm"
                                disabled={isLoading}
                            >
                                ¿Olvidaste tu contraseña?
                            </Button>
                        </PasswordResetModal>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Iniciando sesión...
                            </>
                        ) : (
                            "Iniciar Sesión"
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}