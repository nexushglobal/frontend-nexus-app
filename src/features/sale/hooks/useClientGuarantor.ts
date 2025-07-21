import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  GuarantorFormData,
  SecondaryClientFormData,
} from "../validations/saleValidation";
import { createClientGuarantor, createLead } from "../actions/create-client";
import { ClientRequest } from "../types/sale-request";
import { ClientResponse } from "../types/sale-response.types";

interface UseClientGuarantorReturn {
  createdLead: Partial<ClientResponse | null>;
  isLeadCreated: boolean;

  guarantorData: { id: number; name: string } | null;
  secondaryClientsData: { id: number; name: string }[];
  clientAddress: string;

  loading: {
    lead: boolean;
    client: boolean;
    creating: boolean;
  };

  handleCreateLead: (leadData: ClientRequest) => Promise<void>;
  handleAddressChange: (address: string) => void;
  handleGuarantorClientSuccess: (
    secondaryClientFormData: SecondaryClientFormData[],
    guarantorFormData?: GuarantorFormData
  ) => Promise<void>;

  getClientId: () => number;
  getGuarantorId: () => number;
  getSecondaryClientsId: () => number[];
}

export function useClientGuarantor(): UseClientGuarantorReturn {
  const [createdLead, setCreatedLead] =
    useState<Partial<ClientResponse | null>>(null);
  const [isLeadCreated, setIsLeadCreated] = useState(false);

  const [clientId, setClientId] = useState<number>(0);
  const [guarantorData, setGuarantorData] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [secondaryClientsData, setSecondaryClientsData] = useState<
    { id: number; name: string }[]
  >([]);
  const [clientAddress, setClientAddress] = useState("");

  const [loading, setLoading] = useState({
    lead: false,
    client: false,
    creating: false,
  });

  const handleCreateLead = useCallback(async (leadData: ClientRequest) => {
    setLoading((prev) => ({ ...prev, lead: true }));
    try {
      const result = await createLead(leadData);

      const newLead: Partial<ClientResponse> = {
        id: result.id.toString(),
        firstName: leadData.firstName,
        lastName: leadData.lastName,
        document: leadData.document,
        age: result.age,
        email: result.email,
      };

      setCreatedLead(newLead);
      setIsLeadCreated(true);
      toast.success(
        "Lead creado correctamente. Ahora puedes agregar garantes y compradores."
      );
    } catch (error) {
      toast.error("Error al crear el lead");
      console.error("Error creating lead:", error);
      throw error;
    } finally {
      setLoading((prev) => ({ ...prev, lead: false }));
    }
  }, []);

  const handleAddressChange = useCallback((address: string) => {
    setClientAddress(address);
  }, []);

  const handleGuarantorClientSuccess = useCallback(
    async (
      secondaryClientsFormData: SecondaryClientFormData[],
      guarantorFormData?: GuarantorFormData
    ) => {
      if (!createdLead) {
        toast.error("Debe crear un lead primero");
        return;
      }

      if (!clientAddress.trim()) {
        toast.error("Debe especificar una dirección para el cliente");
        return;
      }

      setLoading((prev) => ({ ...prev, creating: true }));
      try {
        if (!createdLead.id || !createdLead.document) {
          toast.error("Necesitas un cliente");
          return;
        }

        const payload = {
          createClient: {
            leadId: createdLead.id,
            address: clientAddress,
          },
          createGuarantor: guarantorFormData,
          createSecondaryClient: secondaryClientsFormData,
          document: createdLead.document,
        };

        const result = await createClientGuarantor(payload);

        console.log("data: ", result);

        setClientId(result.clientId);

        if (guarantorFormData && result.guarantorId) {
          setGuarantorData({
            id: result.guarantorId,
            name: `${guarantorFormData.firstName} ${guarantorFormData.lastName}`,
          });
        }

        if (result.secondaryClientIds && result.secondaryClientIds.length > 0) {
          setSecondaryClientsData(
            result.secondaryClientIds.map((id, index) => ({
              id,
              name: `${secondaryClientsFormData[index].firstName} ${secondaryClientsFormData[index].lastName}`,
            }))
          );
        }

        toast.success("Cliente y datos adicionales creados correctamente");
      } catch (error) {
        toast.error("Error al crear cliente y datos adicionales");
        console.error("Error creating client and guarantor:", error);
        throw error;
      } finally {
        setLoading((prev) => ({ ...prev, creating: false }));
      }
    },
    [createdLead, clientAddress]
  );

  const getClientId = useCallback(() => {
    return clientId;
  }, [clientId]);

  const getGuarantorId = useCallback(() => {
    return guarantorData?.id || 0;
  }, [guarantorData]);

  const getSecondaryClientsId = useCallback(() => {
    return secondaryClientsData.map((client) => client.id);
  }, [secondaryClientsData]);

  return {
    createdLead,
    isLeadCreated,

    guarantorData,
    secondaryClientsData,
    clientAddress,

    loading,

    handleCreateLead,
    handleAddressChange,
    handleGuarantorClientSuccess,

    getClientId,
    getGuarantorId,
    getSecondaryClientsId,
  };
}
