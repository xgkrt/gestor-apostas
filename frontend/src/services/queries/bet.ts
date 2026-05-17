import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { betAPI } from '../api';
import type { Bet, CreateBetDTO } from '../../types';

export const useBets = (bankrollId?: number, enabled = true) => {
  return useQuery<Bet[]>({
    queryKey: ['bets', bankrollId],
    queryFn: async () => {
      const response = bankrollId
        ? await betAPI.getByBankrollId(bankrollId)
        : await betAPI.getAll();
      return response.data;
    },
    enabled,
  });
};

export const useCreateBet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBetDTO) => betAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['bankrolls'] });
    },
  });
};

export const useUpdateBet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateBetDTO }) =>
      betAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['bankrolls'] });
    },
  });
};

export const useDeleteBet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => betAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['bankrolls'] });
    },
  });
};

export const useUpdateBetStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      betAPI.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['bankrolls'] });
    },
  });
};
