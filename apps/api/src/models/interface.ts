export interface UserInput {
  email: string;
}

export interface TenantInput {
  companyName: string;
  email: string;
}

export interface UserPayLoad {
  userId: number;
  email: string;
  role: 'USER' | 'TENANT';
  purpose?: 'verify' | 'access';
}

export interface TransactionDetails {
  order_id: string;
  gross_amount: number;
}

export interface CustomerDetails {
  first_name: string;
  email: string;
}

export interface ItemDetails {
  id: string;
  name: string;
  price: number;
  quantity: number;
}
export interface Expiry {
  start_time: string;
  unit: 'minutes' | 'hours' | 'days';
  duration: number;
}

export interface SnapRequest {
  transaction_details: TransactionDetails;
  customer_details?: CustomerDetails;
  item_details?: ItemDetails[];
  expiry?: Expiry;
}
