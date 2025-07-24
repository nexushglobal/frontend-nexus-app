"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createCustomerAction, updateCustomerAction } from "@/features/shared/action/culqi";
import { customerSchema, customerUpdateSchema, type CustomerFormData, type CustomerUpdateFormData } from "@/features/shared/schemas/customer.schema";
import { type DefaultData, type culqiData } from "@/features/shared/types/culqi.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultData?: DefaultData;
  culqiData?: culqiData;
  culqiCustomerId?: string;
  mode: 'create' | 'edit';
}

const COUNTRY_OPTIONS = [
  { value: "PE", label: "Perú" },
  { value: "CO", label: "Colombia" },
  { value: "MX", label: "México" },
  { value: "US", label: "Estados Unidos" },
  { value: "AR", label: "Argentina" },
  { value: "CL", label: "Chile" },
  { value: "EC", label: "Ecuador" },
  { value: "BO", label: "Bolivia" },
];

export function CustomerModal({
  isOpen,
  onClose,
  onSuccess,
  defaultData,
  culqiData,
  culqiCustomerId,
  mode
}: CustomerModalProps) {
  const [isPending, startTransition] = useTransition();

  const isEditMode = mode === 'edit';
  const schema = isEditMode ? customerUpdateSchema : customerSchema;

  const form = useForm<CustomerFormData | CustomerUpdateFormData>({
    resolver: zodResolver(schema),
    defaultValues: isEditMode && culqiData ? {
      first_name: culqiData.firstName,
      last_name: culqiData.lastName,
      address: culqiData.address,
      address_city: culqiData.address_city,
      country_code: culqiData.country_code,
      phone_number: culqiData.phone,
    } : {
      email: defaultData?.email || "",
      first_name: defaultData?.firstName || "",
      last_name: defaultData?.lastName || "",
      address: defaultData?.address || "",
      address_city: defaultData?.address_city || "",
      country_code: defaultData?.country_code || "PE",
      phone_number: defaultData?.phone || "",
    },
  });

  const handleSubmit = (data: CustomerFormData | CustomerUpdateFormData) => {
    startTransition(async () => {
      try {
        let result;

        if (isEditMode && culqiCustomerId) {
          result = await updateCustomerAction(culqiCustomerId, data as CustomerUpdateFormData);
        } else {
          result = await createCustomerAction(data as CustomerFormData);
        }

        if (result.success) {
          toast.success(isEditMode ? "Cliente actualizado exitosamente" : "Cliente creado exitosamente");
          form.reset();
          onSuccess();
          onClose();
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Error inesperado");
      }
    });
  };

  const handleClose = () => {
    if (!isPending) {
      form.reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar información del cliente" : "Registrar información del cliente"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {!isEditMode && (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="ejemplo@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input placeholder="Pérez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input placeholder="Av. Principal 123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="address_city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ciudad</FormLabel>
                    <FormControl>
                      <Input placeholder="Lima" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>País</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar país" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {COUNTRY_OPTIONS.map((country) => (
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
            </div>

            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input placeholder="+51 999 999 999" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? "Actualizar" : "Registrar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
