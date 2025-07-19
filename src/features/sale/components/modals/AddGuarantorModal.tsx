"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
  UserCheck,
  X,
} from "lucide-react";

import {
  GuarantorFormData,
  guarantorSchema,
} from "../../validations/saleValidation";

interface AddGuarantorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: GuarantorFormData) => void;
  isCreating: boolean;
  editingData?: GuarantorFormData;
  isEditing?: boolean;
}

export default function AddGuarantorModal({
  isOpen,
  onClose,
  onSuccess,
  isCreating,
  editingData,
  isEditing = false,
}: AddGuarantorModalProps) {
  const [error, setError] = useState<string | null>(null);

  const form = useForm<GuarantorFormData>({
    resolver: zodResolver(guarantorSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      document: "",
      documentType: "DNI",
      phone: "",
      address: "",
    },
  });

  useEffect(() => {
    if (editingData && isEditing) {
      form.reset(editingData);
    } else {
      form.reset({
        firstName: "",
        lastName: "",
        document: "",
        documentType: "DNI",
        email: "",
        phone: "",
        address: "",
      });
    }
  }, [editingData, isEditing, form]);

  const onSubmit = async (data: GuarantorFormData) => {
    setError(null);
    try {
      await onSuccess(data);
      form.reset();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al crear el garante";
      setError(errorMessage);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      form.reset();
      setError(null);
      onClose();
    }
  };

  const documentTypeOptions = [
    { value: "DNI", label: "DNI" },
    { value: "CE", label: "CE" },
    { value: "RUC", label: "RUC" },
  ];

  const formFields = [
    {
      name: "firstName",
      label: "Nombre",
      placeholder: "Nombre del garante",
      icon: (
        <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
      ),
      type: "text",
      colSpan: "col-span-1",
    },
    {
      name: "lastName",
      label: "Apellido",
      placeholder: "Apellido del garante",
      icon: (
        <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
      ),
      type: "text",
      colSpan: "col-span-1",
    },
    {
      name: "email",
      label: "Email",
      placeholder: "email@ejemplo.com",
      icon: (
        <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
      ),
      type: "email",
      colSpan: "col-span-2",
    },
    {
      name: "documentType",
      label: "Tipo de Documento",
      type: "select",
      options: documentTypeOptions,
      colSpan: "col-span-1",
    },
    {
      name: "document",
      label: "Número de Documento",
      placeholder: "Número de documento",
      icon: (
        <CreditCard className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
      ),
      type: "text",
      colSpan: "col-span-1",
    },
    {
      name: "phone",
      label: "Teléfono",
      placeholder: "Número de teléfono",
      icon: (
        <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
      ),
      type: "tel",
      colSpan: "col-span-2",
    },

    {
      name: "address",
      label: "Dirección",
      placeholder: "Dirección completa",
      icon: (
        <MapPin className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
      ),
      type: "text",
      colSpan: "col-span-2",
    },
  ] as const;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="flex w-[95vw] max-w-md flex-col p-0 sm:h-auto sm:max-h-[85vh]">
        <DialogHeader className="flex-shrink-0 border-b border-gray-100 px-4 py-4 sm:px-6 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <UserCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">
                {isEditing ? "Editar Garante" : "Agregar Garante"}
              </DialogTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Registra la información del garante (aval) para la venta
              </p>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert
                  variant="destructive"
                  className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {formFields.map((field, index) => (
                  <div key={index} className={field.colSpan}>
                    <FormField
                      control={form.control}
                      name={field.name}
                      render={({ field: formField }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            {field.label}
                          </FormLabel>
                          <FormControl>
                            {field.type === "select" ? (
                              <Select
                                value={formField.value}
                                onValueChange={formField.onChange}
                                disabled={isCreating}
                              >
                                <SelectTrigger className="h-10">
                                  <div className="flex items-center">
                                    <SelectValue
                                      placeholder={`Seleccionar ${field.label.toLowerCase()}`}
                                    />
                                  </div>
                                </SelectTrigger>
                                <SelectContent>
                                  {field.options?.map((option) => (
                                    <SelectItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <div className="relative">
                                {field.icon}
                                <Input
                                  placeholder={field.placeholder}
                                  className="bg-white pl-9 dark:bg-gray-900"
                                  type={field.type}
                                  {...formField}
                                  disabled={isCreating}
                                />
                              </div>
                            )}
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            </form>
          </Form>
        </ScrollArea>

        <DialogFooter className="flex-shrink-0 flex-col gap-2 border-t border-gray-100 bg-gray-50 px-4 py-4 sm:flex-row sm:px-6 dark:border-gray-800 dark:bg-gray-900/50">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isCreating}
            className="flex w-full items-center justify-center gap-2 sm:w-auto"
            size="sm"
          >
            <X className="h-4 w-4" />
            Cancelar
          </Button>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isCreating || !form.formState.isValid}
            className="flex w-full items-center justify-center gap-2 sm:w-auto"
            size="sm"
          >
            {isCreating ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {isEditing ? "Actualizando..." : "Guardando..."}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isEditing ? "Actualizar Garante" : "Guardar Garante"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
