"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const reactQueryClient = new QueryClient()
const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(reactQueryClient);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default ReactQueryProvider;