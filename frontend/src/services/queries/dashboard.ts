import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '../api';
import type { Dashboard } from '../../types';

export const useDashboard = (bankrollId?: number, startDate?: string, endDate?: string) => {
  return useQuery<Dashboard>({
    queryKey: ['dashboard', bankrollId, startDate ?? null, endDate ?? null],
    queryFn: async () => {
      if (!bankrollId) {
        throw new Error('Bankroll ID is required');
      }
      const response = await dashboardAPI.get(bankrollId, startDate, endDate);
      return response.data;
    },
    enabled: !!bankrollId,
    placeholderData: (previousData) => previousData,
  });
};
