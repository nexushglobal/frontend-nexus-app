"use client";

import { useState } from "react";
import { toast } from "sonner";

export function useClipboard() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      toast.success("Copiado", {
        description: `${fieldName} copiado al portapapeles`,
      });
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      toast.error("Error", {
        description: "No se pudo copiar al portapapeles",
      });
    }
  };

  return {
    copiedField,
    copyToClipboard,
  };
}
