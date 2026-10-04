"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { ActionResult, AuthResponse } from "@/types";
import { apiFetch } from "@/lib/api/client";
import { toActionResult } from "@/lib/api/errors";
import { safeRedirectPath, setSession } from "@/lib/session";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "");
}

export async function loginAction(formData: FormData): Promise<ActionResult> {
  try {
    const { token } = await apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      auth: false,
      body: { email: text(formData, "email").trim(), password: text(formData, "password") },
    });
    await setSession(token);
  } catch (error) {
    return toActionResult(error);
  }

  revalidatePath("/", "layout"); // el Header cambia al iniciar sesión
  redirect(safeRedirectPath(formData.get("next")));
}

export async function registerAction(formData: FormData): Promise<ActionResult> {
  try {
    // La API devuelve el token al registrar: el usuario queda con sesión iniciada.
    const { token } = await apiFetch<AuthResponse>("/auth/register", {
      method: "POST",
      auth: false,
      body: {
        name: text(formData, "name").trim(),
        email: text(formData, "email").trim(),
        password: text(formData, "password"),
        password_confirmation: text(formData, "password_confirmation"),
      },
    });
    await setSession(token);
  } catch (error) {
    return toActionResult(error);
  }

  revalidatePath("/", "layout");
  redirect(safeRedirectPath(formData.get("next")));
}
