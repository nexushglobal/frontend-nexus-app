"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { BillingInfo } from "@/types/profile.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building, MapPin, Receipt } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { BillingInfoFormData, billingInfoSchema } from "../../schemas/profile-schemas";
import { updateBillingInfo } from "../../actions/profile";

interface BillingInfoModalProps {
    children: React.ReactNode;
    billingInfo: BillingInfo | null;
    onUpdate: () => void;
}

export function BillingInfoModal({ children, billingInfo, onUpdate }: BillingInfoModalProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const form = useForm<BillingInfoFormData>({
        resolver: zodResolver(billingInfoSchema),
        defaultValues: {
            ruc: billingInfo?.ruc || "",
            razonSocial: billingInfo?.razonSocial || "",
            address: billingInfo?.address || "",
        },
    });

    const onSubmit = (data: BillingInfoFormData) => {
        startTransition(async () => {
            try {
                const result = await updateBillingInfo({
                    ruc: data.ruc || undefined,
                    razonSocial: data.razonSocial || undefined,
                    address: data.address || undefined,
                });

                if (result.success) {
                    toast.success("Éxito", {
                        description: result.message,
                    });
                    setOpen(false);
                    onUpdate();
                } else {
                    toast.error("Error", {
                        description: result.message,
                    });
                }
            } catch (error) {
                toast.error("Error", {
                    description: "Error de conexión. Intenta nuevamente.",
                });
            }
        });
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (newOpen) {
            // Reset form when opening
            form.reset({
                ruc: billingInfo?.ruc || "",
                razonSocial: billingInfo?.razonSocial || "",
                address: billingInfo?.address || "",
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Receipt className="h-5 w-5" />
                        Información de Facturación
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="ruc"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>RUC</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Receipt className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                {...field}
                                                placeholder="12345678910"
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
                            name="razonSocial"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Razón Social</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                {...field}
                                                placeholder="Nombre de la empresa"
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
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dirección Fiscal</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                {...field}
                                                placeholder="Dirección de la empresa"
                                                className="pl-10"
                                                disabled={isPending}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                disabled={isPending}
                                className="flex-1"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="flex-1"
                            >
                                {isPending ? "Guardando..." : "Guardar"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}