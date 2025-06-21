"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { registerUser } from "../../actions/register-actions";
import {
    CompleteRegistrationData,
    CredentialsStepData,
    credentialsStepSchema,
} from "../../schemas/register-schemas";

interface CredentialsStepProps {
    onPrevious: () => void;
    onSuccess: () => void;
    defaultValues?: Partial<CredentialsStepData>;
    registrationData: Omit<CompleteRegistrationData, keyof CredentialsStepData>;
}

export function CredentialsStep({
    onPrevious,
    onSuccess,
    defaultValues,
    registrationData,
}: CredentialsStepProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isPending, startTransition] = useTransition();

    const form = useForm<CredentialsStepData>({
        resolver: zodResolver(credentialsStepSchema),
        defaultValues: {
            email: defaultValues?.email || "",
            password: defaultValues?.password || "",
            confirmPassword: defaultValues?.confirmPassword || "",
        },
    });

    const onSubmit = (data: CredentialsStepData) => {
        startTransition(async () => {
            try {
                // Combinar todos los datos del registro
                const completeData: CompleteRegistrationData = {
                    ...registrationData,
                    email: data.email,
                    password: data.password,
                };

                const result = await registerUser(completeData);

                if (result.success) {
                    toast.success("¡Registro exitoso!", {
                        description: "Tu cuenta ha sido creada correctamente",
                    });
                    onSuccess();
                } else {
                    toast.error("Error en el registro", {
                        description: result.message,
                    });
                }
            } catch (error) {
                toast.error("Error", {
                    description: "Error de conexión. Intenta nuevamente.",
                });
            }
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold">Credenciales de Acceso</h2>
                <p className="text-muted-foreground mt-2">
                    Crea tu email y contraseña para acceder a la plataforma
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Correo Electrónico</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            {...field}
                                            type="email"
                                            placeholder="tu@email.com"
                                            className="pl-10"
                                            disabled={isPending}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contraseña</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            {...field}
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="pl-10 pr-10"
                                            disabled={isPending}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={togglePasswordVisibility}
                                            disabled={isPending}
                                        >
                                            {showPassword ? (
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
                                <FormLabel>Confirmar Contraseña</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            {...field}
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="pl-10 pr-10"
                                            disabled={isPending}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={toggleConfirmPasswordVisibility}
                                            disabled={isPending}
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

                    <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm font-medium mb-2">Requisitos de la contraseña:</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• Mínimo 6 caracteres</li>
                            <li>• Al menos una letra mayúscula</li>
                            <li>• Al menos una letra minúscula</li>
                            <li>• Al menos un número</li>
                        </ul>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onPrevious}
                            disabled={isPending}
                            className="flex-1"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Anterior
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="flex-1"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Registrando...
                                </>
                            ) : (
                                "Crear Cuenta"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}