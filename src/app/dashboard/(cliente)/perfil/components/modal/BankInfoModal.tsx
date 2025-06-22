"use client";

import { InfoCard } from "@/components/common/card/InfoCard";
import { FormSection } from "@/components/common/form/FormSection";
import { ResponsiveModal } from "@/components/common/ResponsiveModal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { banks } from "@/data/general.data";
import { createFormField } from "@/hooks/useFormField";
import { BankInfo } from "@/types/profile.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Hash, Landmark, Save, Shield, X } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateBankInfo } from "../../actions/profile";
import { BankInfoFormData, bankInfoSchema } from "../../schemas/profile-schemas";

interface BankInfoModalProps {
    children: React.ReactNode;
    bankInfo: BankInfo | null;
    onUpdate: () => void;
}

const useBankFormField = createFormField<BankInfoFormData>();

const bankOptions = banks.map(bank => ({
    value: bank.value,
    label: bank.label,
    icon: bank.icon
}));

export function BankInfoModal({
    children,
    bankInfo,
    onUpdate
}: BankInfoModalProps) {
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

                <FormSection
                    title="Información del Banco"
                    subtitle="Selecciona tu entidad bancaria"
                    required={false}
                >
                    {useBankFormField(form.control, "bankName", {
                        type: "select",
                        label: "Banco",
                        icon: Landmark,
                        placeholder: "Selecciona tu banco",
                        options: bankOptions,
                        disabled: isPending
                    })}
                </FormSection>

                <FormSection
                    title="Información de la Cuenta"
                    subtitle="Datos de tu cuenta bancaria (opcional)"
                    required={false}
                >
                    {useBankFormField(form.control, "accountNumber", {
                        type: "input",
                        label: "Número de Cuenta",
                        icon: CreditCard,
                        placeholder: "1234567890123456",
                        className: "font-mono",
                        disabled: isPending,
                        helpText: "El número se mostrará parcialmente por seguridad"
                    })}

                    {useBankFormField(form.control, "cci", {
                        type: "input",
                        label: "CCI (Código de Cuenta Interbancaria)",
                        icon: Hash,
                        placeholder: "12345678901234567890",
                        className: "font-mono",
                        disabled: isPending,
                        maxLength: 20,
                        helpText: "20 dígitos. Se mostrará parcialmente por seguridad"
                    })}
                </FormSection>

                <InfoCard
                    title="Información importante"
                    icon="💡"
                    variant="default"
                    items={[
                        "Esta información será utilizada para transferencias y pagos",
                        "Los datos se almacenan de forma segura y encriptada",
                        "Solo se mostrarán los últimos 4 dígitos por seguridad",
                        "Puedes actualizar esta información en cualquier momento"
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