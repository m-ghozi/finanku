import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Badge } from '@/src/components/ui/badge';
import { parseTransactionInput, ParsedTransactionDraft } from '@/src/lib/parser';
import { formatCurrency } from '@/src/lib/utils';
import { useAccounts } from '@/src/hooks/useAccounts';
import { useCategories } from '@/src/hooks/useCategories';
import { useCreateTransaction } from '@/src/hooks/useTransactions';
import { Zap, CheckCircle2, AlertCircle } from 'lucide-react';

interface QuickTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const QuickTransactionModal: React.FC<QuickTransactionModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState('');

  const { data: accounts } = useAccounts();
  const { data: categories } = useCategories();
  const createMutation = useCreateTransaction();

  const parsedDraft: ParsedTransactionDraft | null = useMemo(() => {
    return parseTransactionInput(inputText);
  }, [inputText]);

  // Set default account when accounts loaded
  React.useEffect(() => {
    if (accounts && accounts.length > 0 && !selectedAccountId) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts, selectedAccountId]);

  // Match suggested category ID
  const matchedCategoryId = useMemo(() => {
    if (!parsedDraft?.suggestedCategory || !categories) return undefined;
    const cat = categories.find((c) =>
      c.name.toLowerCase().includes(parsedDraft.suggestedCategory!.toLowerCase())
    );
    return cat?.id;
  }, [parsedDraft, categories]);

  const handleConfirm = async () => {
    if (!parsedDraft || parsedDraft.amount <= 0 || !selectedAccountId) return;

    try {
      await createMutation.mutateAsync({
        type: parsedDraft.type,
        amount: parsedDraft.amount,
        date: new Date().toISOString().slice(0, 10),
        accountId: selectedAccountId,
        categoryId: matchedCategoryId,
        description: parsedDraft.description,
        notes: `Input cepat: "${parsedDraft.rawInput}"`,
      });
      setInputText('');
      onOpenChange(false);
    } catch {
      // handled
    }
  };

  const samplePresets = [
    'makan siang 35000',
    'kopi starbucks 55k',
    'bensin pertamax 50rb',
    'gaji bulanan 7.5jt',
    'belanja supermarket 120000',
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
            <Zap className="h-4 w-4 fill-amber-500" />
          </div>
          <DialogTitle>Quick Input Transaksi</DialogTitle>
        </div>
        <DialogDescription>
          Ketik transaksi dalam satu kalimat sederhana (misal: <em>"makan siang 35000"</em>).
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        {/* Text Input */}
        <div>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Input Kalimat Transaksi
          </label>
          <Input
            autoFocus
            placeholder="Ketik contoh: makan siang 35000"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>

        {/* Quick Suggestion Presets */}
        <div>
          <p className="text-[11px] text-zinc-400 mb-1.5">Contoh cepat (klik untuk coba):</p>
          <div className="flex flex-wrap gap-1.5">
            {samplePresets.map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => setInputText(sample)}
                className="px-2 py-1 text-[11px] rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition cursor-pointer"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* Draft Confirmation Preview Box */}
        {inputText.trim() && parsedDraft ? (
          <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Konfirmasi Pratinjau
              </span>
              <Badge
                variant={
                  parsedDraft.type === 'income'
                    ? 'success'
                    : parsedDraft.type === 'expense'
                    ? 'destructive'
                    : 'secondary'
                }
              >
                {parsedDraft.type === 'income'
                  ? 'Pemasukan'
                  : parsedDraft.type === 'expense'
                  ? 'Pengeluaran'
                  : 'Transfer'}
              </Badge>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {parsedDraft.description}
                </p>
                {parsedDraft.suggestedCategory && (
                  <p className="text-xs text-zinc-500">
                    Saran Kategori: {parsedDraft.suggestedCategory}
                  </p>
                )}
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-zinc-950 dark:text-zinc-50">
                  {formatCurrency(parsedDraft.amount)}
                </span>
              </div>
            </div>

            {/* Target Account selector */}
            <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800">
              <label className="block text-[11px] font-medium text-zinc-500 mb-1">
                Gunakan Rekening:
              </label>
              <select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className="w-full h-8 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2 text-xs text-zinc-900 dark:text-zinc-100"
              >
                {accounts?.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} (Saldo: {formatCurrency(acc.currentBalance)})
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : inputText.trim() ? (
          <div className="flex items-center gap-2 p-3 text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Format tidak dikenali. Cantumkan nominal angka, misal: "kopi 25000"</span>
          </div>
        ) : null}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Batal
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={!parsedDraft || parsedDraft.amount <= 0 || !selectedAccountId}
          isLoading={createMutation.isPending}
          className="gap-1.5"
        >
          <CheckCircle2 className="h-4 w-4" />
          Konfirmasi & Simpan
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
