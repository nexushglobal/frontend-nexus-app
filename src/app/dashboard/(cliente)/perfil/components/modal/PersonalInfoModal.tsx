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
import { PersonalInfo } from "@/types/profile.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, IdCard, User, Mail, AtSign, Save, X } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PersonalInfoFormData, personalInfoSchema } from "../../schemas/personal-info-schema";
import { updatePersonalInfo } from "../../actions/profile";

interface PersonalInfoModalProps {
    children: React.ReactNode;
    personalInfo: PersonalInfo | null;
    currentEmail: string;
    currentNickname?: string | null;
    onUpdate: () => void;
}

const documentTypes = [
    { value: "DNI", label: "DNI" },
    { value: "CE", label: "CE" },
    { value: "PAS", label: "PAS" },
];

export function PersonalInfoModal({
    children,
    personalInfo,
    currentEmail,
    currentNickname,
    onUpdate
}: PersonalInfoModalProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const form = useForm<PersonalInfoFormData>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: {
            nickname: currentNickname || "",
            email: currentEmail || "",
            documentType: personalInfo?.documentType as "DNI" | "CE" | "PAS" || undefined,
            documentNumber: personalInfo?.documentNumber || "",
        },
    });

    const onSubmit = (data: PersonalInfoFormData) => {
        startTransition(async () => {
            try {
                const result = await updatePersonalInfo({
                    nickname: data.nickname || undefined,
                    email: data.email || undefined,
                    documentType: data.documentType || undefined,
                    documentNumber: data.documentNumber || undefined,
                });

                if (result.success) {
                    toast.success("Información actualizada correctamente");
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
                nickname: currentNickname || "",
                email: currentEmail || "",
                documentType: personalInfo?.documentType as "DNI" | "CE" | "PAS" || undefined,
                documentNumber: personalInfo?.documentNumber || "",
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
                        <User className="h-5 w-5" />
                        Información Personal
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Información de Contacto */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground">
                                Información de Contacto
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="nickname"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nickname</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <AtSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        {...field}
                                                        placeholder="mi_nickname"
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
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        {...field}
                                                        type="email"
                                                        placeholder="tu@email.com"
                                                        className="pl-10"
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

                        {/* Información de Documento */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground">
                                Información de Documento
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="documentType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipo de Documento</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                disabled={isPending}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <div className="flex items-center gap-2">
                                                            <IdCard className="h-4 w-4 text-muted-foreground" />
                                                            <SelectValue placeholder="Selecciona un tipo" />
                                                        </div>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {documentTypes.map((docType) => (
                                                        <SelectItem key={docType.value} value={docType.value}>
                                                            {docType.label}
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
                                    name="documentNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Número de Documento</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        {...field}
                                                        placeholder="12345678"
                                                        className="pl-10 font-mono"
                                                        disabled={isPending}
                                                        maxLength={20}
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