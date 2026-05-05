import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos - dados considerados "frescos"
      cacheTime: 10 * 60 * 1000, // 10 minutos - quanto tempo manter no cache
      refetchOnWindowFocus: false, // Não recarregar ao focar na janela
      retry: 1, // Tentar novamente 1 vez em caso de erro
      refetchOnMount: false, // Não recarregar ao montar se dados estão no cache
    },
  },
});
