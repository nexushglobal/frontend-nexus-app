import { NextRequest, NextResponse } from "next/server";

interface CreateTokenRequest {
  card_number: string;
  cvv: string;
  expiration_month: string;
  expiration_year: string;
  email: string;
  metadata?: Record<string, any>;
}

interface CulqiTokenResponse {
  object: string;
  id: string;
  type: string;
  email: string;
  creation_date: number;
  card_number: string;
  last_four: string;
  active: boolean;
  iin: {
    object: string;
    bin: string;
    card_brand: string;
    card_type: string;
    card_category: string;
    issuer: Record<string, any>;
    installments_allowed: any[];
  };
  client: {
    ip: string;
    ip_country: string;
    ip_country_code: string;
    browser: string;
    device_fingerprint: string;
    device_type: string;
  };
  metadata?: Record<string, any>;
}

interface CulqiErrorResponse {
  object: string;
  type: string;
  code: string;
  merchant_message: string;
  user_message: string;
  param?: string;
}

function validateCardData(data: CreateTokenRequest): string[] {
  const errors: string[] = [];

  if (
    !data.card_number ||
    !/^\d{13,16}$/.test(data.card_number.replace(/\s/g, ""))
  ) {
    errors.push("El número de tarjeta debe tener entre 13 y 16 dígitos");
  }
  if (!data.cvv || !/^\d{3,4}$/.test(data.cvv)) {
    errors.push("El CVV debe tener 3 o 4 dígitos");
  }

  const month = parseInt(data.expiration_month);
  if (!data.expiration_month || month < 1 || month > 12) {
    errors.push("El mes de expiración debe estar entre 1 y 12");
  }

  const year = parseInt(data.expiration_year);
  const currentYear = new Date().getFullYear();
  if (
    !data.expiration_year ||
    year < currentYear ||
    data.expiration_year.length !== 4
  ) {
    errors.push(
      "El año de expiración debe ser válido y no menor al año actual"
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email) || data.email.length > 50) {
    errors.push("El email debe tener un formato válido y máximo 50 caracteres");
  }

  return errors;
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  return "127.0.0.1";
}

export async function POST(request: NextRequest) {
  try {
    const publicKey = process.env.CULQI_PUBLIC_KEY;

    if (!publicKey) {
      console.error("CULQI_PUBLIC_KEY no está configurada");
      return NextResponse.json(
        {
          success: false,
          message: "Configuración de pagos no disponible",
          errors: ["Service temporarily unavailable"],
        },
        { status: 500 }
      );
    }

    let body: CreateTokenRequest;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Datos inválidos",
          errors: ["El formato de los datos no es válido"],
        },
        { status: 400 }
      );
    }

    const validationErrors = validateCardData(body);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Datos de tarjeta inválidos",
          errors: validationErrors,
        },
        { status: 400 }
      );
    }

    const culqiData = {
      card_number: body.card_number.replace(/\s/g, ""),
      cvv: body.cvv,
      expiration_month: body.expiration_month,
      expiration_year: body.expiration_year,
      email: body.email.toLowerCase().trim(),
      ...(body.metadata && { metadata: body.metadata }),
    };

    const clientIP = getClientIP(request);
    const userAgent = request.headers.get("user-agent") || "";

    console.log("Creando token Culqi para:", {
      email: culqiData.email,
      last_four: culqiData.card_number.slice(-4),
      ip: clientIP,
    });

    const culqiResponse = await fetch("https://api.culqi.com/v2/tokens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicKey}`,
        "User-Agent": userAgent,
        "X-Client-IP": clientIP,
      },
      body: JSON.stringify(culqiData),
    });

    const responseData = await culqiResponse.json();

    if (!culqiResponse.ok) {
      const error = responseData as CulqiErrorResponse;

      console.error("Error de Culqi:", {
        status: culqiResponse.status,
        error: error,
      });

      let userMessage =
        error.user_message || "Error al procesar los datos de la tarjeta";

      if (error.code === "card_number_invalid") {
        userMessage = "El número de tarjeta no es válido";
      } else if (error.code === "cvv_invalid") {
        userMessage = "El código CVV no es válido";
      } else if (error.code === "expiration_date_invalid") {
        userMessage = "La fecha de expiración no es válida";
      } else if (error.code === "expired_card") {
        userMessage = "La tarjeta ha expirado";
      }

      return NextResponse.json(
        {
          success: false,
          message: userMessage,
          errors: [error.merchant_message || userMessage],
          culqi_error: {
            code: error.code,
            type: error.type,
          },
        },
        { status: culqiResponse.status }
      );
    }

    const tokenData = responseData as CulqiTokenResponse;

    console.log("Token Culqi creado exitosamente:", {
      token_id: tokenData.id,
      email: tokenData.email,
      last_four: tokenData.last_four,
      card_brand: tokenData.iin.card_brand,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Token creado exitosamente",
        data: {
          token_id: tokenData.id,
          card_brand: tokenData.iin.card_brand,
          card_type: tokenData.iin.card_type,
          last_four: tokenData.last_four,
          email: tokenData.email,
          active: tokenData.active,
          creation_date: tokenData.creation_date,
          ...(tokenData.metadata && { metadata: tokenData.metadata }),
        },
        ...(process.env.NODE_ENV === "development" && {
          full_response: tokenData,
        }),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error interno al crear token:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor",
        errors: [
          "Ha ocurrido un error inesperado. Por favor, intenta nuevamente.",
        ],
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      message: "Método no permitido",
      errors: ["Este endpoint solo acepta requests POST"],
    },
    { status: 405 }
  );
}
