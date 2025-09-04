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
import { CreditCard, IdCard, Loader2 } from 'lucide-react';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { validateDocumentAction } from '../../action/register-user';
import {
  DocumentStepData,
  documentStepSchema,
  documentTypes,
} from '../../schemas/register-schemas';

interface DocumentStepProps {
  onNext: (data: DocumentStepData, validatedData?: any) => void;
  defaultValues?: Partial<DocumentStepData>;
}

export function DocumentStep({ onNext, defaultValues }: DocumentStepProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<DocumentStepData>({
    resolver: zodResolver(documentStepSchema),
    defaultValues: {
      documentType: defaultValues?.documentType || undefined,
      documentNumber: defaultValues?.documentNumber || '',
    },
  });

  const onSubmit = (data: DocumentStepData) => {
    startTransition(async () => {
      if (data.documentType === 'DNI') {
        try {
          const result = await validateDocumentAction(
            data.documentNumber,
            'dni',
          );

          if (result.success && result.data) {
            toast.success('Documento validado', {
              description: 'DNI encontrado correctamente',
            });

            onNext(data, {
              firstName: result.data.firstname,
              lastName:
                `${result.data.fathers_lastname} ${result.data.mothers_lastname}`.trim(),
            });
          } else {
            toast.error('Documento no encontrado', {
              description: result.message || 'No se encontró el DNI ingresado',
            });

            onNext(data, null);
          }
        } catch (error) {
          toast.error('Error', {
            description:
              'Error al validar el documento. Continuando sin validación.',
          });
          onNext(data, null);
        }
      } else {
        onNext(data, null);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Información del Documento</h2>
        <p className="text-muted-foreground mt-2">
          Ingresa tu información de identificación
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="documentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Documento</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger>
                      <div className="flex items-center gap-2">
                        <IdCard className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Selecciona el tipo de documento" />
                      </div>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {documentTypes.map((docType) => (
                      <SelectItem key={docType.value} value={docType.value}>
                        {docType.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="documentNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Documento</FormLabel>
                <FormControl>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...field}
                      placeholder="Ingresa tu número de documento"
                      className="pl-10"
                      disabled={isPending}
                      maxLength={20}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch('documentType') === 'DNI' && (
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Validación automática:</strong> Al continuar,
                validaremos tu DNI automáticamente y completaremos tus datos
                personales si los encontramos.
              </p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {form.watch('documentType') === 'DNI'
                  ? 'Validando documento...'
                  : 'Continuando...'}
              </>
            ) : (
              'Continuar'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
