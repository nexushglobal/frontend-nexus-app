'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Cake, Gift, PartyPopper, Sparkles } from 'lucide-react';

interface BirthdayModalProps {
  userName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function BirthdayModal({
  userName,
  isOpen,
  onClose,
}: BirthdayModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg text-center bg-card border-2 border-primary/20 shadow-2xl">
        <DialogTitle className="sr-only">Feliz Cumpleaños</DialogTitle>
        <div className="relative py-8 px-2">
          {/* Decorative Corner Accents */}
          <div className="absolute top-4 left-4 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="absolute top-4 right-4 w-8 h-8 bg-secondary-foreground/10 rounded-full flex items-center justify-center">
            <Cake className="h-4 w-4 text-secondary-foreground" />
          </div>

          {/* Main Content */}
          <div className="relative z-10 space-y-6">
            {/* Icon Section */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-lg border-4 border-primary/20 transition-transform duration-300 hover:scale-105">
                  <Gift className="h-12 w-12 text-primary-foreground" />
                </div>
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-secondary rounded-full flex items-center justify-center shadow-md border-2 border-card">
                  <PartyPopper className="h-6 w-6 text-secondary-foreground" />
                </div>
              </div>
            </div>

            {/* Header */}
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-primary">
                ¡Feliz Cumpleaños!
              </h2>
              <div className="w-24 h-1 bg-primary/30 rounded-full mx-auto"></div>
            </div>

            {/* Greeting */}
            <div className="space-y-3">
              <p className="text-xl text-foreground">
                ¡Hola <span className="font-bold text-primary">{userName}</span>
                !
              </p>
            </div>

            {/* Message Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-base text-muted-foreground">
                  En este día especial, todo el equipo de
                </p>
                <p className="text-2xl font-bold text-primary">
                  Nexus Global Network
                </p>
                <p className="text-base text-muted-foreground">
                  te desea un día lleno de alegría, éxito y prosperidad.
                </p>
              </div>

              {/* Quote Section */}
              <div className="bg-muted/50 rounded-lg p-6 border border-border/50 relative">
                <div className="absolute -top-2 left-6 w-4 h-4 bg-primary rounded-full"></div>
                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  &quot;Que este nuevo año de vida esté lleno de oportunidades y
                  que juntos sigamos construyendo un futuro próspero en nuestra
                  red global.&quot;
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-6">
              <Button
                onClick={onClose}
                className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold px-8 py-3 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02] focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
                size="lg"
              >
                ¡Gracias! Continuar al Dashboard
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
