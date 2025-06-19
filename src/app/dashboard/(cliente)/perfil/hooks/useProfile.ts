"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ProfileData } from "@/types/profile.types";
import { getProfile } from "../actions/profile";

export function useProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getProfile();

      if (result.success && result.data) {
        setProfile(result.data);
      } else {
        const errorMessage = result.message || "Error al cargar el perfil";
        setError(errorMessage);
        toast.error("Error", {
          description: errorMessage,
        });
      }
    } catch (err) {
      const errorMessage = "Error de conexión al cargar el perfil";
      setError(errorMessage);
      toast.error("Error", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const refetch = useCallback(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    refetch,
  };
}
