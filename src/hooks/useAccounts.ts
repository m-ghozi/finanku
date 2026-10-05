import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsService } from '@/src/lib/api/accounts';
import { CreateAccountDTO, UpdateAccountDTO } from '@/src/types/account';

export const ACCOUNTS_KEY = ['accounts'];

export function useAccounts(includeArchived: boolean = false) {
  return useQuery({
    queryKey: [...ACCOUNTS_KEY, { includeArchived }],
    queryFn: () => accountsService.getAccounts(includeArchived),
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateAccountDTO) => accountsService.createAccount(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_KEY });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateAccountDTO }) =>
      accountsService.updateAccount(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_KEY });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => accountsService.deleteAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_KEY });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}
