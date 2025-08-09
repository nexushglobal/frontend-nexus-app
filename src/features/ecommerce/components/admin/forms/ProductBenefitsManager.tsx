// src/features/ecommerce/components/admin/forms/ProductBenefitsManager.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

interface ProductBenefitsManagerProps {
  benefits: string[];
  onBenefitsChange: (benefits: string[]) => void;
}

export function ProductBenefitsManager({
  benefits,
  onBenefitsChange,
}: ProductBenefitsManagerProps) {
  const [newBenefit, setNewBenefit] = useState('');

  const handleAddBenefit = () => {
    if (newBenefit.trim() && !benefits.includes(newBenefit.trim())) {
      onBenefitsChange([...benefits, newBenefit.trim()]);
      setNewBenefit('');
    }
  };

  const handleRemoveBenefit = (index: number) => {
    onBenefitsChange(benefits.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddBenefit();
    }
  };

  return (
    <div className="space-y-4">
      {/* Lista de beneficios existentes */}
      {benefits.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Beneficios actuales:</p>
          <div className="grid gap-2">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-muted/50 rounded-md"
              >
                <span className="text-sm flex-1">{benefit}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveBenefit(index)}
                  className="h-auto p-1 text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Agregar nuevo beneficio */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Agregar nuevo beneficio:</p>
        <div className="flex gap-2">
          <Input
            placeholder="Escriba un beneficio del producto..."
            value={newBenefit}
            onChange={(e) => setNewBenefit(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleAddBenefit}
            disabled={
              !newBenefit.trim() || benefits.includes(newBenefit.trim())
            }
            size="sm"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {newBenefit.trim() && benefits.includes(newBenefit.trim()) && (
          <p className="text-sm text-destructive">Este beneficio ya existe</p>
        )}
      </div>

      {benefits.length === 0 && (
        <div className="text-center py-4 text-muted-foreground">
          <p className="text-sm">No hay beneficios agregados</p>
        </div>
      )}
    </div>
  );
}
