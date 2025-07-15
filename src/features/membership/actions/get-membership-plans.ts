"use server";

import { api } from "@/features/shared/services/api";
import {
  MEMBERSHIP_CACHE_TAGS,
  REVALIDATE_TIME,
} from "../constants/membership.constants";
import { MembershipData } from "../types/membership.types";

export async function getMembershipPlansAction() {
  try {
    const response = await api.get<MembershipData>("/api/membership-plan", {
      next: {
        tags: [
          MEMBERSHIP_CACHE_TAGS.MEMBERSHIP_PLANS,
          MEMBERSHIP_CACHE_TAGS.USER_MEMBERSHIP,
        ],
        revalidate: REVALIDATE_TIME,
      },
    });

    return {
      data: response,
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al obtener los planes de membresía",
      errors: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };
  }
}
