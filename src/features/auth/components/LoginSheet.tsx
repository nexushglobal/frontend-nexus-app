"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Loader2, Lock, LogIn, Mail, Shield } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { PasswordResetSheet } from "./PasswordResetSheet";

interface LoginSheetProps {
  children: React.ReactNode;
}

export function LoginSheet({ children }: LoginSheetProps) {
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
        resetForm();
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
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

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setErrors({});
    setFocusedField(null);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[480px] p-0 bg-gradient-to-br from-background via-background/98 to-background/95 border-l border-border/30">
        {/* Header con gradiente */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
          <div className="relative px-6 pt-8 pb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <SheetHeader className="p-0">
                  <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    Iniciar Sesión
                  </SheetTitle>
                  <SheetDescription className="text-muted-foreground/80">
                    Accede a tu cuenta de Nexus H. Global
                  </SheetDescription>
                </SheetHeader>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="px-6 pb-6 flex-1 flex flex-col">
          <form onSubmit={handleSubmit} className="space-y-6 flex-1">
            {/* Campo Email */}
            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                Correo Electrónico
              </Label>
              <div className="relative group">
                <div
                  className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300",
                    focusedField === "email" || email
                      ? "text-primary scale-110"
                      : "text-muted-foreground group-hover:text-primary/70"
                  )}
                >
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
                    "pl-12 h-12 border-2 transition-all duration-300 rounded-xl bg-background/60 backdrop-blur-sm shadow-sm",
                    "hover:shadow-md hover:bg-background/80",
                    errors.email
                      ? "border-destructive focus:border-destructive focus:ring-destructive/20 shadow-destructive/20"
                      : "border-border/60 focus:border-primary focus:ring-primary/20 focus:shadow-primary/20 hover:border-primary/40"
                  )}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive animate-in fade-in slide-in-from-left-1 duration-300">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-3">
              <Label htmlFor="password" className="text-sm font-semibold text-foreground">
                Contraseña
              </Label>
              <div className="relative group">
                <div
                  className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300",
                    focusedField === "password" || password
                      ? "text-primary scale-110"
                      : "text-muted-foreground group-hover:text-primary/70"
                  )}
                >
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
                    "pl-12 pr-12 h-12 border-2 transition-all duration-300 rounded-xl bg-background/60 backdrop-blur-sm shadow-sm",
                    "hover:shadow-md hover:bg-background/80",
                    errors.password
                      ? "border-destructive focus:border-destructive focus:ring-destructive/20 shadow-destructive/20"
                      : "border-border/60 focus:border-primary focus:ring-primary/20 focus:shadow-primary/20 hover:border-primary/40"
                  )}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-muted/60 rounded-lg transition-all duration-200 hover:scale-110"
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
                <p className="text-sm text-destructive animate-in fade-in slide-in-from-left-1 duration-300">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Enlace de recuperación de contraseña */}
            <div className="flex items-center justify-end">
              <PasswordResetSheet>
                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0 text-sm text-primary hover:text-primary/80 font-semibold transition-all duration-200 hover:scale-105"
                  disabled={isLoading}
                >
                  ¿Olvidaste tu contraseña?
                </Button>
              </PasswordResetSheet>
            </div>

            {/* Botón de submit */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary text-primary-foreground font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Iniciando sesión...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    <span>Iniciar Sesión</span>
                  </div>
                )}
              </Button>
            </div>
          </form>

          {/* Footer decorativo */}
          <div className="mt-auto pt-8">
            <div className="text-center">
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-border to-transparent mx-auto mb-4" />
              <p className="text-xs text-muted-foreground/60">
                Nexus H. Global • Plataforma Segura
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}