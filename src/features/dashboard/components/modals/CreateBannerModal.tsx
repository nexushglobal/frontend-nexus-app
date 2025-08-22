'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import { useCreateBanner } from '../../hooks/useBanners';

interface CreateBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateBannerModal({ isOpen, onClose }: CreateBannerModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    linkType: 'INTERNAL' as 'INTERNAL' | 'EXTERNAL',
    isActive: true,
    startDate: '',
    endDate: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const createBannerMutation = useCreateBanner();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no puede ser mayor a 5MB');
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error('Por favor selecciona una imagen');
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append('bannerImage', selectedFile);

      // Only append non-empty values
      if (formData.title) submitData.append('title', formData.title);
      if (formData.description)
        submitData.append('description', formData.description);
      if (formData.link) submitData.append('link', formData.link);
      if (formData.link) submitData.append('linkType', formData.linkType);
      submitData.append('isActive', formData.isActive.toString());
      if (formData.startDate)
        submitData.append('startDate', formData.startDate);
      if (formData.endDate) submitData.append('endDate', formData.endDate);

      await createBannerMutation.mutateAsync(submitData);
      toast.success('Banner creado exitosamente');
      handleClose();
    } catch {
      toast.error('Error al crear el banner');
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      link: '',
      linkType: 'INTERNAL',
      isActive: true,
      startDate: '',
      endDate: '',
    });
    clearFile();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Banner</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Imagen del Banner *</Label>
            {previewUrl ? (
              <div className="relative">
                <div className="relative h-20 w-full overflow-hidden rounded-lg border bg-muted">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={clearFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Haz clic para seleccionar una imagen
                </p>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, WEBP hasta 5MB
                </p>
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Título del banner"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkType">Tipo de Enlace</Label>
              <Select
                value={formData.linkType}
                onValueChange={(value: 'INTERNAL' | 'EXTERNAL') =>
                  setFormData((prev) => ({ ...prev, linkType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INTERNAL">Interno</SelectItem>
                  <SelectItem value="EXTERNAL">Externo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Descripción del banner (opcional)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">Enlace</Label>
            <Input
              id="link"
              value={formData.link}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, link: e.target.value }))
              }
              placeholder={
                formData.linkType === 'EXTERNAL'
                  ? 'https://...'
                  : '/dashboard/...'
              }
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">
                <Calendar className="h-4 w-4 inline mr-1" />
                Fecha de Inicio
              </Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">
                <Calendar className="h-4 w-4 inline mr-1" />
                Fecha de Fin
              </Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Active Switch */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, isActive: checked }))
              }
            />
            <Label htmlFor="isActive">Banner activo</Label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createBannerMutation.isPending || !selectedFile}
            >
              {createBannerMutation.isPending ? 'Creando...' : 'Crear Banner'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
