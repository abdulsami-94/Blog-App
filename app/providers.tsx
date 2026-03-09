"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

export interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps): JSX.Element {
  return <SessionProvider>{children}</SessionProvider>;
}
