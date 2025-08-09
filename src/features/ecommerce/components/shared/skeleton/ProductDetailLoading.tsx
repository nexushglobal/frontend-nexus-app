// src/features/ecommerce/components/shared/skeleton/ProductDetailLoading.tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ProductDetailLoading() {
  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-6">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent className="space-y-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="col-span-9 space-y-6">
          {/* Información Principal */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg border"
                  >
                    <Skeleton className="h-4 w-4" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Precios */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <Skeleton className="h-4 w-4" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <Skeleton className="h-4 w-4" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Descripción */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-52" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg border">
                <Skeleton className="h-4 w-4 mt-1" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-3 w-full mb-1" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg border">
                <Skeleton className="h-4 w-4 mt-1" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-3 w-full mb-1" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden space-y-6">
        {/* Header Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-10 w-20" />
            </div>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
        </Card>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-4 w-full gap-1 bg-muted p-1 rounded-lg">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-8 rounded-md" />
          ))}
        </div>

        {/* Content */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg border"
              >
                <Skeleton className="h-4 w-4" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-20 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
