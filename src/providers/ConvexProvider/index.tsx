"use client";

import { type ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

const client = convexUrl ? new ConvexReactClient(convexUrl) : null;

if (!convexUrl && typeof window !== "undefined") {
  console.warn("NEXT_PUBLIC_CONVEX_URL missing. Convex client features disabled.");
}

export function ConvexProviderWrapper({ children }: { children: ReactNode }) {
  if (!client) {
    return children;
  }

  return <ConvexAuthProvider client={client}>{children}</ConvexAuthProvider>;
}


