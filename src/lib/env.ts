const serverEnv = {
  apiUrl: process.env.API_BACKENDL_URL,
};

const clientEnv = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
};

const isServer = typeof window === "undefined";

function validateEnv() {
  if (isServer) {
    if (!serverEnv.apiUrl) {
      throw new Error(
        "API_BACKENDL_URL no está definida en las variables de entorno para server-side"
      );
    }
  } else {
    if (!clientEnv.apiUrl) {
      throw new Error(
        "NEXT_PUBLIC_API_URL no está definida en las variables de entorno para client-side"
      );
    }
  }
}

validateEnv();

export const env = {
  get apiUrl() {
    return isServer ? serverEnv.apiUrl : clientEnv.apiUrl;
  },
} as const;

export const serverOnly = serverEnv;
export const clientOnly = clientEnv;

export const envInfo = {
  isServer,
  apiUrl: isServer ? serverEnv.apiUrl : clientEnv.apiUrl,
  context: isServer ? "server" : "client",
};
