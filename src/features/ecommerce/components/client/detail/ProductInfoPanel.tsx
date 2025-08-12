'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/features/shared/utils/formatCurrency';

interface Props {
  name: string;
  categoryName?: string;
  sku?: string;
  price: number;
  priceOff?: number | null;
  description: string;
  composition: string;
  benefits?: string[];
}

export function ProductInfoPanel({
  name,
  categoryName,
  sku,
  price,
  priceOff,
  description,
  composition,
  benefits,
}: Props) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          {categoryName && (
            <Badge className="bg-primary text-white">{categoryName}</Badge>
          )}
          {sku && (
            <span className="text-xs text-muted-foreground">SKU: {sku}</span>
          )}
        </div>

        <div>
          <h1 className="text-xl font-bold">{name}</h1>
          <div className="flex items-end gap-3 mt-1">
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(price)}
            </span>
            {priceOff && (
              <span className="text-sm text-muted-foreground line-through">
                {formatCurrency(priceOff)}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-1">Descripción</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {description}
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Composición</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {composition}
            </p>
          </div>
        </div>

        {benefits && benefits.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Beneficios</h3>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              {benefits.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
