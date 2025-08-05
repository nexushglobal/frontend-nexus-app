'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertTriangle, ArrowLeft, Home, Lock, Shield } from 'lucide-react';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        {/* Icono principal con efectos */}
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-destructive/10 dark:bg-destructive/20 rounded-full flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 bg-destructive/20 rounded-full animate-pulse"></div>
            <Lock className="w-12 h-12 text-destructive relative z-10" />
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
            <AlertTriangle className="w-6 h-6 text-warning" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-destructive to-warning bg-clip-text text-transparent">
              Acceso Denegado
            </h1>
            <AlertTriangle className="w-6 h-6 text-warning" />
          </div>

          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            No tienes los permisos necesarios para acceder a esta sección
          </p>
        </div>

        {/* Card principal */}
        <Card className="border-destructive/20 shadow-2xl hover-lift">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="flex items-center justify-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl">Sección Protegida</CardTitle>
            </div>
            <CardDescription className="text-base leading-relaxed">
              Esta área está restringida a usuarios con permisos específicos. Si
              crees que deberías tener acceso, contacta con tu administrador.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Información adicional */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                ¿Por qué veo este mensaje?
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground ml-7">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  Tu cuenta no tiene el rol necesario para esta función
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  Esta sección requiere permisos administrativos especiales
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  Tu sesión puede necesitar actualizarse
                </li>
              </ul>
            </div>

            {/* Acciones */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild className="flex-1 primary-contrast">
                <Link href="/dashboard" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Volver al Dashboard
                </Link>
              </Button>

              <Button asChild variant="outline" className="flex-1">
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Ir al Inicio
                </Link>
              </Button>
            </div>

            {/* Contacto */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                ¿Necesitas ayuda?
                <Link
                  href="/dashboard/soporte"
                  className="text-primary hover:text-primary-hover font-medium ml-1 transition-colors"
                >
                  Contacta soporte
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer con información adicional */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Nexus Global Network</span>
            </div>
            <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
            <div className="flex items-center gap-2">
              <Shield className="w-3 h-3" />
              <span>Sistema de Seguridad</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground/70">
            Error 403 - Acceso prohibido a recurso protegido
          </p>
        </div>
      </div>
    </div>
  );
}
