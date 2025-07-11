"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building, Info, MapPin, Receipt, Save, X } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { BillingInfoFormData, billingInfoSchema } from "../../schemas/profile-schemas";
import { InfoCard } from "@/components/common/card/InfoCard";
import { updateBillingInfoAction } from "../../actions/update-billing-info";
import { createFormField } from "@/features/shared/hooks/useFormField";
import { BillingInfo } from "../../types/profile.types";
import { FormSection } from "@/features/shared/components/form/FormSection";
import { ResponsiveModal } from "@/features/shared/components/modal/ResponsiveModal";

interface BillingInfoModalProps {
    children: React.ReactNode;
    billingInfo: BillingInfo | null;
    onUpdate: () => void;
}

const useBillingFormField = createFormField<BillingInfoFormData>();

export function BillingInfoModal({
    children,
    billingInfo,
    onUpdate
}: BillingInfoModalProps) {
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
                const result = await updateBillingInfoAction({
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

    const formContent = (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Alerta informativa */}
                <Alert className="border-info/20 bg-info/5">
                    <Info className="h-4 w-4 text-info" />
                    <AlertDescription className="text-sm">
                        <strong>Información opcional:</strong> Completa estos datos solo si requieres facturación empresarial o comprobantes fiscales.
                    </AlertDescription>
                </Alert>

                {/* Sección de Información Fiscal */}
                <FormSection
                    title="Información Fiscal"
                    subtitle="Datos necesarios para la facturación empresarial"
                    required={false}
                >
                    {useBillingFormField(form.control, "ruc", {
                        type: "input",
                        label: "RUC (Registro Único de Contribuyente)",
                        icon: Receipt,
                        placeholder: "20123456789",
                        className: "font-mono",
                        disabled: isPending,
                        maxLength: 11,
                        helpText: "11 dígitos para empresas, 8 para personas naturales con negocio"
                    })}

                    {useBillingFormField(form.control, "razonSocial", {
                        type: "input",
                        label: "Razón Social",
                        icon: Building,
                        placeholder: "Mi Empresa S.A.C.",
                        disabled: isPending,
                        helpText: "Nombre oficial de la empresa o negocio"
                    })}

                    {useBillingFormField(form.control, "address", {
                        type: "input",
                        label: "Dirección Fiscal",
                        icon: MapPin,
                        placeholder: "Av. Principal 123, Distrito, Ciudad",
                        disabled: isPending,
                        helpText: "Dirección registrada en SUNAT para facturación"
                    })}
                </FormSection>

                {/* Información adicional usando InfoCard */}
                <InfoCard
                    title="Información importante"
                    icon="📋"
                    variant="default"
                    items={[
                        "Esta información es necesaria solo para facturación empresarial",
                        "El RUC debe estar activo y registrado en SUNAT",
                        "La razón social debe coincidir con el registro oficial",
                        "Los datos se utilizarán para generar comprobantes fiscales válidos"
                    ]}
                />
            </form>
        </Form>
    );

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
            title="Información de Facturación"
            icon={Receipt}
            content={formContent}
            customFooter={customActions}
            isPending={isPending}
        >
            {children}
        </ResponsiveModal>
    );
}