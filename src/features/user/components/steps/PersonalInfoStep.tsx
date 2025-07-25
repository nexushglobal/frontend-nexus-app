'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Calendar, Globe, Phone, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
  genderOptions,
  PersonalInfoStepData,
  personalInfoStepSchema,
  spanishSpeakingCountries,
} from '../../schemas/register-schemas';

interface PersonalInfoStepProps {
  onNext: (data: PersonalInfoStepData) => void;
  onPrevious: () => void;
  defaultValues?: Partial<PersonalInfoStepData>;
  validatedData?: {
    firstName?: string;
    lastName?: string;
  } | null;
}

export function PersonalInfoStep({
  onNext,
  onPrevious,
  defaultValues,
  validatedData,
}: PersonalInfoStepProps) {
  const isNamesDisabled = Boolean(
    validatedData?.firstName && validatedData?.lastName,
  );

  const form = useForm<PersonalInfoStepData>({
    resolver: zodResolver(personalInfoStepSchema),
    defaultValues: {
      firstName: validatedData?.firstName || defaultValues?.firstName || '',
      lastName: validatedData?.lastName || defaultValues?.lastName || '',
      phone: defaultValues?.phone || '',
      birthDate: defaultValues?.birthDate || '',
      gender: defaultValues?.gender || undefined,
      country: defaultValues?.country || 'Perú',
    },
  });

  const onSubmit = (data: PersonalInfoStepData) => {
    onNext(data);
  };

  const getMaxDate = () => {
    const today = new Date();
    const eighteenYearsAgo = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate(),
    );
    return eighteenYearsAgo.toISOString().split('T')[0];
  };

  const getMinDate = () => {
    const today = new Date();
    const hundredYearsAgo = new Date(
      today.getFullYear() - 100,
      today.getMonth(),
      today.getDate(),
    );
    return hundredYearsAgo.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Información Personal</h2>
        <p className="text-muted-foreground mt-2">
          Completa tu información personal
        </p>
        {isNamesDisabled && (
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mt-4">
            <p className="text-sm text-green-700 dark:text-green-300">
              ✓ Datos validados automáticamente desde tu documento
            </p>
          </div>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombres</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...field}
                        placeholder="Tus nombres"
                        className="pl-10"
                        disabled={isNamesDisabled}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellidos</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...field}
                        placeholder="Tus apellidos"
                        className="pl-10"
                        disabled={isNamesDisabled}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono/Celular</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...field}
                      placeholder="958920823"
                      className="pl-10"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Nacimiento</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...field}
                        type="date"
                        className="pl-10"
                        min={getMinDate()}
                        max={getMaxDate()}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Género</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu género" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {genderOptions.map((gender) => (
                        <SelectItem key={gender.value} value={gender.value}>
                          {gender.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>País</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Selecciona tu país" />
                      </div>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {spanishSpeakingCountries.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onPrevious}
              className="flex-1"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>
            <Button type="submit" className="flex-1">
              Continuar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
