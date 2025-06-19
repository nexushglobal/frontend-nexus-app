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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { BankInfo } from "@/types/profile.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Hash, Landmark } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { BankInfoFormData, bankInfoSchema } from "../../schemas/profile-schemas";
import { updateBankInfo } from "../../actions/profile";

interface BankInfoModalProps {
    children: React.ReactNode;
    bankInfo: BankInfo | null;
    onUpdate: () => void;
}

const banks = [
    { value: "BCP", label: "Banco de Crédito del Perú (BCP)" },
    { value: "BBVA", label: "BBVA" },
    { value: "Interbank", label: "Interbank" },
    { value: "Scotiabank", label: "Scotiabank" },
    { value: "Banco de la Nación", label: "Banco de la Nación" },
    { value: "Banco Pichincha", label: "Banco Pichincha" },
    { value: "Banbif", label: "Banbif" },
    { value: "Banco Falabella", label: "Banco Falabella" },
    { value: "Banco Ripley", label: "Banco Ripley" },
    { value: "Mi Banco", label: "Mi Banco" },
    { value: "Otro", label: "Otro" },
];

export function BankInfoModal({ children, bankInfo, onUpdate }: BankInfoModalProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const form = useForm<BankInfoFormData>({
        resolver: zodResolver(bankInfoSchema),
        defaultValues: {
            bankName: bankInfo?.bankName || "",
            accountNumber: bankInfo?.accountNumber || "",
            cci: bankInfo?.cci || "",
        },
    });

    const onSubmit = (data: BankInfoFormData) => {
        startTransition(async () => {
            try {
                const result = await updateBankInfo({
                    bankName: data.bankName || undefined,
                    accountNumber: data.accountNumber || undefined,
                    cci: data.cci || undefined,
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
            form.reset({
                bankName: bankInfo?.bankName || "",
                accountNumber: bankInfo?.accountNumber || "",
                cci: bankInfo?.cci || "",
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
                        <Landmark className="h-5 w-5" />
                        Información Bancaria
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="bankName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Banco</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        disabled={isPending}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <div className="flex items-center gap-2">
                                                    <Landmark className="h-4 w-4 text-muted-foreground" />
                                                    <SelectValue placeholder="Selecciona un banco" />
                                                </div>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {banks.map((bank) => (
                                                <SelectItem key={bank.value} value={bank.value}>
                                                    {bank.label}
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
                            name="accountNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Número de Cuenta</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                {...field}
                                                placeholder="1234567800"
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
                            name="cci"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>CCI (Código de Cuenta Interbancaria)</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Hash className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                {...field}
                                                placeholder="12345678001234567800"
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
