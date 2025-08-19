'use server';

import { api } from '@/features/shared/services/api';
import { CompleteRegistrationData } from '../schemas/register-schemas';
import {
  DocumentValidationRequest,
  DocumentValidationResponse,
  RegisterUserRequest,
} from '../types/register.types';

export async function registerUserAction(data: CompleteRegistrationData) {
  try {
    const requestData: RegisterUserRequest = {
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

    const response = await api.post('/api/auth/register', requestData);

    return {
      success: true,
      message: 'Usuario registrado exitosamente',
      data: response,
    };
  } catch (error) {
    let errorMessage = 'Error al procesar la suscripción';
    let errorDetails = 'Error desconocido';

    if (error instanceof Error) {
      errorDetails = error.message;

      try {
        const errorData = JSON.parse(error.message);
        if (errorData.message) {
          errorMessage = errorData.message;
        }
        if (errorData.errors) {
          errorDetails = Array.isArray(errorData.errors)
            ? errorData.errors.join(', ')
            : errorData.errors;
        }
      } catch {
        errorMessage = error.message;
      }
    }

    return {
      success: false,
      message: errorMessage,
      errors: errorDetails,
      data: null,
    };
  }
}
export async function validateDocumentAction(
  documentNumber: string,
  documentType: 'dni' | 'ruc',
) {
  try {
    const requestData: DocumentValidationRequest = {
      numberDocument: documentNumber,
      documentType: documentType,
    };
    const response = await api.post<DocumentValidationResponse>(
      '/api/integration/document/validate',
      requestData,
    );

    return {
      success: true,
      message: 'Documento validado exitosamente',
      data: response,
    };
  } catch (error) {
    let errorMessage = 'Error al validar el documento';
    let errorDetails = 'Error desconocido';

    if (error instanceof Error) {
      errorDetails = error.message;

      try {
        const errorData = JSON.parse(error.message);
        if (errorData.message) {
          errorMessage = errorData.message;
        }
        if (errorData.errors) {
          errorDetails = Array.isArray(errorData.errors)
            ? errorData.errors.join(', ')
            : errorData.errors;
        }
      } catch {
        errorMessage = error.message;
      }
    }

    return {
      success: false,
      message: errorMessage,
      errors: errorDetails,
      data: null,
    };
  }
}
