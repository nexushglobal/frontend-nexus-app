"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Upload, User, X } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updatePhoto } from "../../actions/profile";
import { PhotoFormData, photoSchema } from "../../schemas/profile-schemas";

interface PhotoUploadModalProps {
    children: React.ReactNode;
    currentPhoto: string | null;
    userName: string;
    onUpdate: () => void;
}

export function PhotoUploadModal({
    children,
    currentPhoto,
    userName,
    onUpdate
}: PhotoUploadModalProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<PhotoFormData>({
        resolver: zodResolver(photoSchema),
    });

    const onSubmit = (data: PhotoFormData) => {
        if (!data.photo?.[0]) return;

        startTransition(async () => {
            try {
                const formData = new FormData();
                formData.append('photo', data.photo[0]);

                const result = await updatePhoto(formData);

                if (result.success) {
                    toast.success("Éxito", {
                        description: result.message,
                    });
                    setOpen(false);
                    setPreview(null);
                    form.reset();
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

    const handleFileChange = (files: FileList | null) => {
        if (files && files[0]) {
            const file = files[0];

            // Validar tamaño
            if (file.size > 5000000) {
                toast.error("Error", {
                    description: "El archivo debe ser menor a 5MB",
                });
                return;
            }

            // Validar tipo
            if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) {
                toast.error("Error", {
                    description: "Solo se permiten archivos .jpg, .jpeg, .png y .webp",
                });
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            setPreview(null);
            form.reset();
        }
    };

    const clearPreview = () => {
        setPreview(null);
        form.setValue('photo', undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Camera className="h-5 w-5" />
                        Actualizar Foto de Perfil
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="flex flex-col items-center gap-4">
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground mb-3">Foto actual</p>
                                <Avatar className="h-20 w-20 mx-auto">
                                    <AvatarImage src={currentPhoto || undefined} alt={userName} />
                                    <AvatarFallback className="text-lg">
                                        {getInitials(userName)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            {preview && (
                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground mb-3">Vista previa</p>
                                    <div className="relative">
                                        <Avatar className="h-20 w-20 mx-auto">
                                            <AvatarImage src={preview} alt="Preview" />
                                            <AvatarFallback>
                                                <User className="h-8 w-8" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                                            onClick={clearPreview}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <FormField
                            control={form.control}
                            name="photo"
                            render={({ field: { onChange, value, ...field } }) => (
                                <FormItem>
                                    <FormLabel>Nueva Foto</FormLabel>
                                    <FormControl>
                                        <div className="space-y-2">
                                            <input
                                                {...field}
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                                onChange={(e) => {
                                                    const files = e.target.files;
                                                    onChange(files);
                                                    handleFileChange(files);
                                                }}
                                                className="hidden"
                                                disabled={isPending}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={isPending}
                                                className="w-full"
                                            >
                                                <Upload className="mr-2 h-4 w-4" />
                                                Seleccionar Imagen
                                            </Button>
                                            <p className="text-xs text-muted-foreground text-center">
                                                Formatos: JPG, PNG, WebP. Máximo 5MB.
                                            </p>
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
                                disabled={isPending || !preview}
                                className="flex-1"
                            >
                                {isPending ? "Subiendo..." : "Actualizar Foto"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}