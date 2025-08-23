'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PointData } from '@/features/dashboard/types/dashboard-user-info.types';
import {
  Award,
  ChevronRight,
  Crown,
  Settings,
  TrendingUp,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
type Props = { pointData: PointData };

const QuickAction = ({ pointData }: Props) => {
  return (
    <Card className="lg:col-span-4 hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Zap className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold">Acciones rápidas</h3>
            <p className="text-xs text-muted-foreground">Gestión directa</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="w-full justify-start h-auto p-3"
        >
          <Link
            href="/dashboard/cli-puntos/historial-puntos"
            className="flex items-center gap-3"
          >
            <div className="p-1.5 bg-primary/10 rounded">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">Ver puntos</p>
              <p className="text-xs text-muted-foreground">
                {pointData.availablePoints.toFixed(1)} disponibles
              </p>
            </div>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>

        <Button
          asChild
          variant="ghost"
          size="sm"
          className="w-full justify-start h-auto p-3"
        >
          <Link
            href="/dashboard/cli-rangos/rango-actual"
            className="flex items-center gap-3"
          >
            <div className="p-1.5 bg-secondary-foreground/10 rounded">
              <Award className="h-4 w-4 text-secondary-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">Mi rango</p>
              <p className="text-xs text-muted-foreground">
                {pointData.rank?.name || 'Sin rango'}
              </p>
            </div>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>

        <Button
          asChild
          variant="ghost"
          size="sm"
          className="w-full justify-start h-auto p-3"
        >
          <Link
            href="/dashboard/cli-perfil"
            className="flex items-center gap-3"
          >
            <div className="p-1.5 bg-accent-foreground/10 rounded">
              <Settings className="h-4 w-4 text-accent-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">Configurar</p>
              <p className="text-xs text-muted-foreground">Perfil y datos</p>
            </div>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="w-full justify-start h-auto p-3"
        >
          <Link
            href="/dashboard/cli-membresias/mi-plan"
            className="flex items-center gap-3"
          >
            <div className="p-1.5 bg-accent-foreground/10 rounded">
              <Crown className="h-4 w-4 text-accent-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">Mi membresía</p>
              <p className="text-xs text-muted-foreground">
                Detalles de la membresía
              </p>
            </div>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickAction;
