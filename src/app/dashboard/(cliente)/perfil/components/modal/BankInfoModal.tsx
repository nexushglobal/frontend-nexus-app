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
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BankInfo } from "@/types/profile.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Hash, Landmark, Save, X, Shield } from "lucide-react";
import { useState, useTransition, useEffect } from "react";
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
    { value: "BCP", label: "Banco de Crédito del Perú (BCP)", icon: "🏦" },
    { value: "BBVA", label: "BBVA", icon: "🏦" },
    { value: "Interbank", label: "Interbank", icon: "🏦" },
    { value: "Scotiabank", label: "Scotiabank", icon: "🏦" },
    { value: "Banco de la Nación", label: "Banco de la Nación", icon: "🏛️" },
    { value: "Banco Pichincha", label: "Banco Pichincha", icon: "🏦" },
    { value: "Banbif", label: "Banbif", icon: "🏦" },
    { value: "Banco Falabella", label: "Banco Falabella", icon: "🏪" },
    { value: "Banco Ripley", label: "Banco Ripley", icon: "🏪" },
    { value: "Mi Banco", label: "Mi Banco", icon: "🏦" },
    { value: "Otro", label: "Otro banco", icon: "🏦" },
];

export function BankInfoModal({ children, bankInfo, onUpdate }: BankInfoModalProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

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

    const FormContent = () => (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <ScrollArea className={isMobile ? "h-[55vh]" : "max-h-[65vh]"}>
                    <div className="space-y-6 pr-4">
                        {/* Alerta de seguridad */}
                        <Alert className="border-primary/20 bg-primary/5">
                            <Shield className="h-4 w-4 text-primary" />
                            <AlertDescription className="text-sm">
                                <strong>Información segura:</strong> Tus datos bancarios están protegidos y solo se mostrarán parcialmente para tu seguridad.
                            </AlertDescription>
                        </Alert>

                        {/* Información del Banco */}
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

                        {/* Información de la Cuenta */}
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

                        {/* Información adicional */}
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
                    </div>
                </ScrollArea>

                {/* Footer */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t bg-background">
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
            </form>
        </Form>
    );

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={handleOpenChange}>
                <DrawerTrigger asChild>
                    {children}
                </DrawerTrigger>
                <DrawerContent className="max-h-[85vh]">
                    <DrawerHeader className="text-left pb-4">
                        <DrawerTitle className="flex items-center gap-2">
                            <Landmark className="h-5 w-5" />
                            Información Bancaria
                        </DrawerTitle>
                    </DrawerHeader>
                    <div className="px-4 pb-4">
                        <FormContent />
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="flex items-center gap-2">
                        <Landmark className="h-5 w-5" />
                        Información Bancaria
                    </DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-hidden">
                    <FormContent />
                </div>
            </DialogContent>
        </Dialog>
    );
}