'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { InfoCard } from '@/features/shared/components/card/InfoCard';
import { FileUploadWrapper } from '@/features/shared/components/form/FileUploadWrapper';
import { ResponsiveModal } from '@/features/shared/components/modal/ResponsiveModal';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, Save, Upload, User, X } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { uploadPhotoAction } from '../../actions/upload-photo';
import { PhotoFormData, photoSchema } from '../../schemas/profile-schemas';

interface PhotoUploadModalProps {
  children: React.ReactNode;
  currentPhoto: string | null;
  userName: string;
  onUpdate: () => void;
  isUpdating?: boolean;
}

export function PhotoUploadModal({
  children,
  currentPhoto,
  userName,
  onUpdate,
  isUpdating = false,
}: PhotoUploadModalProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<PhotoFormData>({
    resolver: zodResolver(photoSchema),
  });

  const onSubmit = (data: PhotoFormData) => {
    if (!data.photo?.[0]) return;

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('photo', data.photo[0]);

        const result = await uploadPhotoAction(formData);

        if (result.success) {
          toast.success('Foto actualizada', {
            description: 'Tu foto de perfil se ha actualizado correctamente',
          });
          setOpen(false);
          setPreview(null);
          form.reset();
          onUpdate();
        } else {
          toast.error('Error al actualizar', {
            description: result.message,
          });
        }
      } catch (error) {
        toast.error('Error de conexión', {
          description: 'No se pudo actualizar la foto. Intenta nuevamente.',
        });
      }
    });
  };

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];

      // Validar tamaño
      if (file.size > 5000000) {
        toast.error('Archivo muy grande', {
          description: 'El archivo debe ser menor a 5MB',
        });
        return;
      }

      // Validar tipo
      if (
        !['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(
          file.type,
        )
      ) {
        toast.error('Formato no válido', {
          description: 'Solo se permiten archivos JPG, PNG y WebP',
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
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            Comparación de Fotos
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Foto Actual
              </p>
              <Avatar className="h-20 w-20 mx-auto">
                <AvatarImage src={currentPhoto || undefined} alt={userName} />
                <AvatarFallback className="text-lg">
                  {getInitials(userName)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                {preview ? 'Vista Previa' : 'Nueva Foto'}
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

        {/* Upload field usando el nuevo wrapper */}
        <FormField
          control={form.control}
          name="photo"
          render={({ field }) => (
            <FileUploadWrapper
              field={field}
              label="Seleccionar Nueva Imagen"
              icon={Upload}
              accept="image/jpeg,image/jpg,image/png,image/webp"
              disabled={isPending || isUpdating}
              required={true}
              buttonText="Elegir Archivo"
              helpText="Tamaño máximo: 5MB. Formatos: JPG, PNG, WebP"
              onFileChange={handleFileChange}
            />
          )}
        />

        <InfoCard
          title="Información sobre formatos"
          icon="📷"
          variant="info"
          items={[
            'Formatos aceptados: JPG, PNG, WebP',
            'Tamaño máximo: 5MB',
            'Recomendado: imágenes cuadradas para mejor visualización',
            'La imagen se redimensionará automáticamente',
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
        disabled={isPending || isUpdating}
        className="flex-1 sm:flex-none"
      >
        <X className="mr-2 h-4 w-4" />
        Cancelar
      </Button>

      <Button
        type="submit"
        onClick={form.handleSubmit(onSubmit)}
        disabled={isPending || isUpdating || !preview}
        className="flex-1 sm:flex-none"
      >
        {isPending || isUpdating ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            {isPending ? 'Subiendo...' : 'Actualizando...'}
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Actualizar Foto
          </>
        )}
      </Button>
    </div>
  );

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={handleOpenChange}
      title="Actualizar Foto de Perfil"
      icon={Camera}
      maxWidth="sm:max-w-md"
      content={formContent}
      customFooter={customActions}
      isPending={isPending}
    >
      {children}
    </ResponsiveModal>
  );
}
