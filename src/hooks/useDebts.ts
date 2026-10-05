import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { debtsService } from '@/src/lib/api/debts';
import {
  CreateDebtDTO,
  UpdateDebtDTO,
  RecordDebtPaymentDTO,
  DebtType,
  DebtStatus,
} from '@/src/types/debt';
import { ACCOUNTS_KEY } from './useAccounts';
import { DASHBOARD_KEY } from './useDashboard';
import { REPORTS_KEY } from './useReports';

export const DEBTS_KEY = ['debts'];

export function useDebts(type?: DebtType, status?: DebtStatus) {
  return useQuery({
    queryKey: [...DEBTS_KEY, { type, status }],
    queryFn: () => debtsService.getDebts(type, status),
  });
}

export function useCreateDebt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateDebtDTO) => debtsService.createDebt(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEBTS_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
      queryClient.invalidateQueries({ queryKey: REPORTS_KEY });
    },
  });
}

export function useRecordDebtPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: RecordDebtPaymentDTO }) =>
      debtsService.recordPayment(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEBTS_KEY });
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
      queryClient.invalidateQueries({ queryKey: REPORTS_KEY });
    },
  });
}

export function useUpdateDebt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateDebtDTO }) =>
      debtsService.updateDebt(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEBTS_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
      queryClient.invalidateQueries({ queryKey: REPORTS_KEY });
    },
  });
}

export function useDeleteDebt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => debtsService.deleteDebt(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEBTS_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
      queryClient.invalidateQueries({ queryKey: REPORTS_KEY });
    },
  });
}
