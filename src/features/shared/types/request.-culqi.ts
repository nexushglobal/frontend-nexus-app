export interface CustomerRequest {
  email: string;
  first_name: string;
  last_name: string;
  address: string;
  address_city: string;
  country_code: string;
  phone_number: string;
}

export interface CustomerUpdateRequest {
  first_name?: string;
  last_name?: string;
  address?: string;
  address_city?: string;
  country_code?: string;
  phone_number?: string;
}

export interface CardRequest {
  tokenId: string;
}
