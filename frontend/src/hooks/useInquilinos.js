import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

// Hook para buscar todos os inquilinos
export const useInquilinos = () => {
  return useQuery({
    queryKey: ['inquilinos'],
    queryFn: async () => {
      const response = await api.get('/api/inquilinos');
      return response.data.inquilinos || response.data;
    },
  });
};

// Hook para criar inquilino
export const useCreateInquilino = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/api/inquilinos', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquilinos'] });
    },
  });
};

// Hook para atualizar inquilino
export const useUpdateInquilino = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/api/inquilinos/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquilinos'] });
    },
  });
};

// Hook para deletar inquilino
export const useDeleteInquilino = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/api/inquilinos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquilinos'] });
    },
  });
};
