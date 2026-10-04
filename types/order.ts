export type OrderStatus = "pending" | "paid" | "failed";

export interface OrderItem {
  id: number;
  product_id: number;
  product_name?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  status: OrderStatus;
  total: number;
  currency: string;
  items?: OrderItem[];
  created_at: string;
  updated_at: string;
}

/** Cuerpo que espera POST /orders */
export interface OrderItemInput {
  product_id: number;
  quantity: number;
}

/** Resultado de consultar el estado del pago en Stripe (vía la API). */
export interface SyncPaymentResult {
  error?: string;
  status?: OrderStatus;
}

/** Respuesta de POST /orders/{order}/pay */
export interface CheckoutSession {
  checkout_url: string;
  session_id: string;
}
