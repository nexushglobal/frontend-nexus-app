export interface DefaultData {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  address_city?: string;
  country_code?: string;
  metadata?: {
    documentType?: string;
    documentNumber?: string;
  }
}

export interface CardData{
  id:number;
  source_id:string;
  email:string;
  active:boolean;
  card_type:string;
  card_brand:string;
  last_four:string;
  card_number:string; // like "411111******1111"
}
export interface culqiData{
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  address_city: string;
  country_code: string;
  metadata?: {
    documentType?: string;
    documentNumber?: string;
  }
  cards: CardData[] | [];
}
export interface CustomerResponse {
  userId: string;
  defaultData?: DefaultData;
  culqiData?: culqiData;
  culqiCustomerId?: string;
}
