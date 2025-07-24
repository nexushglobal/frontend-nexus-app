export interface CustomerResponse {
  token_id: string;
  card_brand: string;
  card_type: string;
  last_four: string;
  email: string;
  active: boolean;
  creation_date: number;
  metadata?: Record<string, any>;
}
