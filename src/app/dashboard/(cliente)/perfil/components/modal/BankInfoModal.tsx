"use client";

import { ResponsiveModal } from "@/components/common/ResponsiveModal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
import { banks } from "@/data/general.data";
import { BankInfo } from "@/types/profile.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Hash, Landmark, Save, Shield, X } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateBankInfo } from "../../actions/profile";
import { BankInfoFormData, bankInfoSchema } from "../../schemas/profile-schemas";

interface Props {
    children: React.ReactNode;
    bankInfo: BankInfo | null;
    onUpdate: () => void;
}


export function BankInfoModal({ children, bankInfo, onUpdate }: Props) {
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
                    toast.success("Información bancaria actualizada", {
                        description: "Tu información bancaria se ha actualizado correctamente",
                    });
                    setOpen(false);
                    onUpdate();
                } else {
                    toast.error("Error al actualizar", {
                        description: result.message,
                    });
                }
            } catch (error) {
                toast.error("Error de conexión", {
                    description: "No se pudo actualizar la información. Intenta nuevamente.",
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

    const formContent = (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Alert className="border-primary/20 bg-primary/5">
                    <Shield className="h-4 w-4 text-primary" />
                    <AlertDescription className="text-sm">
                        <strong>Información segura:</strong> Tus datos bancarios están protegidos y solo se mostrarán parcialmente para tu seguridad.
                    </AlertDescription>
                </Alert>

                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">
                        Información del Banco
                    </h3>

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
                                                <SelectValue placeholder="Selecciona tu banco" />
                                            </div>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {banks.map((bank) => (
                                            <SelectItem key={bank.value} value={bank.value}>
                                                <div className="flex items-center gap-2">
                                                    <span>{bank.icon}</span>
                                                    <span>{bank.label}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">
                        Información de la Cuenta
                        <span className="text-xs text-muted-foreground ml-1">(opcional)</span>
                    </h3>

                    <div className="space-y-4">
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
                                                placeholder="1234567890123456"
                                                className="pl-10 font-mono"
                                                disabled={isPending}
                                            />
                                        </div>
                                    </FormControl>
                                    <p className="text-xs text-muted-foreground">
                                        El número se mostrará parcialmente por seguridad
                                    </p>
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
                                                placeholder="12345678901234567890"
                                                className="pl-10 font-mono"
                                                disabled={isPending}
                                                maxLength={20}
                                            />
                                        </div>
                                    </FormControl>
                                    <p className="text-xs text-muted-foreground">
                                        20 dígitos. Se mostrará parcialmente por seguridad
                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                        💡 Información importante
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Esta información será utilizada para transferencias y pagos</li>
                        <li>• Los datos se almacenan de forma segura y encriptada</li>
                        <li>• Solo se mostrarán los últimos 4 dígitos por seguridad</li>
                        <li>• Puedes actualizar esta información en cualquier momento</li>
                    </ul>
                </div>
            </form>
        </Form>
    );

    // Acciones personalizadas
    const customActions = (
        <div className="flex flex-col-reverse sm:flex-row gap-3">
            <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="flex-1 sm:flex-none"
            >
                <X className="mr-2 h-4 w-4" />
                Cancelar
            </Button>

            <Button
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
                disabled={isPending}
                className="flex-1 sm:flex-none"
            >
                {isPending ? (
                    <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Guardando...
                    </>
                ) : (
                    <>
                        <Save className="mr-2 h-4 w-4" />
                        Guardar Información
                    </>
                )}
            </Button>
        </div>
    );

    return (
        <ResponsiveModal
            open={open}
            onOpenChange={handleOpenChange}
            title="Información Bancaria"
            icon={Landmark}
            content={formContent}
            customFooter={customActions}
            isPending={isPending}
        >
            {children}
        </ResponsiveModal>
    );
}