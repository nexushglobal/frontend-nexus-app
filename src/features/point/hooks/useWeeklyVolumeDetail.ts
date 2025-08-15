'use client';

import { useEffect, useState } from 'react';
import { getWeeklyVolumeAction } from '../action/get-weekly';
import type { WeeklyVolume } from '../types/weekly.types';

export const useWeeklyVolumeDetail = (volumeId: number) => {
  const [data, setData] = useState<WeeklyVolume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getWeeklyVolumeAction(volumeId);

        if (result.success && result.data) {
          setData(result.data);
        } else {
          setError(result.message || 'Error al obtener el detalle del volumen');
        }
      } catch (err) {
        setError('Error al obtener el detalle del volumen');
        console.error('Error fetching weekly volume detail:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (volumeId) {
      fetchData();
    }
  }, [volumeId]);

  return { data, isLoading, error };
};
