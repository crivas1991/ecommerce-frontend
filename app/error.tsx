"use client";

import { ErrorFallback } from "@/components/ui/ErrorFallback";

export default function Error(props: { error: Error & { digest?: string }; retry: () => void }) {
  return <ErrorFallback {...props} />;
}
