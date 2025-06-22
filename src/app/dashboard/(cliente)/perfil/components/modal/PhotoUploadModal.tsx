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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Upload, User, X, Save, Info } from "lucide-react";
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
                    toast.success("Foto actualizada", {
                        description: "Tu foto de perfil se ha actualizado correctamente",
                    });
                    setOpen(false);
                    setPreview(null);
                    form.reset();
                    onUpdate();
                } else {
                    toast.error("Error al actualizar", {
                        description: result.message,
                    });
                }
            } catch (error) {
                toast.error("Error de conexión", {
                    description: "No se pudo actualizar la foto. Intenta nuevamente.",
                });
            }
        });
    };

    const handleFileChange = (files: FileList | null) => {
        if (files && files[0]) {
            const file = files[0];

            // Validar tamaño
            if (file.size > 5000000) {
                toast.error("Archivo muy grande", {
                    description: "El archivo debe ser menor a 5MB",
                });
                return;
            }

            // Validar tipo
            if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) {
                toast.error("Formato no válido", {
                    description: "Solo se permiten archivos JPG, PNG y WebP",
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
                        {/* Comparación de fotos */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Foto actual */}
                                <div className="text-center space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Foto Actual</p>
                                    <Avatar className="h-20 w-20 mx-auto">
                                        <AvatarImage src={currentPhoto || undefined} alt={userName} />
                                        <AvatarFallback className="text-lg">
                                            {getInitials(userName)}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>

                                {/* Vista previa */}
                                <div className="text-center space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {preview ? "Vista Previa" : "Nueva Foto"}
                                    </p>
                                    {preview ? (
                                        <div className="relative mx-auto w-20 h-20">
                                            <Avatar className="h-20 w-20">
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
                                    ) : (
                                        <div className="h-20 w-20 mx-auto rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                                            <Camera className="h-8 w-8 text-muted-foreground/50" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Upload field */}
                        <FormField
                            control={form.control}
                            name="photo"
                            render={({ field: { onChange, value, ...field } }) => (
                                <FormItem>
                                    <FormLabel>Seleccionar Nueva Imagen</FormLabel>
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
                                                Elegir Archivo
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Información sobre formatos */}
                        <Alert className="border-info/20 bg-info/5">
                            <Info className="h-4 w-4 text-info" />
                            <AlertDescription className="text-sm">
                                <strong>Formatos aceptados:</strong> JPG, PNG, WebP. Tamaño máximo: 5MB.
                            </AlertDescription>
                        </Alert>

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
                                disabled={isPending || !preview}
                                className="flex-1 sm:flex-none"
                            >
                                {isPending ? (
                                    <>
                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Subiendo...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Actualizar Foto
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