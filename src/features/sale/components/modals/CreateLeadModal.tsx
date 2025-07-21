// src/features/sale/components/modals/CreateLeadModal.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, User, FileText, Mail } from "lucide-react";
import { ClientRequest } from "../../types/sale-request";

const createLeadSchema = z.object({
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  document: z.string().min(8, "El documento debe tener al menos 8 caracteres"),
  documentType: z.enum(["DNI", "CE", "RUC"], {
    required_error: "Selecciona un tipo de documento",
  }),
  email: z.string().email("Ingresa un email válido"),
});

type CreateLeadFormData = z.infer<typeof createLeadSchema>;

interface CreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (leadData: ClientRequest) => Promise<void>;
  isCreating: boolean;
}

const DOCUMENT_TYPES = [
  { value: "DNI", label: "DNI" },
  { value: "CE", label: "Carnet de Extranjería" },
  { value: "RUC", label: "RUC" },
] as const;

export function CreateLeadModal({
  isOpen,
  onClose,
  onSuccess,
  isCreating,
}: CreateLeadModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateLeadFormData>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      documentType: "DNI",
      document: "",
      email: "",
    },
  });

  const handleSubmit = async (data: CreateLeadFormData) => {
    if (isSubmitting || isCreating) return;

    setIsSubmitting(true);
    try {
      await onSuccess(data);
      form.reset();
      onClose();
    } catch (error) {
      console.error("Error submitting lead:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting || isCreating) return;
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Crear Lead Cliente
          </DialogTitle>
          <DialogDescription>
            Ingresa los datos básicos del cliente. Este será el cliente
            principal de la venta.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombres</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Ingresa los nombres"
                        disabled={isSubmitting || isCreating}
                      />
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
                      <Input
                        {...field}
                        placeholder="Ingresa los apellidos"
                        disabled={isSubmitting || isCreating}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="documentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Tipo
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isSubmitting || isCreating}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DOCUMENT_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="document"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de documento</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Ingresa el número"
                          disabled={isSubmitting || isCreating}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Ingresa el email"
                        disabled={isSubmitting || isCreating}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting || isCreating}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isCreating}
                className="min-w-[120px]"
              >
                {isSubmitting || isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creando...
                  </>
                ) : (
                  "Crear Lead"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
