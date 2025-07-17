"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { approvePayment } from "@/features/payment/actions/validation";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Check, Loader2, X } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const approvePaymentSchema = z.object({
    codeOperation: z.string().optional(),
    banckName: z.string().min(1, "El nombre del banco es requerido"),
    dateOperation: z.string().min(1, "La fecha de operación es requerida"),
    numberTicket: z.string().optional(),
});

type ApprovePaymentFormData = z.infer<typeof approvePaymentSchema>;

interface PaymentApprovalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (data: any) => void;
    paymentId: string;
}

export function PaymentApprovalModal({
    isOpen,
    onClose,
    onSuccess,
    paymentId
}: PaymentApprovalModalProps) {
    const [isPending, startTransition] = useTransition();
    const [selectedDate, setSelectedDate] = useState<Date>();

    const form = useForm<ApprovePaymentFormData>({
        resolver: zodResolver(approvePaymentSchema),
        defaultValues: {
            codeOperation: "",
            banckName: "",
            dateOperation: "",
            numberTicket: "",
        },
    });

    const handleSubmit = (data: ApprovePaymentFormData) => {
        startTransition(async () => {
            try {
                const result = await approvePayment(paymentId, data);

                if (result.success) {
                    toast.success(result.message);
                    onSuccess(result.data);
                    onClose();
                    form.reset();
                } else {
                    toast.error(result.message);
                }
            } catch (error) {
                toast.error("Error al aprobar el pago");
            }
        });
    };

    const handleDateSelect = (date: Date | undefined) => {
        if (date) {
            setSelectedDate(date);
            form.setValue("dateOperation", format(date, "yyyy-MM-dd"));
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-success" />
                        Aprobar Pago
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="banckName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre del Banco *</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Ej: Banco de Crédito del Perú"
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="dateOperation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fecha de Operación *</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !selectedDate && "text-muted-foreground"
                                                    )}
                                                    disabled={isPending}
                                                >
                                                    {selectedDate ? (
                                                        format(selectedDate, "dd/MM/yyyy", { locale: es })
                                                    ) : (
                                                        <span>Seleccionar fecha</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={selectedDate}
                                                onSelect={handleDateSelect}
                                                disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="codeOperation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Código de Operación</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Código de operación (opcional)"
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="numberTicket"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Número de Ticket</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Número de ticket (opcional)"
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isPending}
                                className="flex-1"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="flex-1"
                            >
                                {isPending ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Check className="h-4 w-4 mr-2" />
                                )}
                                Aprobar
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}