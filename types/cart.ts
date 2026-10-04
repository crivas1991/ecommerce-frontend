import type { Product } from "./product";

/** Lo mínimo del producto que necesita el carrito (se guarda en localStorage). */
export type CartProduct = Pick<Product, "id" | "name" | "price" | "image_url" | "stock">;

export interface CartItem {
  product: CartProduct;
  quantity: number;
}
