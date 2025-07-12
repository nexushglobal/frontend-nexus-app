// src/providers/QueryProvider.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // Tiempo que los datos se consideran frescos
                        staleTime: 1000 * 60 * 2, // 2 minutos
                        // Tiempo que los datos se mantienen en cache
                        gcTime: 1000 * 60 * 10, // 10 minutos
                        // Retry en caso de error
                        retry: (failureCount, error: any) => {
                            // No reintentar en errores 4xx
                            if (error?.statusCode >= 400 && error?.statusCode < 500) {
                                return false
                            }
                            // Máximo 3 reintentos para otros errores
                            return failureCount < 3
                        },
                        // Configuración de refetch
                        refetchOnWindowFocus: false,
                        refetchOnReconnect: true,
                    },
                    mutations: {
                        retry: false,
                    },
                },
            })
    )

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}