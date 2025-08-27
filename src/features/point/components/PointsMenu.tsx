'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getUserPointsAction } from '@/features/point/action/get-points.action';
import { motion } from 'framer-motion';
import { Coins, History, TrendingDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function PointsMenu() {
  const [availablePoints, setAvailablePoints] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        setIsLoading(true);
        const result = await getUserPointsAction();

        if (result.success && result.data) {
          setAvailablePoints(result.data.availablePoints);
        } else {
          toast.error('Error al cargar puntos', {
            description: result.message || 'No se pudieron cargar los puntos',
          });
        }
      } catch (error) {
        console.error('Error fetching points:', error);
        toast.error('Error al cargar puntos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoints();
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const formatPoints = (points: number) => {
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(points);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="ghost"
            className="relative h-auto px-3 py-2  transition-colors"
          >
            <div className="flex items-center gap-2">
              <Coins
                size={18}
                className="text-yellow-600 dark:text-yellow-500"
              />
              <span className="text-sm font-semibold">
                {isLoading ? '...' : formatPoints(availablePoints)}
              </span>
            </div>
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-3">
          <Coins size={20} className="text-yellow-600 dark:text-yellow-500" />
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium text-sm">Puntos Disponibles</p>
            <p className="text-lg font-bold text-primary">
              {formatPoints(availablePoints)}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            handleNavigation('/dashboard/cli-puntos/historial-puntos')
          }
          className="cursor-pointer"
        >
          <History className="mr-2 h-4 w-4" />
          Historial de Puntos
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            handleNavigation('/dashboard/cli-transacciones/mis-retiros')
          }
          className="cursor-pointer"
        >
          <TrendingDown className="mr-2 h-4 w-4" />
          Mis Retiros
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
