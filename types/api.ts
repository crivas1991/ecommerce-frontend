export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

/** Forma de los errores que devuelve Laravel (422, 403, 404, ...). */
export interface ApiErrorBody {
  message?: string;
  errors?: Record<string, string[]>;
}

/** Resultado de una Server Action que puede fallar (en éxito normalmente hace redirect). */
export interface ActionResult {
  error?: string;
  fieldErrors?: Record<string, string[]>;
}
