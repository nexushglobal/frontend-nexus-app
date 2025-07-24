"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createCardAction, updateCardAction } from "@/features/shared/action/culqi";
import { cardFormWithDateValidationSchema, type CardFormData } from "@/features/shared/schemas/card.schema";
import culqiService from "@/features/shared/services/culqiService";
import { type CardData } from "@/features/shared/types/culqi.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  card?: CardData;
  email: string;
  mode: 'create' | 'edit';
}

export function CardModal({
  isOpen,
  onClose,
  onSuccess,
  card,
  email,
  mode
}: CardModalProps) {
  const [isPending, startTransition] = useTransition();
  const isEditMode = mode === 'edit';

  const form = useForm<CardFormData>({
    resolver: zodResolver(cardFormWithDateValidationSchema),
    defaultValues: {
      cardNumber: "",
      cvv: "",
      expirationMonth: "",
      expirationYear: "",
      email: email,
    },
  });

  const watchedCardNumber = form.watch("cardNumber");
  const cardBrand = culqiService.detectCardBrand(watchedCardNumber);

  const handleSubmit = (data: CardFormData) => {
    startTransition(async () => {
      try {
        // Crear token primero
        const tokenResponse = await culqiService.createToken({
          cardNumber: data.cardNumber,
          cvv: data.cvv,
          expirationMonth: data.expirationMonth.padStart(2, "0"),
          expirationYear: data.expirationYear,
          email: data.email,
        });

        if (!tokenResponse.success || !tokenResponse.data?.token_id) {
          toast.error(tokenResponse.message || "Error al procesar la tarjeta");
          return;
        }

        console.log("Token creado:", tokenResponse);

        // Crear o actualizar tarjeta
        let result;
        if (isEditMode && card) {
          result = await updateCardAction(card.source_id, {
            tokenId: tokenResponse.data.token_id
          });
        } else {
          result = await createCardAction({
            tokenId: tokenResponse.data.token_id
          });
        }

        if (result.success) {
          toast.success(isEditMode ? "Tarjeta actualizada exitosamente" : "Tarjeta agregada exitosamente");
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

  const formatCardNumber = (value: string) => {
    // Remove all non-numeric characters
    const cleanValue = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    const formatted = cleanValue.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted;
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString().padStart(2, '0'),
    label: (i + 1).toString().padStart(2, '0')
  }));

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            {isEditMode ? "Editar tarjeta" : "Agregar nueva tarjeta"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de tarjeta</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        {...field}
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value);
                          field.onChange(formatted);
                        }}
                      />
                      {cardBrand && (
                        <div className="absolute right-3 top-2">
                          <span className="text-xs font-medium text-muted-foreground">
                            {cardBrand}
                          </span>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="expirationMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mes</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
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
                name="expirationYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Año</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="YYYY" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
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
                name="cvv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVV</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123"
                        maxLength={4}
                        type="password"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="ejemplo@email.com" disabled {...field} />
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
                {isEditMode ? "Actualizar" : "Agregar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
