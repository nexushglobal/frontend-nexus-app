'use client';

import { Badge } from '@/components/ui/badge';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CreditCard, MapPin } from 'lucide-react';
import { Control, FieldErrors } from 'react-hook-form';
import { Step3FormData } from '../../validations/saleValidation';

interface ClientConfigurationProps {
  control: Control<Step3FormData>;
  errors: FieldErrors<Step3FormData>;
  isLoadingClient: boolean;
  onAddressChange: (address: string) => void;
}

export default function ClientConfiguration({
  control,
  isLoadingClient,
  onAddressChange,
}: ClientConfigurationProps) {
  if (isLoadingClient) {
    return (
      <div className="space-y-4">
        <h3 className="text-xs font-medium text-blue-500">
          Información del Cliente
        </h3>
        <div className="flex items-center justify-center py-4">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span className="ml-2 text-sm">Verificando cliente...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-medium text-blue-500">
        Información del Cliente
      </h3>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          <span className="text-sm font-medium">Estado del Cliente:</span>
          <Badge variant="secondary">Cliente Nuevo</Badge>
        </div>
        <FormField
          control={control}
          name="clientAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Dirección del Cliente
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Ingrese la dirección completa"
                  onChange={(e) => {
                    onAddressChange(e.target.value);
                    field.onChange(e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
