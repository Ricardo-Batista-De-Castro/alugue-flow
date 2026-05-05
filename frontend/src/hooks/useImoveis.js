import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

// Hook para buscar todos os imóveis
export const useImoveis = () => {
  return useQuery({
    queryKey: ['imoveis'],
    queryFn: async () => {
      const response = await api.get('/api/imoveis');
      return response.data.imoveis || response.data;
    },
  });
};

// Hook para criar imóvel
export const useCreateImovel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/api/imoveis', data);
      return response.data;
    },
    onSuccess: () => {
      // Invalida o cache para recarregar a lista
      queryClient.invalidateQueries({ queryKey: ['imoveis'] });
    },
  });
};

// Hook para atualizar imóvel
export const useUpdateImovel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/api/imoveis/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imoveis'] });
    },
  });
};

// Hook para deletar imóvel
export const useDeleteImovel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/api/imoveis/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imoveis'] });
    },
  });
};
