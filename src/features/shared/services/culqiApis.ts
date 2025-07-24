import { api } from "@/features/shared/services/api";
import { CustomerResponse } from "../types/culqi.types";

export class CustomerService {
  static async getUserCulqi(): Promise<CustomerResponse> {
    return api.get<CustomerResponse>("/api/culqi/payments/customer");
  }
}
