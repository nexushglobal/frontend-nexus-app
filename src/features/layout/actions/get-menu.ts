"use server";

import { api } from "@/features/shared/services/api";
import { UserMenuResponse } from "../types/menu.types";

export async function getUserMenuAction() {
  try {
    const response = await api.get<UserMenuResponse>("/api/user/menu", {
      next: {
        revalidate: 600,
      },
    });
    return { success: true, data: response };
  } catch {
    return {
      success: false,
      data: null,
      error: "Error al obtener el menú del usuario",
    };
  }
}
