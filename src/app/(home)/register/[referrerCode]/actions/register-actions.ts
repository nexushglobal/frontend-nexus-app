"use server";

import { httpClient } from "@/lib/api/http-client";
import { ActionResponse } from "@/types/user.types";
import { CompleteRegistrationData } from "../schemas/register-schemas";

interface DocumentValidationResponse {
  dni: string;
  name: string;
  mothers_lastname: string;
  fathers_lastname: string;
  fullname: string;
  verification_code: string;
  updated_at: string;
}

interface DocumentValidationRequest {
  numberDocument: string;
  documentType: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  birthDate: string;
  gender: string;
  country: string;
  referrerCode?: string;
  position?: "LEFT" | "RIGHT";
  roleCode: string;
  documentType: string;
  documentNumber: string;
}

export async function validateDocument(
  documentNumber: string,
  documentType: string
): Promise<ActionResponse<DocumentValidationResponse>> {
  try {
    const requestData: DocumentValidationRequest = {
      numberDocument: documentNumber,
      documentType: documentType.toLowerCase(),
    };

    const apiResponse = await httpClient<DocumentValidationResponse>(
      "/api/integration/document/validate",
      {
        method: "POST",
        body: requestData,
      }
    );

    return {
      success: apiResponse.success,
      message: apiResponse.message || "Documento validado correctamente",
      data: apiResponse.data,
      errors: apiResponse.errors,
    };
  } catch (error: any) {
    console.error("Error validating document:", error);
    return {
      success: false,
      message: "Error de conexión al validar el documento",
      data: null,
      errors: error,
    };
  }
}

export async function registerUser(
  data: CompleteRegistrationData
): Promise<ActionResponse<any>> {
  try {
    const requestData: RegisterRequest = {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      birthDate: data.birthDate,
      gender: data.gender,
      country: data.country,
      referrerCode: data.referrerCode,
      position: data.position,
      roleCode: data.roleCode,
      documentType: data.documentType,
      documentNumber: data.documentNumber,
    };

    const apiResponse = await httpClient<any>("/api/user/register", {
      method: "POST",
      body: requestData,
    });

    return {
      success: apiResponse.success,
      message: apiResponse.message || "Usuario registrado correctamente",
      data: apiResponse.data,
      errors: apiResponse.errors,
    };
  } catch (error: any) {
    console.error("Error registering user:", error);
    return {
      success: false,
      message: "Error de conexión al registrar el usuario",
      data: null,
      errors: error,
    };
  }
}
