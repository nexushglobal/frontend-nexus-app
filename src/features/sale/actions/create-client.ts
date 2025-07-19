import { api } from "@/features/shared/services/api";
import { ClientGuarantorRequest, ClientRequest } from "../types/sale-request";
import {
  ClientGuarantorResponse,
  ClientResponse,
} from "../types/sale-response.types";

export async function createLead(data: ClientRequest): Promise<ClientResponse> {
  try {
    return await api.post<ClientResponse>("/api/unilevel/external/leads", {
      data,
    });
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    throw Error;
  }
}

export async function createClientGuarantor(
  data: ClientGuarantorRequest
): Promise<ClientGuarantorResponse> {
  try {
    return await api.post<ClientGuarantorResponse>(
      "/api/unilevel/external/clients-and-guarantors",
      {
        data,
      }
    );
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    throw Error;
  }
}
