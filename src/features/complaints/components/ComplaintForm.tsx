'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, CheckCircle } from 'lucide-react';
import { FormSection } from '@/features/shared/components/form/FormSection';
import { complaintService } from '../services/complaint.service';
import { complaintSchema, ComplaintFormData } from '../schemas/complaint.schemas';
import { DocumentType, ItemType, ComplaintType } from '../types/complaint.types';

export function ComplaintForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ComplaintFormData>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      fullName: '',
      address: '',
      documentType: DocumentType.DNI,
      documentNumber: '',
      phone: '',
      email: '',
      parentGuardian: '',
      itemType: ItemType.PRODUCT,
      claimAmount: 0,
      description: '',
      detail: '',
      complaintType: ComplaintType.COMPLAINT,
      order: '',
    },
  });

  const onSubmit = async (data: ComplaintFormData) => {
    try {
      setIsSubmitting(true);
      await complaintService.create(data);
      
      toast.success('¡Queja/Reclamo registrado exitosamente!', {
        description: 'Su solicitud ha sido recibida y será procesada pronto.',
      });
      
      setIsSuccess(true);
    } catch (error: any) {
      console.error('Error al enviar queja/reclamo:', error);
      toast.error('Error al enviar su solicitud', {
        description: error?.message || 'Por favor, inténtelo nuevamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewComplaint = () => {
    setIsSuccess(false);
    form.reset();
  };

  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-foreground mb-2">
            ¡Solicitud Enviada!
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Su queja/reclamo ha sido registrado exitosamente. 
            Nos pondremos en contacto con usted pronto.
          </p>
        </div>
        
        <Button 
          onClick={handleNewComplaint}
          className="bg-primary hover:bg-primary-hover text-primary-foreground"
        >
          Enviar Nueva Solicitud
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Información Personal */}
        <FormSection 
          title="Información Personal" 
          subtitle="Datos del consumidor que presenta la queja o reclamo"
          required
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ingrese su nombre completo" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domicilio *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ingrese su domicilio" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="documentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Documento *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="focus:ring-blue-500 focus:border-blue-500">
                        <SelectValue placeholder="Seleccione tipo de documento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={DocumentType.DNI}>DNI</SelectItem>
                      <SelectItem value={DocumentType.CE}>Carné de Extranjería</SelectItem>
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
                  <FormLabel>Número de Documento *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ingrese número de documento" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ingrese su teléfono" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo Electrónico *</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="Ingrese su correo electrónico" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="parentGuardian"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Padre/Madre (en caso de menores de edad)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Nombre del padre o madre" 
                    {...field} 
                    className="focus:ring-blue-500 focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        {/* Información de la Queja/Reclamo */}
        <FormSection 
          title="Información de la Solicitud" 
          subtitle="Detalles sobre el producto o servicio objeto de la queja o reclamo"
          required
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="itemType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Bien *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="focus:ring-blue-500 focus:border-blue-500">
                        <SelectValue placeholder="Seleccione tipo de bien" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={ItemType.PRODUCT}>Producto</SelectItem>
                      <SelectItem value={ItemType.SERVICE}>Servicio</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="claimAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto del Reclamo *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00" 
                      {...field} 
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="complaintType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Solicitud *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="focus:ring-blue-500 focus:border-blue-500">
                        <SelectValue placeholder="Seleccione tipo de solicitud" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={ComplaintType.COMPLAINT}>Queja</SelectItem>
                      <SelectItem value={ComplaintType.CLAIM}>Reclamo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Pedido</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Número de pedido (opcional)" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción del Producto/Servicio *</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describa el producto o servicio objeto de la queja o reclamo"
                    className="min-h-[100px] focus:ring-blue-500 focus:border-blue-500"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="detail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Detalle de la Queja/Reclamo *</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describa en detalle el motivo de su queja o reclamo"
                    className="min-h-[120px] focus:ring-blue-500 focus:border-blue-500"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <div className="flex justify-end pt-6 border-t">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary-hover text-primary-foreground px-8"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar Solicitud
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}