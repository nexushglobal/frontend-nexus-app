import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  PaymentImageModalSchema,
  PaymentImageModalType,
} from '../../validations/suscription.zod';

interface PaymentImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payment: Omit<PaymentImageModalType, 'fileIndex'>) => void;
  initialData?: Partial<Omit<PaymentImageModalType, 'fileIndex'>>;
}

const BANK_OPTIONS = [
  'BCP',
  'BCP SOLES',
  'INTERBANK',
  'BBVA',
  'BBVA SOLES',
  'BBVA DOLARES',
  'BANCO DE LA NACION',
  'SCOTIABANK',
  'OTRO',
];

export function PaymentImageModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: PaymentImageModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedBank, setSelectedBank] = useState<string>(
    initialData?.bankName || '',
  );
  const [customBankName, setCustomBankName] = useState<string>('');

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<Omit<PaymentImageModalType, 'fileIndex'>>({
    resolver: zodResolver(PaymentImageModalSchema),
    defaultValues: {
      bankName: initialData?.bankName || '',
      transactionReference: initialData?.transactionReference || '',
      transactionDate: initialData?.transactionDate
        ? initialData.transactionDate
        : format(new Date(), 'yyyy-MM-dd'),
      amount: initialData?.amount || 0,
      file: undefined,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setValue('file', file);
    }
  };

  const handleBankChange = (value: string) => {
    setSelectedBank(value);
    if (value !== 'OTRO') setValue('bankName', value);
  };

  const handleCustomBankChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomBankName(value);
    setValue('bankName', value);
  };

  const onSubmitHandler = (data: Omit<PaymentImageModalType, 'fileIndex'>) => {
    if (!selectedFile) return;

    const finalBankName =
      selectedBank === 'OTRO' ? customBankName : selectedBank;
    onSubmit({
      ...data,
      bankName: finalBankName,
      file: selectedFile,
    });
    reset();
    setSelectedFile(null);
    setSelectedBank('');
    setCustomBankName('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="px-4 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Comprobante de Pago</DialogTitle>
          <DialogDescription>
            Ingrese los detalles del comprobante de pago
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
          <div className="max-h-[calc(60vh)] overflow-y-auto">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div className="col-span-1 space-y-2 md:col-span-2">
                  <Label htmlFor="bankSelect">Banco</Label>
                  <Select value={selectedBank} onValueChange={handleBankChange}>
                    <SelectTrigger
                      id="bankSelect"
                      className="w-full bg-white dark:bg-gray-900"
                    >
                      <SelectValue placeholder="Seleccione un banco" />
                    </SelectTrigger>
                    <SelectContent>
                      {BANK_OPTIONS.map((bank) => (
                        <SelectItem key={bank} value={bank}>
                          {bank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedBank === 'OTRO' && (
                    <div className="pt-2">
                      <Label htmlFor="">Referencia de Transacción</Label>
                      <Input
                        className="w-full bg-white dark:bg-gray-800"
                        value={customBankName}
                        onChange={handleCustomBankChange}
                        placeholder="Ingrese el nombre del banco"
                      />
                    </div>
                  )}
                </div>
                <div className="col-span-1 space-y-2 md:col-span-2">
                  <Label htmlFor="transactionReference">
                    Referencia de Transacción
                  </Label>
                  <Input
                    className="w-full bg-white dark:bg-gray-900"
                    {...register('transactionReference')}
                    placeholder="Número de referencia"
                  />
                  {errors.transactionReference && (
                    <p className="text-destructive text-sm">
                      {errors.transactionReference.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div className="col-span-1 space-y-2 md:col-span-2">
                  <Label>Fecha de Transacción</Label>
                  <Controller
                    name="transactionDate"
                    control={control}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(new Date(field.value), 'PPP')
                            ) : (
                              <span>Seleccione una fecha</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={new Date(field.value)}
                            onSelect={(date) =>
                              field.onChange(
                                date ? format(date, 'yyyy-MM-dd') : '',
                              )
                            }
                            disabled={(date) => date > new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors.transactionDate && (
                    <p className="text-destructive text-sm">
                      {errors.transactionDate.message}
                    </p>
                  )}
                </div>
                <div className="col-span-1 space-y-2 md:col-span-2">
                  <Label htmlFor="amount">Monto</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register('amount', {
                      setValueAs: (v) => parseFloat(v),
                    })}
                    className="w-full bg-white dark:bg-gray-900"
                    placeholder="Monto del pago"
                  />
                  {errors.amount && (
                    <p className="text-destructive text-sm">
                      {errors.amount.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-span-1 space-y-2 pt-4 md:col-span-2">
              <Label>Comprobante de Pago</Label>
              <Input
                className="w-full bg-white dark:bg-gray-900"
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
              {selectedFile && (
                <p className="text-muted-foreground text-sm">
                  {selectedFile.name}
                </p>
              )}
              {errors.file && (
                <p className="text-destructive text-sm">
                  {errors.file.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="w-full pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Guardar Comprobante</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
