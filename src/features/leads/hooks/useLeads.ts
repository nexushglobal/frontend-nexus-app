import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LeadsService } from "../services/leads.service";
import { CreateLeadRequest, ListLeadsRequest } from "../types/leads.types";
import { toast } from "sonner";

export const LEADS_QUERY_KEYS = {
  all: ["leads"] as const,
  lists: () => [...LEADS_QUERY_KEYS.all, "list"] as const,
  list: (params: ListLeadsRequest) => [...LEADS_QUERY_KEYS.lists(), params] as const,
};

export function useLeads(params: ListLeadsRequest = {}) {
  return useQuery({
    queryKey: LEADS_QUERY_KEYS.list(params),
    queryFn: () => LeadsService.listLeads(params),
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLeadRequest) => LeadsService.createLead(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEYS.all });
      toast.success("Lead creado exitosamente");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error al crear el lead");
    },
  });
}

export function useDownloadLeads() {
  return useMutation({
    mutationFn: LeadsService.downloadLeads,
    onSuccess: (blob, variables) => {
      // Agregar BOM UTF-8 para solucionar problemas de codificación con tildes
      const BOM = '\uFEFF';
      const blobWithBOM = new Blob([BOM, blob], { type: 'text/csv;charset=utf-8' });
      
      const url = window.URL.createObjectURL(blobWithBOM);
      const a = document.createElement("a");
      a.href = url;
      
      const fileName = variables.startDate && variables.endDate 
        ? `leads_${variables.startDate}_${variables.endDate}.csv`
        : `leads_${new Date().toISOString().split('T')[0]}.csv`;
      
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("Descarga iniciada");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error al descargar leads");
    },
  });
}