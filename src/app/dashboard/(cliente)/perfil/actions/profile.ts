"use server";

import { httpClient } from "@/lib/api/http-client";
import {
  BankInfoRequest,
  BillingInfoRequest,
  ContactInfoRequest,
  ProfileData,
} from "@/types/profile.types";
import { ActionResponse } from "@/types/user.types";

export async function getProfile(): Promise<ActionResponse<ProfileData>> {
  try {
    const apiResponse = await httpClient<ProfileData>("/api/user/profile", {
      method: "GET",
    });

    return {
      success: apiResponse.success,
      message: apiResponse.message,
      data: apiResponse.data,
      errors: apiResponse.errors,
    };
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    return {
      success: false,
      message: "Error al obtener el perfil",
      data: null,
      errors: error,
    };
  }
}

export async function updateContactInfo(
  data: ContactInfoRequest
): Promise<ActionResponse<null>> {
  try {
    const apiResponse = await httpClient<null>(
      "/api/user/profile/contact-info",
      {
        method: "PUT",
        body: data,
      }
    );

    return {
      success: apiResponse.success,
      message: apiResponse.message || "Información de contacto actualizada",
      data: apiResponse.data,
      errors: apiResponse.errors,
    };
  } catch (error: any) {
    console.error("Error updating contact info:", error);
    return {
      success: false,
      message: "Error al actualizar información de contacto",
      data: null,
      errors: error,
    };
  }
}

export async function updateBillingInfo(
  data: BillingInfoRequest
): Promise<ActionResponse<null>> {
  try {
    const apiResponse = await httpClient<null>(
      "/api/user/profile/billing-info",
      {
        method: "PUT",
        body: data,
      }
    );

    return {
      success: apiResponse.success,
      message: apiResponse.message || "Información de facturación actualizada",
      data: apiResponse.data,
      errors: apiResponse.errors,
    };
  } catch (error: any) {
    console.error("Error updating billing info:", error);
    return {
      success: false,
      message: "Error al actualizar información de facturación",
      data: null,
      errors: error,
    };
  }
}

export async function updateBankInfo(
  data: BankInfoRequest
): Promise<ActionResponse<null>> {
  try {
    const apiResponse = await httpClient<null>("/api/user/profile/bank-info", {
      method: "PUT",
      body: data,
    });

    return {
      success: apiResponse.success,
      message: apiResponse.message || "Información bancaria actualizada",
      data: apiResponse.data,
      errors: apiResponse.errors,
    };
  } catch (error: any) {
    console.error("Error updating bank info:", error);
    return {
      success: false,
      message: "Error al actualizar información bancaria",
      data: null,
      errors: error,
    };
  }
}

export async function updatePhoto(
  formData: FormData
): Promise<ActionResponse<null>> {
  try {
    const apiResponse = await httpClient<null>("/api/user/profile/photo", {
      method: "PUT",
      body: formData,
      skipJsonStringify: true,
    });

    return {
      success: apiResponse.success,
      message: apiResponse.message || "Foto actualizada correctamente",
      data: apiResponse.data,
      errors: apiResponse.errors,
    };
  } catch (error: any) {
    console.error("Error updating photo:", error);
    return {
      success: false,
      message: "Error al actualizar la foto",
      data: null,
      errors: error,
    };
  }
}
