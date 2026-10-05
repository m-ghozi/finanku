import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { savingsService } from '@/src/lib/api/savings';
import {
  CreateSavingGoalDTO,
  UpdateSavingGoalDTO,
  AddSavingContributionDTO,
} from '@/src/types/saving';
import { ACCOUNTS_KEY } from './useAccounts';
import { DASHBOARD_KEY } from './useDashboard';
import { REPORTS_KEY } from './useReports';

export const SAVINGS_KEY = ['savings'];

export function useSavings(includeArchived: boolean = false) {
  return useQuery({
    queryKey: [...SAVINGS_KEY, { includeArchived }],
    queryFn: () => savingsService.getSavings(includeArchived),
  });
}

export function useCreateSaving() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateSavingGoalDTO) => savingsService.createSaving(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SAVINGS_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
    },
  });
}

export function useUpdateSaving() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateSavingGoalDTO }) =>
      savingsService.updateSaving(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SAVINGS_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
    },
  });
}

export function useAddSavingContribution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: AddSavingContributionDTO }) =>
      savingsService.addContribution(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SAVINGS_KEY });
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
      queryClient.invalidateQueries({ queryKey: REPORTS_KEY });
    },
  });
}

export const useAddContribution = useAddSavingContribution;

export function useDeleteSaving() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => savingsService.deleteSaving(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SAVINGS_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
    },
  });
}
