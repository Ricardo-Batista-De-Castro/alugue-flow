import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';

export const usePessoas = () =>
  useQuery({ queryKey: ['pessoas'], queryFn: async () => { const { data } = await api.get('/api/pessoas'); return data; } });

export const useCreatePessoa = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data) => api.post('/api/pessoas', data), onSuccess: () => qc.invalidateQueries({ queryKey: ['pessoas'] }) });
};

export const useUpdatePessoa = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }) => api.put(`/api/pessoas/${id}`, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['pessoas'] }) });
};

export const useDeletePessoa = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id) => api.delete(`/api/pessoas/${id}`), onSuccess: () => qc.invalidateQueries({ queryKey: ['pessoas'] }) });
};
