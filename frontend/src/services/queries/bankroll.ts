import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bankrollAPI } from '../api';
import type { Bankroll, CreateBankrollDTO } from '../../types';

export const useBankrolls = () => {
  return useQuery<Bankroll[]>({
    queryKey: ['bankrolls'],
    queryFn: async () => {
      const response = await bankrollAPI.getAll();
      return response.data;
    },
  });
};

export const useBankroll = (id: number) => {
  return useQuery<Bankroll>({
    queryKey: ['bankroll', id],
    queryFn: async () => {
      const response = await bankrollAPI.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateBankroll = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBankrollDTO) => bankrollAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bankrolls'] });
    },
  });
};

export const useUpdateBankroll = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateBankrollDTO }) =>
      bankrollAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bankrolls'] });
    },
  });
};

export const useDeleteBankroll = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => bankrollAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bankrolls'] });
    },
  });
};
