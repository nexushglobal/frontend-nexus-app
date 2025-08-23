'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ExpiredMembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  membershipData?: {
    planName: string;
    endDate: string;
  };
}

export function ExpiredMembershipModal({
  isOpen,
  onClose,
  membershipData,
}: ExpiredMembershipModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center bg-card border-destructive">
        <DialogTitle className="sr-only">Membresía Vencida</DialogTitle>
        <div className="py-6 space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-destructive rounded-full flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-destructive">
              Membresía Vencida
            </h2>

            <div className="space-y-3">
              {membershipData && (
                <div className="bg-destructive/10 rounded-lg p-4 text-left">
                  <p className="text-sm font-medium text-foreground mb-2">
                    Tu plan{' '}
                    <span className="text-destructive">
                      {membershipData.planName}
                    </span>{' '}
                    ha expirado
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Fecha de expiración:{' '}
                    {new Date(membershipData.endDate).toLocaleDateString(
                      'es-ES',
                    )}
                  </p>
                </div>
              )}

              <div className="text-sm text-muted-foreground">
                <p>
                  Para reactivar tu membresía y mantener todos los beneficios de
                  tu red, realiza tu reconsumo ahora.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button
              asChild
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              <Link href="/dashboard/cli-membresias/mis-reconsumos">
                Renovar Membresía
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
