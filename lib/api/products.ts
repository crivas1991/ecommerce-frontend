import "server-only";
import type { Paginated, Product } from "@/types";
import { apiFetch } from "./client";

export const PRODUCTS_TAG = "products";
export const PRODUCTS_PER_PAGE = 8;

interface ListParams {
  search?: string;
  page?: number;
}

/** Lectura pública: se cachea 60s y se invalida con la etiqueta "products". */
export function getProducts({ search, page = 1 }: ListParams = {}) {
  const query = new URLSearchParams({
    per_page: String(PRODUCTS_PER_PAGE),
    page: String(page),
  });
  if (search) query.set("search", search);

  return apiFetch<Paginated<Product>>(`/products?${query}`, {
    auth: false,
    next: { revalidate: 60, tags: [PRODUCTS_TAG] },
  });
}

export async function getProduct(id: number) {
  const { data } = await apiFetch<{ data: Product }>(`/products/${id}`, {
    auth: false,
    next: { revalidate: 60, tags: [PRODUCTS_TAG, `product-${id}`] },
  });
  return data;
}
