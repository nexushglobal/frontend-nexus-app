'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft, Compass, Home, MapPin, Search } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-background flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        {/* Número 404 con efectos */}
        <div className="text-center">
          <div className="relative">
            <h1 className="text-[8rem] md:text-[12rem] font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-none animate-glow">
              404
            </h1>
            <div className="absolute inset-0 text-[8rem] md:text-[12rem] font-black text-primary/10 dark:text-primary/20 blur-3xl leading-none">
              404
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="w-6 h-6 text-warning animate-bounce" />
            <h2 className="text-3xl md:text-4xl font-bold">
              Página No Encontrada
            </h2>
            <MapPin
              className="w-6 h-6 text-warning animate-bounce"
              style={{ animationDelay: '0.2s' }}
            />
          </div>

          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            Parece que te has perdido en el espacio digital
          </p>
        </div>

        {/* Card principal */}
        <Card className="border-warning/20 shadow-2xl hover-lift">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="flex items-center justify-center gap-3">
              <Compass
                className="w-8 h-8 text-primary animate-spin"
                style={{ animationDuration: '3s' }}
              />
              <CardTitle className="text-2xl">
                ¿Dónde estabas buscando ir?
              </CardTitle>
            </div>
            <CardDescription className="text-base leading-relaxed">
              La página que buscas no existe o ha sido movida. No te preocupes,
              te ayudamos a encontrar tu camino de vuelta.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Sugerencias */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Search className="w-5 h-5 text-info" />
                Posibles causas
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground ml-7">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  La URL fue escrita incorrectamente
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  La página fue movida o eliminada
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  El enlace que seguiste está desactualizado
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  Necesitas iniciar sesión para acceder
                </li>
              </ul>
            </div>

            {/* Acciones principales */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild className="flex-1 primary-contrast">
                <Link href="/" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Ir al Inicio
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="flex-1"
                onClick={() => window.history.back()}
              >
                <button className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Página Anterior
                </button>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span>Nexus Global Network</span>
            </div>
            <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3" />
              <span>Navegación</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground/70">
            Error 404 - Recurso no encontrado
          </p>
        </div>
      </div>
    </div>
  );
}
