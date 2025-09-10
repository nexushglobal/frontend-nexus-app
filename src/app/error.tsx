'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertTriangle, Bug, Home, RefreshCw, Zap } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log del error para debugging
    console.error('Error boundary triggered:', error);
  }, [error]);

  return (
    <div className="min-h-dvh bg-background flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        {/* Icono principal con efectos */}
        <div className="text-center">
          <div className="mx-auto w-32 h-32 bg-destructive/10 dark:bg-destructive/20 rounded-full flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 bg-destructive/20 rounded-full animate-pulse"></div>
            <div className="absolute inset-4 bg-destructive/30 rounded-full animate-ping"></div>
            <Zap className="w-16 h-16 text-destructive relative z-10 animate-bounce" />
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
            <AlertTriangle className="w-6 h-6 text-warning" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-destructive via-warning to-destructive bg-clip-text text-transparent">
              ¡Algo salió mal!
            </h1>
            <AlertTriangle className="w-6 h-6 text-warning" />
          </div>

          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            Ha ocurrido un error inesperado en la aplicación
          </p>
        </div>

        {/* Card principal */}
        <Card className="border-destructive/20 shadow-2xl hover-lift">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="flex items-center justify-center gap-3">
              <Bug className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl">Error del Sistema</CardTitle>
            </div>
            <CardDescription className="text-base leading-relaxed">
              No te preocupes, nuestro equipo ha sido notificado
              automáticamente. Mientras tanto, puedes intentar alguna de estas
              soluciones.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Detalles del error para desarrollo */}
            {process.env.APP_ENV === 'development' && (
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 space-y-2">
                <h3 className="font-semibold text-sm flex items-center gap-2 text-destructive">
                  <Bug className="w-4 h-4" />
                  Detalles del Error (Solo en desarrollo)
                </h3>
                <div className="text-xs font-mono bg-muted/50 p-3 rounded border overflow-x-auto">
                  <p className="text-destructive break-all">
                    {error.name}: {error.message}
                  </p>
                  {error.digest && (
                    <p className="text-muted-foreground mt-1">
                      Digest: {error.digest}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Soluciones sugeridas */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-info" />
                Soluciones sugeridas
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground ml-7">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  Intenta recargar la página
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  Verifica tu conexión a internet
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  Limpia la caché del navegador
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  Intenta acceder desde otra pestaña
                </li>
              </ul>
            </div>

            {/* Información adicional */}
            <div className="bg-card-hover rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-success" />
                ¿Qué está pasando?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Este error se produce cuando algo en la aplicación no funciona
                como se esperaba. Puede ser un problema temporal del servidor,
                un error de red, o un bug en el código. Nuestro equipo técnico
                investiga todos los errores automáticamente.
              </p>
            </div>

            {/* Acciones */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button onClick={reset} className="flex-1 primary-contrast">
                <RefreshCw className="w-4 h-4 mr-2" />
                Intentar de Nuevo
              </Button>

              <Button asChild variant="outline" className="flex-1">
                <Link href="/" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Ir al Inicio
                </Link>
              </Button>
            </div>

            {/* Contacto de soporte */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                ¿El problema persiste?
                <Link
                  href="/dashboard/soporte"
                  className="text-primary hover:text-primary-hover font-medium ml-1 transition-colors"
                >
                  Reporta el error
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer con información técnica */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
              <span>Nexus Global Network</span>
            </div>
            <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
            <div className="flex items-center gap-2">
              <Bug className="w-3 h-3" />
              <span>Sistema de Errores</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground/70">
            Error 500 - Error interno del servidor
            {error.digest && ` • ID: ${error.digest.slice(0, 8)}`}
          </p>
        </div>
      </div>
    </div>
  );
}
