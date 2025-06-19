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
import { Globe, Mail, MapPin, Phone } from "lucide-react";
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
    { value: "Peru", label: "Perú" },
    { value: "Colombia", label: "Colombia" },
    { value: "Ecuador", label: "Ecuador" },
    { value: "Bolivia", label: "Bolivia" },
    { value: "Chile", label: "Chile" },
    { value: "Argentina", label: "Argentina" },
    // Agrega más países según sea necesario
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
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Phone className="h-5 w-5" />
                        Información de Contacto
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Teléfono *</FormLabel>
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
                                    <FormLabel>País *</FormLabel>
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
                                                    {country.label}
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
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dirección</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                {...field}
                                                placeholder="Tu dirección"
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
                                                placeholder="12345"
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