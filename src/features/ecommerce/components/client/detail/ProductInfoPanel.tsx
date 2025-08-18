'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/features/shared/utils/formatCurrency';
import { 
  Package, 
  FileText, 
  Sparkles, 
  CheckCircle,
  Info
} from 'lucide-react';

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
  // Parse composition from comma-separated string
  const compositionItems = composition 
    ? composition.split(',').map(item => item.trim()).filter(item => item.length > 0)
    : [];

  return (
    <div className="space-y-6">
      {/* Description Section */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" />
            Descripción del producto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {description}
          </p>
        </CardContent>
      </Card>

      {/* Composition Section */}
      {compositionItems.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="h-5 w-5" />
              Composición
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {compositionItems.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg"
                >
                  <div className="w-2 h-2 bg-primary rounded-full shrink-0"></div>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Benefits Section */}
      {benefits && benefits.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5" />
              Beneficios principales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
