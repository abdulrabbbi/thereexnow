"use client";

// Since QueryClientProvider relies on useContext under the hood, we have to put 'use client' on top
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";
import { toast } from "sonner";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: 1,
      },
      mutations: {
        // Show a global toast on every mutation error
        onError: (error) => {
          !!error.message && toast.error(error.message);
        },
      },
    },
  });
}

export default function TanstackProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Lazy init ensures the QueryClient instance stays stable across re-renders.
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
