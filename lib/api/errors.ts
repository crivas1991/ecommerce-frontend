import type { ActionResult } from "@/types";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Convierte cualquier error en algo que una Server Action pueda devolver al cliente. */
export function toActionResult(error: unknown): ActionResult {
  if (error instanceof ApiError) {
    return { error: error.message, fieldErrors: error.errors };
  }
  return { error: "Ocurrió un error inesperado. Inténtalo de nuevo." };
}
