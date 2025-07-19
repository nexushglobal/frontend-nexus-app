import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  GuarantorFormData,
  SecondaryClientFormData,
} from "../validations/saleValidation";
import { createClientGuarantor } from "../actions/create-client";
import { LeadsVendor } from "../types/sale.types";

interface UseClientGuarantorReturn {
  leads: LeadsVendor[];
  selectedLead: LeadsVendor | null;
  guarantorData: { id: number; name: string } | null;
  secondaryClientsData: { id: number; name: string }[];
  clientAddress: string;

  loading: {
    leads: boolean;
    client: boolean;
    creating: boolean;
  };

  handleAddressChange: (address: string) => void;
  handleGuarantorClientSuccess: (
    secondaryClientFormData: SecondaryClientFormData[],
    guarantorFormData?: GuarantorFormData
  ) => Promise<void>;

  getLeadId: () => number;
  getGuarantorId: () => number;
  getSecondaryClientsId: () => number[];
}

export function useClientGuarantor(): UseClientGuarantorReturn {
  const [guarantorData, setGuarantorData] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [secondaryClientsData, setSecondaryClientsData] = useState<
    { id: number; name: string }[]
  >([]);

  const [loading, setLoading] = useState({
    leads: false,
    client: false,
    creating: false,
  });

  const handleGuarantorClientSuccess = useCallback(
    async (
      secondaryClientsFormData: SecondaryClientFormData[],
      guarantorFormData?: GuarantorFormData
    ) => {
      if (!selectedLead) {
        toast.error("Debe crear un lead primero");
        return;
      }

      setLoading((prev) => ({ ...prev, creating: true }));
      try {
        const payload = {
          createClient: {
            leadId: selectedLead.id,
            address: clientAddress,
          },
          createGuarantor: guarantorFormData,
          createSecondaryClient: secondaryClientsFormData,
          document: selectedLead.document,
        };

        const result = await createClientGuarantor(payload);

        if (guarantorFormData) {
          setGuarantorData({
            id: result.guarantorId,
            name: `${guarantorFormData.firstName} ${guarantorFormData.lastName}`,
          });
        }
        setSecondaryClientsData(
          result.secondaryClientIds.map((id, index) => ({
            id,
            name: `${secondaryClientsFormData[index].firstName} ${secondaryClientsFormData[index].lastName}`,
          }))
        );

        toast.success("Cliente y garante creados/actualizados correctamente");
      } catch (error) {
        toast.error("Error al crear cliente y garante");
        throw error;
      } finally {
        setLoading((prev) => ({ ...prev, creating: false }));
      }
    },
    [selectedLead, clientAddress]
  );

  const getLeadId = useCallback(() => {
    return clientData?.id || 0;
  }, [clientData]);

  const getGuarantorId = useCallback(() => {
    return guarantorData?.id || 0;
  }, [guarantorData]);

  const getSecondaryClientsId = useCallback(() => {
    return secondaryClientsData.map((client) => client.id);
  }, [secondaryClientsData]);

  return {
    guarantorData,
    secondaryClientsData,

    loading,

    handleAddressChange,
    handleGuarantorClientSuccess,

    getLeadId,
    getGuarantorId,
    getSecondaryClientsId,
  };
}
