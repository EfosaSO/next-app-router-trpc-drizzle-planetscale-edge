"use client";

import { useEffect, useState } from "react";
import { ClerkProvider } from "@clerk/nextjs/app-beta/client";
import { env } from "~/env.mjs";
import { api } from "~/lib/api/client";

export function ClientProviders({ children }: PropsWithChildren) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return (
    <ClerkProvider publishableKey={env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <api.Provider>{children}</api.Provider>
    </ClerkProvider>
  );
}
