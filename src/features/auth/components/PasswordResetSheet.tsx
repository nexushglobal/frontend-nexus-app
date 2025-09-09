'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-opt';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  Key,
  Loader2,
  Lock,
  Mail,
  Shield,
} from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { requestPasswordResetAction } from '../actions/request-password-reset';
import { resetPasswordAction } from '../actions/reset-password';
import { validateResetTokenAction } from '../actions/validate-reset-token';

interface PasswordResetSheetProps {
  children: React.ReactNode;
}

type Step = 'email' | 'code' | 'password' | 'success';

export function PasswordResetSheet({ children }: PasswordResetSheetProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('email');
  const [isPending, startTransition] = useTransition();
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Form state
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
    setStep('email');
    setEmail('');
    setCode('');
    setNewPassword('');
    setConfirmPassword('');
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setErrors({});
    setFocusedField(null);
  };

  const validateEmail = (email: string) => {
    if (!email) return 'El email es requerido';
    if (!/\S+@\S+\.\S+/.test(email)) return 'El email no es válido';
    return null;
  };

  const validateCode = (code: string) => {
    if (!code) return 'El código es requerido';
    if (code.length !== 5) return 'El código debe tener 5 dígitos';
    return null;
  };

  const validatePassword = (password: string) => {
    if (!password) return 'La contraseña es requerida';
    if (password.length < 6)
      return 'La contraseña debe tener al menos 6 caracteres';
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
      const result = await requestPasswordResetAction(email);

      if (result.success) {
        toast.success('Código enviado', {
          description:
            'Revisa tu correo electrónico para obtener el código de verificación',
        });
        setStep('code');
      } else {
        toast.error('Error', {
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
      const result = await validateResetTokenAction(code, email);

      if (result.success) {
        toast.success('Código válido', {
          description: 'Ahora puedes establecer tu nueva contraseña',
        });
        setStep('password');
      } else {
        toast.error('Código inválido', {
          description: result.message,
        });
      }
    });
  };

  const handleResetPassword = () => {
    const passwordError = validatePassword(newPassword);
    const confirmError =
      newPassword !== confirmPassword ? 'Las contraseñas no coinciden' : null;

    if (passwordError || confirmError) {
      setErrors({
        newPassword: passwordError || undefined,
        confirmPassword: confirmError || undefined,
      });
      return;
    }

    setErrors({});
    startTransition(async () => {
      const result = await resetPasswordAction(code, email, newPassword);

      if (result.success) {
        toast.success('¡Contraseña restablecida!', {
          description: 'Tu contraseña ha sido actualizada correctamente',
        });
        setStep('success');
      } else {
        toast.error('Error', {
          description: result.message,
        });
      }
    });
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(resetForm, 300);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setTimeout(resetForm, 300);
    }
  };

  const getStepIcon = () => {
    switch (step) {
      case 'email':
        return <Mail className="w-5 h-5 text-primary" />;
      case 'code':
        return <Shield className="w-5 h-5 text-primary" />;
      case 'password':
        return <Key className="w-5 h-5 text-primary" />;
      case 'success':
        return <Check className="w-5 h-5 text-green-500" />;
      default:
        return <Shield className="w-5 h-5 text-primary" />;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 'email':
        return 'Restablecer Contraseña';
      case 'code':
        return 'Verificar Código';
      case 'password':
        return 'Nueva Contraseña';
      case 'success':
        return '¡Completado!';
      default:
        return 'Restablecer Contraseña';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 'email':
        return 'Ingresa tu email para recibir un código de verificación';
      case 'code':
        return 'Verifica tu identidad con el código enviado';
      case 'password':
        return 'Crea tu nueva contraseña segura';
      case 'success':
        return 'Tu contraseña ha sido actualizada exitosamente';
      default:
        return '';
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 'email':
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label
                htmlFor="reset-email"
                className="text-sm font-semibold text-foreground"
              >
                Correo Electrónico
              </Label>
              <div className="relative group">
                <div
                  className={cn(
                    'absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300',
                    focusedField === 'email' || email
                      ? 'text-primary scale-110'
                      : 'text-muted-foreground group-hover:text-primary/70',
                  )}
                >
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
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className={cn(
                    'pl-12 h-12 border-2 transition-all duration-300 rounded-xl bg-background/60 backdrop-blur-sm shadow-sm',
                    'hover:shadow-md hover:bg-background/80',
                    errors.email
                      ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                      : 'border-border/60 focus:border-primary focus:ring-primary/20 hover:border-primary/40',
                  )}
                  disabled={isPending}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive animate-in fade-in slide-in-from-left-1 duration-300">
                  {errors.email}
                </p>
              )}
            </div>

            <Button
              onClick={handleRequestReset}
              className="w-full h-12 bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary text-primary-foreground font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              disabled={isPending}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Enviando código...</span>
                </div>
              ) : (
                <span>Enviar Código</span>
              )}
            </Button>
          </div>
        );

      case 'code':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="bg-primary/10 rounded-xl p-4 inline-block">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                Ingresa el código de 5 dígitos enviado a{' '}
                <span className="font-semibold text-foreground">{email}</span>
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <Label className="text-center block text-sm font-semibold text-foreground">
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
                    className="gap-3"
                  >
                    <InputOTPGroup className="gap-3">
                      <InputOTPSlot index={0} className="w-12 h-12 border-2 rounded-xl text-lg font-bold" />
                      <InputOTPSlot index={1} className="w-12 h-12 border-2 rounded-xl text-lg font-bold" />
                      <InputOTPSlot index={2} className="w-12 h-12 border-2 rounded-xl text-lg font-bold" />
                      <InputOTPSlot index={3} className="w-12 h-12 border-2 rounded-xl text-lg font-bold" />
                      <InputOTPSlot index={4} className="w-12 h-12 border-2 rounded-xl text-lg font-bold" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                {errors.code && (
                  <p className="text-sm text-destructive text-center animate-in fade-in duration-300">
                    {errors.code}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep('email')}
                  disabled={isPending}
                  className="flex-1 h-11 border-2 rounded-xl hover:bg-muted/50 transition-all duration-200"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver
                </Button>
                <Button
                  onClick={handleValidateCode}
                  disabled={isPending || code.length !== 5}
                  className="flex-1 h-11 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold rounded-xl transition-all duration-300"
                >
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Verificando...</span>
                    </div>
                  ) : (
                    <span>Verificar</span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        );

      case 'password':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-3">
                <Label
                  htmlFor="new-password"
                  className="text-sm font-semibold text-foreground"
                >
                  Nueva Contraseña
                </Label>
                <div className="relative group">
                  <div
                    className={cn(
                      'absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300',
                      focusedField === 'newPassword' || newPassword
                        ? 'text-primary scale-110'
                        : 'text-muted-foreground group-hover:text-primary/70',
                    )}
                  >
                    <Lock className="h-4 w-4" />
                  </div>
                  <Input
                    id="new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (errors.newPassword)
                        setErrors({ ...errors, newPassword: undefined });
                    }}
                    onFocus={() => setFocusedField('newPassword')}
                    onBlur={() => setFocusedField(null)}
                    className={cn(
                      'pl-12 pr-12 h-12 border-2 transition-all duration-300 rounded-xl bg-background/60 backdrop-blur-sm shadow-sm',
                      'hover:shadow-md hover:bg-background/80',
                      errors.newPassword
                        ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                        : 'border-border/60 focus:border-primary focus:ring-primary/20 hover:border-primary/40',
                    )}
                    disabled={isPending}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-muted/60 rounded-lg transition-all duration-200"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    disabled={isPending}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-destructive animate-in fade-in duration-300">
                    {errors.newPassword}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="confirm-password"
                  className="text-sm font-semibold text-foreground"
                >
                  Confirmar Contraseña
                </Label>
                <div className="relative group">
                  <div
                    className={cn(
                      'absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300',
                      focusedField === 'confirmPassword' || confirmPassword
                        ? 'text-primary scale-110'
                        : 'text-muted-foreground group-hover:text-primary/70',
                    )}
                  >
                    <Lock className="h-4 w-4" />
                  </div>
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword)
                        setErrors({ ...errors, confirmPassword: undefined });
                    }}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField(null)}
                    className={cn(
                      'pl-12 pr-12 h-12 border-2 transition-all duration-300 rounded-xl bg-background/60 backdrop-blur-sm shadow-sm',
                      'hover:shadow-md hover:bg-background/80',
                      errors.confirmPassword
                        ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                        : 'border-border/60 focus:border-primary focus:ring-primary/20 hover:border-primary/40',
                    )}
                    disabled={isPending}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-muted/60 rounded-lg transition-all duration-200"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isPending}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive animate-in fade-in duration-300">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-muted/30 border border-border/50 rounded-xl p-4">
              <p className="text-sm font-semibold mb-3 text-foreground flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Requisitos de la contraseña:
              </p>
              <ul className="text-xs text-muted-foreground space-y-1.5 ml-6">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                  Mínimo 6 caracteres
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                  Al menos una letra mayúscula
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                  Al menos una letra minúscula
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                  Al menos un número
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep('code')}
                disabled={isPending}
                className="flex-1 h-11 border-2 rounded-xl hover:bg-muted/50 transition-all duration-200"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
              <Button
                onClick={handleResetPassword}
                disabled={isPending}
                className="flex-1 h-11 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold rounded-xl transition-all duration-300"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Actualizando...</span>
                  </div>
                ) : (
                  <span>Actualizar Contraseña</span>
                )}
              </Button>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/20 dark:to-green-900/10 rounded-2xl flex items-center justify-center">
              <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-foreground">
                ¡Contraseña Actualizada!
              </h3>
              <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Tu contraseña ha sido restablecida correctamente. Ya puedes
                iniciar sesión con tu nueva contraseña.
              </p>
            </div>

            <Button
              onClick={handleClose}
              className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              Continuar
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[480px] p-0 bg-gradient-to-br from-background via-background/98 to-background/95 border-l border-border/30">
        {/* Header dinámico */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
          <div className="relative px-6 pt-8 pb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                {getStepIcon()}
              </div>
              <div>
                <SheetHeader className="p-0">
                  <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    {getStepTitle()}
                  </SheetTitle>
                  <SheetDescription className="text-muted-foreground/80">
                    {getStepDescription()}
                  </SheetDescription>
                </SheetHeader>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="flex gap-2 mt-6">
              {['email', 'code', 'password', 'success'].map((stepName, index) => (
                <div
                  key={stepName}
                  className={cn(
                    'h-1 rounded-full transition-all duration-300',
                    index < ['email', 'code', 'password', 'success'].indexOf(step)
                      ? 'bg-primary flex-1'
                      : index === ['email', 'code', 'password', 'success'].indexOf(step)
                      ? 'bg-primary/60 flex-1'
                      : 'bg-muted flex-1'
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 flex-1 flex flex-col">
          <div className="flex-1">
            {renderStepContent()}
          </div>

          {/* Footer decorativo */}
          {step !== 'success' && (
            <div className="mt-auto pt-8">
              <div className="text-center">
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-border to-transparent mx-auto mb-4" />
                <p className="text-xs text-muted-foreground/60">
                  Nexus H. Global • Recuperación Segura
                </p>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}