import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

// Hook para buscar todos os contratos
export const useContratos = () => {
  return useQuery({
    queryKey: ['contratos'],
    queryFn: async () => {
      const response = await api.get('/api/contratos');
      return response.data.contratos || response.data;
    },
  });
};

// Hook para criar contrato
export const useCreateContrato = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/api/contratos', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos'] });
      // Também invalida imóveis pois o status pode mudar
      queryClient.invalidateQueries({ queryKey: ['imoveis'] });
    },
  });
};

// Hook para atualizar contrato
export const useUpdateContrato = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/api/contratos/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos'] });
      queryClient.invalidateQueries({ queryKey: ['imoveis'] });
    },
  });
};

// Hook para deletar contrato
export const useDeleteContrato = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/api/contratos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos'] });
      queryClient.invalidateQueries({ queryKey: ['imoveis'] });
    },
  });
};
