"use server";
import { api } from "../services/api";
import {
  CardRequest,
  CustomerRequest,
  CustomerUpdateRequest,
} from "../types/request.-culqi";

export async function createCustomerAction(data: CustomerRequest) {
  try {
    const response = await api.post<{
      userId:string;
      culqiCustomerId:string
    }>(`/api/culqi/payments/customer`, data, {
      cache: "no-store",
    });
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al crear el cliente",
      data: null,
      errors: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateCustomerAction(
  customerId: string,
  data: CustomerUpdateRequest
) {
  try {
    const response = await api.patch<{
      userId:string;
      culqiCustomerId:string
    }>(
      `/api/culqi/payments/customer/${customerId}`,
      data,
      {
        cache: "no-store",
      }
    );
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al actualizar el cliente",
      data: null,
      errors: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function createCardAction(data: CardRequest) {
  try {
    const response = await api.post<{
      id:number;
      culqiCardId:string;
    }>(`/api/culqi/payments/card`, data, {
      cache: "no-store",
    });
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al crear la tarjeta",
      data: null,
      errors: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateCardAction(cardId: string, data: CardRequest) {
  try {
    const response = await api.patch<{ id: number; culqiCardId: string }>(
      `/api/culqi/payments/card/${cardId}`,
      data,
      {
        cache: "no-store",
      }
    );
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al actualizar la tarjeta",
      data: null,
      errors: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteCardAction(cardId: string) {
  try {
    const response = await api.delete<
      { deleted: boolean; message: string }
    >(`/api/culqi/payments/card/${cardId}`, {
      cache: "no-store",
    });
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al eliminar la tarjeta",
      data: null,
      errors: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
