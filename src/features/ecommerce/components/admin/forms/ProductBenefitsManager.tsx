// src/features/ecommerce/components/admin/forms/ProductBenefitsManager.tsx
'use client';

import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';
import { Control, useFieldArray } from 'react-hook-form';
import { type ProductFormType } from '../../../schemas/product-form.schema';

interface ProductBenefitsManagerProps {
  control: Control<ProductFormType>;
}

export function ProductBenefitsManager({
  control,
}: ProductBenefitsManagerProps) {
  const {
    fields: benefitFields,
    append: appendBenefit,
    remove: removeBenefit,
  } = useFieldArray({
    control,
    name: 'benefits',
  });

  return (
    <div className="space-y-4">
      {benefitFields.map((field, index) => (
        <div key={field.id} className="flex gap-2">
          <FormField
            control={control}
            name={`benefits.${index}.benefit`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    placeholder="Ej: Aumenta la masa muscular"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => removeBenefit(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => appendBenefit({ benefit: '' })}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Agregar Beneficio
      </Button>
    </div>
  );
}
