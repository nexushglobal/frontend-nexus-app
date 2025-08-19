'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Payment } from '@/features/membership/types/membership-detail.type';
import { formatCurrency } from '@/features/shared/utils/formatCurrency';
import {
  AlertCircle,
  DollarSign,
  ImageIcon,
  Receipt,
  Upload,
  X,
} from 'lucide-react';
import { useRef, useState } from 'react';

interface VoucherPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPayment: (payment: Payment, file: File) => void;
  maxAmount: number;
}

export function VoucherPaymentModal({
  isOpen,
  onClose,
  onAddPayment,
  maxAmount,
}: VoucherPaymentModalProps) {
  const [formData, setFormData] = useState<Omit<Payment, 'fileIndex'>>({
    bankName: '',
    transactionReference: '',
    transactionDate: '',
    amount: 0,
  });
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | number,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        setErrors((prev) => ({
          ...prev,
          file: 'Solo se permiten archivos de imagen',
        }));
        return;
      }

      // Validate file size (5MB max)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          file: 'El archivo no puede ser mayor a 5MB',
        }));
        return;
      }

      setFile(selectedFile);
      setErrors((prev) => ({ ...prev, file: '' }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.transactionReference.trim()) {
      newErrors.transactionReference =
        'La referencia de transacción es requerida';
    }

    if (!formData.transactionDate) {
      newErrors.transactionDate = 'La fecha de transacción es requerida';
    }

    if (formData.amount <= 0) {
      newErrors.amount = 'El monto debe ser mayor a 0';
    }

    if (formData.amount > maxAmount) {
      newErrors.amount = `El monto no puede ser mayor a ${formatCurrency(
        maxAmount,
      )}`;
    }

    if (!file) {
      newErrors.file = 'La imagen del comprobante es requerida';
    }

    // Validate date is not in the future
    if (formData.transactionDate) {
      const selectedDate = new Date(formData.transactionDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // Set to end of today

      if (selectedDate > today) {
        newErrors.transactionDate = 'La fecha no puede ser futura';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm() || !file) return;

    const payment: Payment = {
      ...formData,
      fileIndex: 0, // This will be set by the parent component
    };

    onAddPayment(payment, file);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      bankName: '',
      transactionReference: '',
      transactionDate: '',
      amount: 0,
    });
    setFile(null);
    setPreviewUrl(null);
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Agregar Comprobante de Pago
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Bank Name */}
          <div className="space-y-2">
            <Label htmlFor="bankName">Banco (Opcional)</Label>
            <Input
              id="bankName"
              placeholder="Ej: Banco de Crédito del Perú"
              value={formData.bankName}
              onChange={(e) => handleInputChange('bankName', e.target.value)}
            />
          </div>

          {/* Transaction Reference */}
          <div className="space-y-2">
            <Label htmlFor="transactionReference">
              Referencia de Transacción *
            </Label>
            <Input
              id="transactionReference"
              placeholder="Ej: 123456789"
              value={formData.transactionReference}
              onChange={(e) =>
                handleInputChange('transactionReference', e.target.value)
              }
              className={
                errors.transactionReference ? 'border-destructive' : ''
              }
            />
            {errors.transactionReference && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.transactionReference}
              </p>
            )}
          </div>

          {/* Transaction Date */}
          <div className="space-y-2">
            <Label htmlFor="transactionDate">Fecha de Transacción *</Label>
            <Input
              id="transactionDate"
              type="date"
              value={formData.transactionDate}
              onChange={(e) =>
                handleInputChange('transactionDate', e.target.value)
              }
              max={new Date().toISOString().split('T')[0]}
              className={errors.transactionDate ? 'border-destructive' : ''}
            />
            {errors.transactionDate && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.transactionDate}
              </p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Monto *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                max={maxAmount}
                placeholder="0.00"
                value={formData.amount || ''}
                onChange={(e) =>
                  handleInputChange('amount', parseFloat(e.target.value) || 0)
                }
                className={`pl-10 ${errors.amount ? 'border-destructive' : ''}`}
              />
            </div>
            {errors.amount && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.amount}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Máximo: {formatCurrency(maxAmount)}
            </p>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Imagen del Comprobante *</Label>

            {!file ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
              >
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Haz clic para subir una imagen
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG hasta 5MB
                </p>
              </div>
            ) : (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded border"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-muted rounded border flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {file.name.length > 10
                          ? `${file.name.slice(0, 10)}...`
                          : file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>

                    <Button
                      onClick={removeFile}
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {errors.file && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.file}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleClose} variant="outline" className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Agregar Comprobante
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
