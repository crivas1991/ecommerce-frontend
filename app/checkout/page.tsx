import type { Metadata } from "next";
import { CheckoutForm } from "@/components/cart/CheckoutForm";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const user = await requireUser("/checkout");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
        <p className="text-slate-600">
          Comprando como <span className="font-medium">{user.email}</span>
        </p>
      </div>
      <CheckoutForm />
    </div>
  );
}
