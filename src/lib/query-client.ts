"use client";

import { QueryClient, type QueryClientConfig } from "@tanstack/react-query";

const queryConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
};

export function createQueryClient() {
  return new QueryClient(queryConfig);
}

export type { QueryClientConfig };
