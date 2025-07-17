"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CheckCircle, Loader2, X } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { completePayment } from "@/features/payment/actions/validation";
import { CompletePaymentRequest } from "@/features/payment/types/approval.type";

const completePaymentSchema = z.object({
    codeOperation: z.string().min(1, "El código de operación es requerido"),
    numberTicket: z.string().min(1, "El número de ticket es requerido"),
});

type CompletePaymentFormData = z.infer<typeof completePaymentSchema>;

interface PaymentCompleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (data: any) => void;
    paymentId: string;
}

export function PaymentCompleteModal({
    isOpen,
    onClose,
    onSuccess,
    paymentId
}: PaymentCompleteModalProps) {
    const [isPending, startTransition] = useTransition();

    const form = useForm<CompletePaymentFormData>({
        resolver: zodResolver(completePaymentSchema),
        defaultValues: {
            codeOperation: "",
            numberTicket: "",
        },
    });

    const handleSubmit = (data: CompletePaymentFormData) => {
        startTransition(async () => {
            try {
                const result = await completePayment(paymentId, data);

                if (result.success) {
                    toast.success(result.message);
                    onSuccess(result.data);
                    onClose();
                    form.reset();
                } else {
                    toast.error(result.message);
                }
            } catch (error) {
                toast.error("Error al completar el pago");
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-success" />
                        Completar Pago
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="codeOperation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Código de Operación *</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Ingrese el código de operación"
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
                                    <FormLabel>Número de Ticket *</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Ingrese el número de ticket"
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
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                )}
                                Completar
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}