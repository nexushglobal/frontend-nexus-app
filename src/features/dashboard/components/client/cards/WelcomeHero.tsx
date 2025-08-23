'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserData } from '@/features/dashboard/types/dashboard-user-info.types';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  ArrowRight,
  Copy,
  ExternalLink,
  Share,
  Star,
  User,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type Props = {
  userData: UserData;
};

const WelcomeHero = ({ userData }: Props) => {
  const [activeTab, setActiveTab] = useState<string>('izquierda');
  const [copying, setCopying] = useState(false);

  const getShareUrl = (side: string) => {
    return `${window.location.origin}/register/${userData.referralCode}?lado=${side}`;
  };

  const copyToClipboard = (side: string) => {
    setCopying(true);
    const url = getShareUrl(side);

    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success(`Enlace copiado`, {
          description: `Link del lado ${side} copiado al portapapeles`,
          duration: 2000,
        });
        setTimeout(() => setCopying(false), 1500);
      })
      .catch((err) => {
        toast.error('Error al copiar', {
          description: 'No se pudo copiar el enlace al portapapeles',
        });
        setCopying(false);
      });
  };

  const shareReferral = (side: string) => {
    const url = getShareUrl(side);
    const title = `Únete a mi equipo (${side})`;
    const text = `Únete a mi organización usando mi código de referido: ${userData.referralCode} (lado ${side})`;

    if (navigator.share) {
      navigator
        .share({
          title,
          text,
          url,
        })
        .catch((error) => {
          toast.error('Error al compartir', {
            description: 'No se pudo compartir el enlace',
          });
        });
    } else {
      copyToClipboard(side);
    }
  };

  const openReferralLink = (side: string) => {
    const url = getShareUrl(side);
    window.open(url, '_blank');
  };

  return (
    <Card className="lg:col-span-8  shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent>
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary fill-current" />
              <h2 className="text-2xl font-bold text-foreground">
                ¡Hola, {userData.firstName}!
              </h2>
            </div>
            <p className="text-muted-foreground">
              Bienvenido de vuelta a tu dashboard
            </p>
          </div>
          <div className="p-3 bg-white dark:bg-card rounded-full shadow-md">
            <User className="h-6 w-6 text-primary" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-primary/10 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Red</span>
            </div>
            <p className="text-xl font-bold text-foreground">
              {userData.referralsCount}
            </p>
            <p className="text-xs text-muted-foreground">Referidos directos</p>
          </div>
          <div className="bg-secondary-foreground/10 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Share className="h-4 w-4 text-secondary-foreground" />
              <span className="text-sm font-medium">Enlaces</span>
            </div>
            <p className="text-sm font-semibold text-foreground">
              Izquierda / Derecha
            </p>
            <p className="text-xs text-muted-foreground">Para invitar</p>
          </div>
        </div>

        {/* Compact Referral Links Section */}
        <div className=" space-y-3">
          <div className="inline-flex w-full rounded-md bg-muted p-1 text-muted-foreground dark:bg-gray-800/50">
            <button
              onClick={() => setActiveTab('izquierda')}
              className={cn(
                'flex items-center justify-center gap-2 flex-1 rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all relative',
                activeTab === 'izquierda'
                  ? 'bg-background text-foreground shadow-sm dark:bg-gray-700 dark:text-primary-foreground dark:shadow-[0_0_0_1px_rgba(var(--primary),0.2)]'
                  : 'hover:bg-muted/80 hover:text-foreground',
              )}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Izquierda</span>
              {activeTab === 'izquierda' && (
                <span className="absolute -bottom-0 left-1/2 -translate-x-1/2 w-1/4 h-0.5 bg-primary rounded-full dark:bg-primary dark:shadow-[0_0_5px_rgba(var(--primary),0.8)]" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('derecha')}
              className={cn(
                'flex items-center justify-center gap-2 flex-1 rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all relative',
                activeTab === 'derecha'
                  ? 'bg-background text-foreground shadow-sm dark:bg-gray-700 dark:text-primary-foreground dark:shadow-[0_0_0_1px_rgba(var(--primary),0.2)]'
                  : 'hover:bg-muted/80 hover:text-foreground',
              )}
            >
              <span>Derecha</span>
              <ArrowRight className="h-3.5 w-3.5" />
              {activeTab === 'derecha' && (
                <span className="absolute -bottom-0 left-1/2 -translate-x-1/2 w-1/4 h-0.5 bg-primary rounded-full dark:bg-primary dark:shadow-[0_0_5px_rgba(var(--primary),0.8)]" />
              )}
            </button>
          </div>

          <div className="bg-white/50 dark:bg-card/50 rounded-lg p-3">
            {activeTab === 'izquierda' && (
              <div className="animate-in fade-in-50 duration-300">
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard('izquierda')}
                    disabled={copying}
                    className="flex items-center gap-1.5"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copiar
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareReferral('izquierda')}
                    className="flex items-center gap-1.5"
                  >
                    <Share className="h-3.5 w-3.5" />
                    Compartir
                  </Button>

                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => openReferralLink('izquierda')}
                    className="flex items-center gap-1.5"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Abrir
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'derecha' && (
              <div className="animate-in fade-in-50 duration-300">
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard('derecha')}
                    disabled={copying}
                    className="flex items-center gap-1.5"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copiar
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareReferral('derecha')}
                    className="flex items-center gap-1.5"
                  >
                    <Share className="h-3.5 w-3.5" />
                    Compartir
                  </Button>

                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => openReferralLink('derecha')}
                    className="flex items-center gap-1.5"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Abrir
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeHero;
