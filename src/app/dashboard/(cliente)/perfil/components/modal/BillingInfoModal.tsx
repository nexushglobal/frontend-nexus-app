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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BillingInfo } from "@/types/profile.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building, MapPin, Receipt, Save, X, Info } from "lucide-react";
import { useState, useTransition, useEffect } from "react";
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
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

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
                    toast.success("Información actualizada", {
                        description: "Tu información de facturación se ha actualizado correctamente",
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
                ruc: billingInfo?.ruc || "",
                razonSocial: billingInfo?.razonSocial || "",
                address: billingInfo?.address || "",
            });
        }
    };

    const FormContent = () => (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <ScrollArea className={isMobile ? "h-[60vh]" : "max-h-[70vh]"}>
                    <div className="space-y-6 pr-4">
                        {/* Alerta informativa */}
                        <Alert className="border-info/20 bg-info/5">
                            <Info className="h-4 w-4 text-info" />
                            <AlertDescription className="text-sm">
                                <strong>Información opcional:</strong> Completa estos datos solo si requieres facturación empresarial o comprobantes fiscales.
                            </AlertDescription>
                        </Alert>

                        {/* Información Fiscal */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground">
                                Información Fiscal
                                <span className="text-xs text-muted-foreground ml-1">(opcional)</span>
                            </h3>

                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="ruc"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>RUC (Registro Único de Contribuyente)</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Receipt className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        {...field}
                                                        placeholder="20123456789"
                                                        className="pl-10 font-mono"
                                                        disabled={isPending}
                                                        maxLength={11}
                                                    />
                                                </div>
                                            </FormControl>
                                            <p className="text-xs text-muted-foreground">
                                                11 dígitos para empresas, 8 para personas naturales con negocio
                                            </p>
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
                                                        placeholder="Mi Empresa S.A.C."
                                                        className="pl-10"
                                                        disabled={isPending}
                                                    />
                                                </div>
                                            </FormControl>
                                            <p className="text-xs text-muted-foreground">
                                                Nombre oficial de la empresa o negocio
                                            </p>
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
                                                        placeholder="Av. Principal 123, Distrito, Ciudad"
                                                        className="pl-10"
                                                        disabled={isPending}
                                                    />
                                                </div>
                                            </FormControl>
                                            <p className="text-xs text-muted-foreground">
                                                Dirección registrada en SUNAT para facturación
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
                                📋 Información importante
                            </h4>
                            <ul className="text-xs text-muted-foreground space-y-1">
                                <li>• Esta información es necesaria solo para facturación empresarial</li>
                                <li>• El RUC debe estar activo y registrado en SUNAT</li>
                                <li>• La razón social debe coincidir con el registro oficial</li>
                                <li>• Los datos se utilizarán para generar comprobantes fiscales válidos</li>
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
                            <Receipt className="h-5 w-5" />
                            Información de Facturación
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
                        <Receipt className="h-5 w-5" />
                        Información de Facturación
                    </DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-hidden">
                    <FormContent />
                </div>
            </DialogContent>
        </Dialog>
    );
}