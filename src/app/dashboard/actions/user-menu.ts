"use server";

import { httpClient } from "@/lib/api/http-client";
import { UserMenuResponse } from "@/types/menu.types";
const USER_MENU_CACHE_TAG = "user-menu";
export async function getUserMenu() {
  try {
    const response = await httpClient<UserMenuResponse>("/api/user/menu", {
      method: "GET",
      next: {
        tags: [USER_MENU_CACHE_TAG],
        revalidate: 300,
      },
    });

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.views,
        message: response.message,
      };
    } else {
      console.error("Error getting user menu:", response.errors);
      return {
        success: false,
        data: [],
        message: response.message || "Error al obtener el menú del usuario",
      };
    }
  } catch (error) {
    console.error("Error fetching user menu:", error);
    return {
      success: false,
      data: [],
      message: "Error de conexión al obtener el menú",
    };
  }
}
