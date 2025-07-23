export interface PaymentHistoryItem {
  state: string;
  city: string;
  fullName: string;
  email: string;
  id: string;
  transaction_id: string;
  amount: number;
  currency: string;
  date: string;
  status: "paid" | "failed" | "pending";
  invoice_url?: string;
  plan_name?: string;
}

export interface PaymentHistoryResponse {
  data: PaymentHistoryItem[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_records: number;
    per_page: number;
  };
}

export interface InvoiceDetails {
  transaction_id: string;
  amount: number;
  currency: string;
  date: string;
  plan_name: string;
  customer: {
    name: string;
    email: string;
    address?: string;
    city?: string;
    state?: string;
  };
}
