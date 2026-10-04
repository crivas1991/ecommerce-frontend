import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api/client";
import { clearSession } from "@/lib/session";

/**
 * Cierra la sesión: revoca el token en Laravel y borra la cookie httpOnly.
 * Es un Route Handler porque la cookie debe eliminarse en una respuesta HTTP del servidor.
 */
export async function POST(request: Request) {
  try {
    await apiFetch("/auth/logout", { method: "POST" });
  } catch {
    // Aunque la API falle (token ya vencido), cerramos la sesión local igual.
  }

  await clearSession();
  revalidatePath("/", "layout");

  // 303: el navegador sigue con GET a la portada después del POST.
  return NextResponse.redirect(new URL("/", request.url), 303);
}
