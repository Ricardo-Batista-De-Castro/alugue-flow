import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';

export const useContratos = () =>
  useQuery({
    queryKey: ['contratos'],
    queryFn: async () => {
      const { data } = await api.get('/api/contratos');
      return data;
    },
  });

export const useCreateContrato = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post('/api/contratos', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contratos'] });
      qc.invalidateQueries({ queryKey: ['imoveis'] });
    },
  });
};

export const useUpdateContrato = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => api.put(`/api/contratos/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contratos'] });
      qc.invalidateQueries({ queryKey: ['imoveis'] });
    },
  });
};

export const useDeleteContrato = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/api/contratos/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contratos'] });
      qc.invalidateQueries({ queryKey: ['imoveis'] });
    },
  });
};
