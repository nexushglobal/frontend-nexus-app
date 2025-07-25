'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TermsAndConditionsModal } from '@/features/shared/components/TermsAndConditionsModal';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  FileText,
  Loader2,
  Lock,
  Mail,
} from 'lucide-react';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { registerUserAction } from '../../action/register-user';
import {
  CompleteRegistrationData,
  CredentialsStepData,
  credentialsStepSchema,
} from '../../schemas/register-schemas';

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
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<CredentialsStepData>({
    resolver: zodResolver(credentialsStepSchema),
    defaultValues: {
      email: defaultValues?.email || '',
      password: defaultValues?.password || '',
      confirmPassword: defaultValues?.confirmPassword || '',
      acceptTerms: defaultValues?.acceptTerms || false,
    },
  });

  const onSubmit = (data: CredentialsStepData) => {
    startTransition(async () => {
      try {
        // Combinar todos los datos del registro (sin incluir acceptTerms)
        const completeData: CompleteRegistrationData = {
          ...registrationData,
          email: data.email,
          password: data.password,
        };

        const result = await registerUserAction(completeData);

        if (result.success) {
          toast.success('¡Registro exitoso!', {
            description: 'Tu cuenta ha sido creada correctamente',
          });
          onSuccess();
        } else {
          toast.error('Error en el registro', {
            description: result.message,
          });
        }
      } catch (error) {
        toast.error('Error', {
          description: 'Error de conexión. Intenta nuevamente.',
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

  const handleTermsAccept = (accepted: boolean) => {
    form.setValue('acceptTerms', accepted, { shouldValidate: true });
  };

  const handleTermsLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowTermsModal(true);
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
                      type={showPassword ? 'text' : 'password'}
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
                      type={showConfirmPassword ? 'text' : 'password'}
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
            <p className="text-sm font-medium mb-2">
              Requisitos de la contraseña:
            </p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Mínimo 6 caracteres</li>
              <li>• Al menos una letra mayúscula</li>
              <li>• Al menos una letra minúscula</li>
              <li>• Al menos un número</li>
            </ul>
          </div>

          {/* Términos y Condiciones */}
          <FormField
            control={form.control}
            name="acceptTerms"
            render={({ field }) => (
              <FormItem>
                <div className="border border-primary/20 bg-primary/5 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                        className="mt-1"
                      />
                    </FormControl>
                    <div className="space-y-1">
                      <Label
                        className="text-sm font-medium leading-relaxed cursor-pointer"
                        onClick={() => field.onChange(!field.value)}
                      >
                        Acepto los{' '}
                        <button
                          type="button"
                          onClick={handleTermsLinkClick}
                          className="text-primary hover:text-primary/80 underline underline-offset-2 inline-flex items-center gap-1"
                          disabled={isPending}
                        >
                          <FileText className="h-3 w-3" />
                          términos y condiciones
                        </button>{' '}
                        de Nexus H. Global
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Al registrarte, aceptas nuestros términos de servicio y
                        política de privacidad.
                      </p>
                    </div>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

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
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                'Crear Cuenta'
              )}
            </Button>
          </div>
        </form>
      </Form>

      {/* Modal de Términos y Condiciones */}
      <TermsAndConditionsModal
        open={showTermsModal}
        onOpenChange={setShowTermsModal}
        onAccept={handleTermsAccept}
        isAccepted={form.watch('acceptTerms')}
      />
    </div>
  );
}
