import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookmakerAPI, championshipAPI, marketAPI, sportAPI, tipsterAPI } from '../api';
import type {
  Bookmaker,
  BookmakerDTO,
  Championship,
  ChampionshipDTO,
  Market,
  MarketDTO,
  Sport,
  SportDTO,
  Tipster,
  TipsterDTO,
} from '../../types';

export const useSports = () => {
  return useQuery<Sport[]>({
    queryKey: ['sports'],
    queryFn: async () => {
      const response = await sportAPI.getAll();
      return response.data;
    },
  });
};

export const useCreateSport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SportDTO) => sportAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sports'] });
    },
  });
};

export const useUpdateSport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: SportDTO }) =>
      sportAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sports'] });
    },
  });
};

export const useDeleteSport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => sportAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sports'] });
    },
  });
};

export const useChampionships = () => {
  return useQuery<Championship[]>({
    queryKey: ['championships'],
    queryFn: async () => {
      const response = await championshipAPI.getAll();
      return response.data;
    },
  });
};

export const useChampionshipsBySport = (sportId: number | null | undefined) => {
  return useQuery<Championship[]>({
    queryKey: ['championships', 'sport', sportId],
    queryFn: async () => {
      if (!sportId) return [];
      const response = await championshipAPI.getBySportId(sportId);
      return response.data;
    },
    enabled: !!sportId,
  });
};

export const useCreateChampionship = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ChampionshipDTO) => championshipAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['championships'] });
    },
  });
};

export const useUpdateChampionship = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ChampionshipDTO }) =>
      championshipAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['championships'] });
    },
  });
};

export const useDeleteChampionship = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => championshipAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['championships'] });
    },
  });
};

export const useMarkets = () => {
  return useQuery<Market[]>({
    queryKey: ['markets'],
    queryFn: async () => {
      const response = await marketAPI.getAll();
      return response.data;
    },
  });
};

export const useCreateMarket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MarketDTO) => marketAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['markets'] });
    },
  });
};

export const useUpdateMarket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: MarketDTO }) =>
      marketAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['markets'] });
    },
  });
};

export const useDeleteMarket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => marketAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['markets'] });
    },
  });
};

export const useBookmakers = () => {
  return useQuery<Bookmaker[]>({
    queryKey: ['bookmakers'],
    queryFn: async () => {
      const response = await bookmakerAPI.getAll();
      return response.data;
    },
  });
};

export const useCreateBookmaker = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BookmakerDTO) => bookmakerAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmakers'] });
    },
  });
};

export const useUpdateBookmaker = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: BookmakerDTO }) =>
      bookmakerAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmakers'] });
    },
  });
};

export const useDeleteBookmaker = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => bookmakerAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmakers'] });
    },
  });
};

export const useTipsters = () => {
  return useQuery<Tipster[]>({
    queryKey: ['tipsters'],
    queryFn: async () => {
      const response = await tipsterAPI.getAll();
      return response.data;
    },
  });
};

export const useCreateTipster = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TipsterDTO) => tipsterAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipsters'] });
    },
  });
};

export const useUpdateTipster = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TipsterDTO }) =>
      tipsterAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipsters'] });
    },
  });
};

export const useDeleteTipster = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => tipsterAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipsters'] });
    },
  });
};
