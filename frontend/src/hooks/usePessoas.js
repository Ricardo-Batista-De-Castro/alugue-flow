import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

// Hook para buscar todas as pessoas
export const usePessoas = () => {
  return useQuery({
    queryKey: ['pessoas'],
    queryFn: async () => {
      const response = await api.get('/api/pessoas');
      return response.data.pessoas || response.data;
    },
  });
};

// Hook para criar pessoa
export const useCreatePessoa = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/api/pessoas', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pessoas'] });
    },
  });
};

// Hook para atualizar pessoa
export const useUpdatePessoa = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/api/pessoas/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pessoas'] });
    },
  });
};

// Hook para deletar pessoa
export const useDeletePessoa = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/api/pessoas/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pessoas'] });
    },
  });
};
