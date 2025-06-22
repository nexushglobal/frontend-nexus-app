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
import { ContactInfo } from "@/types/profile.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Globe, Mail, MapPin, Phone, Save, X } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ContactInfoFormData, contactInfoSchema } from "../../schemas/profile-schemas";
import { updateContactInfo } from "../../actions/profile";

interface ContactInfoModalProps {
    children: React.ReactNode;
    contactInfo: ContactInfo | null;
    onUpdate: () => void;
}

const countries = [
    { value: "Peru", label: "Perú", flag: "🇵🇪" },
    { value: "Colombia", label: "Colombia", flag: "🇨🇴" },
    { value: "Ecuador", label: "Ecuador", flag: "🇪🇨" },
    { value: "Bolivia", label: "Bolivia", flag: "🇧🇴" },
    { value: "Chile", label: "Chile", flag: "🇨🇱" },
    { value: "Argentina", label: "Argentina", flag: "🇦🇷" },
    { value: "Uruguay", label: "Uruguay", flag: "🇺🇾" },
    { value: "Paraguay", label: "Paraguay", flag: "🇵🇾" },
    { value: "Venezuela", label: "Venezuela", flag: "🇻🇪" },
    { value: "Mexico", label: "México", flag: "🇲🇽" },
    { value: "España", label: "España", flag: "🇪🇸" },
];

export function ContactInfoModal({ children, contactInfo, onUpdate }: ContactInfoModalProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const form = useForm<ContactInfoFormData>({
        resolver: zodResolver(contactInfoSchema),
        defaultValues: {
            phone: contactInfo?.phone || "",
            address: contactInfo?.address || "",
            postalCode: contactInfo?.postalCode || "",
            country: contactInfo?.country || "Peru",
        },
    });

    const onSubmit = (data: ContactInfoFormData) => {
        startTransition(async () => {
            try {
                const result = await updateContactInfo({
                    phone: data.phone,
                    address: data.address || undefined,
                    postalCode: data.postalCode || undefined,
                    country: data.country,
                });

                if (result.success) {
                    toast.success("Información de contacto actualizada correctamente");
                    setOpen(false);
                    onUpdate();
                } else {
                    toast.error(result.message);
                }
            } catch (error) {
                toast.error("Error de conexión. Intenta nuevamente.");
            }
        });
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (newOpen) {
            form.reset({
                phone: contactInfo?.phone || "",
                address: contactInfo?.address || "",
                postalCode: contactInfo?.postalCode || "",
                country: contactInfo?.country || "Peru",
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Phone className="h-5 w-5" />
                        Información de Contacto
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Información Principal */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground">
                                Información Principal
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Teléfono *
                                                <span className="text-xs text-muted-foreground ml-1">(requerido)</span>
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        {...field}
                                                        placeholder="958920823"
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
                                    name="country"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                País *
                                                <span className="text-xs text-muted-foreground ml-1">(requerido)</span>
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                disabled={isPending}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <div className="flex items-center gap-2">
                                                            <Globe className="h-4 w-4 text-muted-foreground" />
                                                            <SelectValue placeholder="Selecciona un país" />
                                                        </div>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {countries.map((country) => (
                                                        <SelectItem key={country.value} value={country.value}>
                                                            <div className="flex items-center gap-2">
                                                                <span>{country.flag}</span>
                                                                <span>{country.label}</span>
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
                        </div>

                        {/* Información Adicional */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground">
                                Información Adicional
                                <span className="text-xs text-muted-foreground ml-1">(opcional)</span>
                            </h3>

                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Dirección</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        {...field}
                                                        placeholder="Av. Principal 123, Distrito"
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
                                    name="postalCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Código Postal</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        {...field}
                                                        placeholder="15001"
                                                        className="pl-10 font-mono"
                                                        disabled={isPending}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t">
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
                                        Guardar Cambios
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}