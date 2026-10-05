import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetsService } from '@/src/lib/api/budgets';
import { CreateBudgetDTO, UpdateBudgetDTO } from '@/src/types/budget';
import { DASHBOARD_KEY } from './useDashboard';

export const BUDGETS_KEY = ['budgets'];

export function useBudgets(period?: string) {
  return useQuery({
    queryKey: [...BUDGETS_KEY, { period }],
    queryFn: () => budgetsService.getBudgets(period),
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateBudgetDTO) => budgetsService.createBudget(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUDGETS_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
    },
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateBudgetDTO }) =>
      budgetsService.updateBudget(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUDGETS_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => budgetsService.deleteBudget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUDGETS_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
    },
  });
}
