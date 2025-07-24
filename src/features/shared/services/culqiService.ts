
import {
  CardValidation,
  CreateTokenRequest,
  CreateTokenResponse,
  PaymentFormState,
} from "../types/token.types";

class CulqiService {
  private readonly apiEndpoint = "/api/payments/culqi/tokens";

  /**
   * Validar datos de tarjeta en el frontend antes de enviar
   */
  validateCardData(data: PaymentFormState): CardValidation {
    const errors: string[] = [];

    // Limpiar número de tarjeta
    const cleanCardNumber = data.cardNumber.replace(/\s/g, "");

    // Validar número de tarjeta
    if (!cleanCardNumber) {
      errors.push("El número de tarjeta es requerido");
    } else if (!/^\d{13,16}$/.test(cleanCardNumber)) {
      errors.push("El número de tarjeta debe tener entre 13 y 16 dígitos");
    } else if (!this.isValidCardNumber(cleanCardNumber)) {
      errors.push("El número de tarjeta no es válido (Luhn)");
    }

    // Validar CVV
    if (!data.cvv) {
      errors.push("El CVV es requerido");
    } else if (!/^\d{3,4}$/.test(data.cvv)) {
      errors.push("El CVV debe tener 3 o 4 dígitos");
    }

    // Validar mes
    const month = parseInt(data.expirationMonth);
    if (!data.expirationMonth) {
      errors.push("El mes de expiración es requerido");
    } else if (month < 1 || month > 12) {
      errors.push("El mes debe estar entre 1 y 12");
    }

    // Validar año
    const year = parseInt(data.expirationYear);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    if (!data.expirationYear) {
      errors.push("El año de expiración es requerido");
    } else if (data.expirationYear.length !== 4) {
      errors.push("El año debe tener 4 dígitos");
    } else if (
      year < currentYear ||
      (year === currentYear && month < currentMonth)
    ) {
      errors.push("La tarjeta ha expirado");
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email) {
      errors.push("El email es requerido");
    } else if (!emailRegex.test(data.email)) {
      errors.push("El formato del email no es válido");
    } else if (data.email.length > 50) {
      errors.push("El email no puede superar los 50 caracteres");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Algoritmo de Luhn para validar número de tarjeta
   */
  private isValidCardNumber(cardNumber: string): boolean {
    let sum = 0;
    let isEven = false;

    // Procesar dígitos de derecha a izquierda
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i));

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  /**
   * Detectar marca de tarjeta basado en el número
   */
  detectCardBrand(cardNumber: string): string | null {
    const cleanNumber = cardNumber.replace(/\s/g, "");

    // Patrones de marcas de tarjeta
    const patterns = {
      visa: /^4/,
      mastercard: /^5[1-5]|^2[2-7]/,
      amex: /^3[47]/,
      diners: /^3[0689]/,
    };

    for (const [brand, pattern] of Object.entries(patterns)) {
      if (pattern.test(cleanNumber)) {
        return brand.charAt(0).toUpperCase() + brand.slice(1);
      }
    }

    return null;
  }

  /**
   * Formatear número de tarjeta para mostrar
   */
  formatCardNumber(cardNumber: string): string {
    const cleanNumber = cardNumber.replace(/\s/g, "");
    const chunks = cleanNumber.match(/.{1,4}/g) || [];
    return chunks.join(" ").trim();
  }

  /**
   * Crear token de Culqi
   */
  async createToken(data: PaymentFormState): Promise<CreateTokenResponse> {
    // Validar datos antes de enviar
    const validation = this.validateCardData(data);
    if (!validation.isValid) {
      return {
        success: false,
        message: "Datos de tarjeta inválidos",
        errors: validation.errors,
      };
    }

    // Preparar datos para la API
    const requestData: CreateTokenRequest = {
      card_number: data.cardNumber.replace(/\s/g, ""),
      cvv: data.cvv,
      expiration_month: data.expirationMonth.padStart(2, "0"), // Asegurar 2 dígitos
      expiration_year: data.expirationYear,
      email: data.email.toLowerCase().trim(),
      ...(data.metadata && { metadata: data.metadata }),
    };

    try {
      const response = await fetch(this.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const result: CreateTokenResponse = await response.json();

      if (!response.ok) {
        console.error("Error del servidor:", {
          status: response.status,
          result,
        });
      }

      return result;
    } catch (error) {
      console.error("Error de red al crear token:", error);

      return {
        success: false,
        message: "Error de conexión",
        errors: [
          "No se pudo conectar con el servidor de pagos. Verifica tu conexión.",
        ],
      };
    }
  }

  /**
   * Enmascarar número de tarjeta para logs o display
   */
  maskCardNumber(cardNumber: string): string {
    const cleanNumber = cardNumber.replace(/\s/g, "");
    if (cleanNumber.length < 8) return cleanNumber;

    const firstFour = cleanNumber.slice(0, 4);
    const lastFour = cleanNumber.slice(-4);
    const middle = "*".repeat(cleanNumber.length - 8);

    return `${firstFour}${middle}${lastFour}`;
  }

  /**
   * Obtener mensaje de error amigable
   */
  getErrorMessage(errorCode?: string): string {
    const errorMessages: Record<string, string> = {
      card_number_invalid: "El número de tarjeta no es válido",
      cvv_invalid: "El código CVV no es válido",
      expiration_date_invalid: "La fecha de expiración no es válida",
      expired_card: "La tarjeta ha expirado",
      invalid_email: "El formato del email no es válido",
      processing_error: "Error al procesar la tarjeta",
      insufficient_funds: "Fondos insuficientes",
      card_blocked: "La tarjeta está bloqueada",
      issuer_not_available: "El banco emisor no está disponible",
    };

    return (
      errorMessages[errorCode || ""] ||
      "Error desconocido al procesar la tarjeta"
    );
  }
}

// Exportar instancia singleton
export const culqiService = new CulqiService();
export default culqiService;
