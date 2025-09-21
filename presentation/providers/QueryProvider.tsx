"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Tempo que os dados ficam "frescos" antes de serem considerados stale
            staleTime: 60 * 1000, // 1 minuto
            // Tempo que os dados ficam em cache
            gcTime: 5 * 60 * 1000, // 5 minutos
            // Retry automático em caso de erro
            retry: (failureCount, error: any) => {
              // Não retry para erros 401 (não autorizado)
              if (error?.response?.status === 401) {
                return false;
              }
              // Retry até 3 vezes para outros erros
              return failureCount < 3;
            },
            // Tempo entre retries
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            // Refetch quando a janela ganha foco
            refetchOnWindowFocus: false,
            // Refetch quando reconecta à internet
            refetchOnReconnect: true,
          },
          mutations: {
            // Retry para mutations
            retry: (failureCount, error: any) => {
              // Não retry para erros 4xx (client errors)
              if (error?.response?.status >= 400 && error?.response?.status < 500) {
                return false;
              }
              // Retry até 2 vezes para outros erros
              return failureCount < 2;
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools apenas em desenvolvimento */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
