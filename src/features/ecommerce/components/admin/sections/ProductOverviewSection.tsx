import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/features/shared/utils/formatCurrency';
import { Calendar, DollarSign, FileText, Package, Tag } from 'lucide-react';
import type { ProductDetailAdmin } from '../../../types/product.type';

interface ProductOverviewSectionProps {
  product: ProductDetailAdmin;
}

export function ProductOverviewSection({
  product,
}: ProductOverviewSectionProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Información Principal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="info-field">
              <Tag className="field-icon" />
              <div className="flex-1">
                <p className="text-sm font-medium">Nombre</p>
                <p className="text-sm text-muted-foreground">{product.name}</p>
              </div>
            </div>

            <div className="info-field">
              <FileText className="field-icon" />
              <div className="flex-1">
                <p className="text-sm font-medium">SKU</p>
                <p className="text-sm text-muted-foreground">{product.sku}</p>
              </div>
            </div>

            <div className="info-field">
              <Tag className="field-icon" />
              <div className="flex-1">
                <p className="text-sm font-medium">Categoría</p>
                <p className="text-sm text-muted-foreground">
                  {product.category.name}
                </p>
              </div>
            </div>

            <div className="info-field">
              <Package className="field-icon" />
              <div className="flex-1">
                <p className="text-sm font-medium">Stock Actual</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    {product.stock} unidades
                  </p>
                  <Badge
                    variant={
                      product.stock <= 10
                        ? 'destructive'
                        : product.stock <= 20
                        ? 'secondary'
                        : 'default'
                    }
                  >
                    {product.stock <= 10
                      ? 'Stock Bajo'
                      : product.stock <= 20
                      ? 'Stock Limitado'
                      : 'Stock Normal'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Precios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Información de Precios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="info-field">
              <DollarSign className="field-icon text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Precio Socio</p>
                <p className="text-lg font-semibold text-green-600">
                  {formatCurrency(product.memberPrice)}
                </p>
              </div>
            </div>

            <div className="info-field">
              <DollarSign className="field-icon text-orange-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Precio Público</p>
                <p className="text-lg font-semibold text-orange-600">
                  {formatCurrency(product.publicPrice)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Descripción y Composición */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Descripción y Composición
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="info-field-start">
            <FileText className="field-icon mt-1" />
            <div className="flex-1">
              <p className="text-sm font-medium mb-2">Descripción</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description || 'Sin descripción disponible'}
              </p>
            </div>
          </div>

          <div className="info-field-start">
            <Package className="field-icon mt-1" />
            <div className="flex-1">
              <p className="text-sm font-medium mb-2">Composición</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.composition || 'Sin composición disponible'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Beneficios */}
      {product.benefits && product.benefits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Beneficios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {product.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-muted/50 rounded-md"
                >
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estado y Metadatos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Estado y Metadatos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="info-field">
              <div className="flex-1">
                <p className="text-sm font-medium">Estado</p>
                <Badge variant={product.isActive ? 'default' : 'secondary'}>
                  {product.isActive ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </div>

            <div className="info-field">
              <Package className="field-icon" />
              <div className="flex-1">
                <p className="text-sm font-medium">Estado de Stock</p>
                <p className="text-sm text-muted-foreground">
                  {product.status}
                </p>
              </div>
            </div>

            <div className="info-field">
              <Calendar className="field-icon" />
              <div className="flex-1">
                <p className="text-sm font-medium">Creado</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(product.createdAt).toLocaleDateString('es-ES')}
                </p>
              </div>
            </div>

            <div className="info-field">
              <Calendar className="field-icon" />
              <div className="flex-1">
                <p className="text-sm font-medium">Última Actualización</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(product.updatedAt).toLocaleDateString('es-ES')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
