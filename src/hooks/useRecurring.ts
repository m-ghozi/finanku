import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recurringService } from '@/src/lib/api/recurring';
import { CreateRecurringDTO, UpdateRecurringDTO } from '@/src/types/recurring';
import { DASHBOARD_KEY } from './useDashboard';

export const RECURRING_KEY = ['recurring'];

export function useRecurring() {
  return useQuery({
    queryKey: RECURRING_KEY,
    queryFn: () => recurringService.getRecurring(),
  });
}

export function useCreateRecurring() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateRecurringDTO) => recurringService.createRecurring(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECURRING_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
    },
  });
}

export function useUpdateRecurring() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateRecurringDTO }) =>
      recurringService.updateRecurring(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECURRING_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
    },
  });
}

export function useDeleteRecurring() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => recurringService.deleteRecurring(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECURRING_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
    },
  });
}
