import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md space-y-4 py-16 text-center">
      <p className="text-5xl font-bold text-blue-700">404</p>
      <h1 className="text-xl font-semibold">No encontramos lo que buscas</h1>
      <Link href="/" className="inline-block font-medium text-blue-700 hover:underline">
        Volver al catálogo
      </Link>
    </div>
  );
}
