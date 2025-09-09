'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ArrowRight, Crown, Sparkles, Star } from 'lucide-react';
import Link from 'next/link';

interface NoMembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

export function NoMembershipModal({
  isOpen,
  onClose,
  userName,
}: NoMembershipModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg text-center bg-gradient-to-br from-background via-background/98 to-background/95 border border-border/50 shadow-2xl">
        <DialogTitle className="sr-only">¡Desbloquea tu Potencial!</DialogTitle>
        <div className="py-6 space-y-6">
          {/* Animated Icon */}
          <div className="flex justify-center relative">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center relative overflow-hidden">
              <Crown className="h-10 w-10 text-primary z-10" />
              {/* Decorative elements */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse">
                <Sparkles className="h-3 w-3 text-white p-0.5" />
              </div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-400 rounded-full animate-bounce">
                <Star className="h-2 w-2 text-white p-0.5" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                ¡Desbloquea tu Potencial!
              </h2>
              {userName && (
                <p className="text-lg text-muted-foreground">
                  Hola <span className="font-semibold text-foreground">{userName}</span> 👋
                </p>
              )}
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-left">
              <div className="space-y-4">
                <p className="text-foreground font-medium">
                  Para acceder a todas las funciones de tu dashboard y comenzar a generar ingresos, necesitas activar tu membresía.
                </p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Sistema de puntos</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Comisiones</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Red de contactos</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Compra de lotes</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button
              asChild
              className="h-12 bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary text-primary-foreground font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              <Link href="/dashboard/cli-membresias/planes">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  <span>Ver Planes de Membresía</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            </Button>
            
            <Button
              variant="ghost"
              onClick={onClose}
              className="h-10 text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Recordar más tarde
            </Button>
          </div>
        </div>

        {/* Decorative bottom line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      </DialogContent>
    </Dialog>
  );
}