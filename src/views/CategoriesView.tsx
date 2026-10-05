import React, { useState } from 'react';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/src/hooks/useCategories';
import { Category, CategoryType, CreateCategoryDTO } from '@/src/types/category';
import { PageHeader } from '@/src/components/shared/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Badge } from '@/src/components/ui/badge';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/src/components/ui/dialog';
import { ConfirmDialog } from '@/src/components/shared/ConfirmDialog';
import { LoadingState } from '@/src/components/shared/LoadingState';
import { Plus, Edit2, Trash2, Tag, ChevronRight } from 'lucide-react';

export const CategoriesView: React.FC = () => {
  const [activeType, setActiveType] = useState<CategoryType>('expense');
  const { data: categories, isLoading } = useCategories(activeType);
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState<CategoryType>('expense');
  const [parentId, setParentId] = useState<string>('');
  const [color, setColor] = useState('#059669');

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setType(activeType);
    setParentId('');
    setColor(activeType === 'expense' ? '#f97316' : '#059669');
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setType(cat.type);
    setParentId(cat.parentId || '');
    setColor(cat.color || '#059669');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const dto: CreateCategoryDTO = {
      name,
      type,
      parentId: parentId || null,
      color,
    };

    if (editingCategory) {
      await updateMutation.mutateAsync({ id: editingCategory.id, dto });
    } else {
      await createMutation.mutateAsync(dto);
    }
    setModalOpen(false);
  };

  const colorPalette = [
    '#f97316', '#0284c7', '#eab308', '#8b5cf6', '#ec4899', '#10b981', '#059669', '#dc2626', '#64748b'
  ];

  if (isLoading) return <LoadingState rows={4} />;

  // Only top-level categories
  const parentCategories = categories?.filter((c) => !c.parentId) || [];

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Kategori Transaksi"
        description="Atur hierarki kategori pengeluaran dan pemasukan dengan rapi."
        action={
          <Button onClick={openCreateModal} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            <span>Tambah Kategori</span>
          </Button>
        }
      />

      {/* Type Filter Buttons */}
      <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveType('expense')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
            activeType === 'expense'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          Kategori Pengeluaran
        </button>
        <button
          onClick={() => setActiveType('income')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
            activeType === 'income'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          Kategori Pemasukan
        </button>
      </div>

      {/* Hierarchical Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {parentCategories.map((parent) => (
          <Card key={parent.id} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span
                  className="h-3.5 w-3.5 rounded-full"
                  style={{ backgroundColor: parent.color || '#059669' }}
                />
                <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                  {parent.name}
                </span>
                <Badge variant="outline" className="text-[10px]">
                  Induk
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(parent)}
                  className="p-1 rounded text-zinc-400 hover:text-zinc-700"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setDeleteTarget(parent)}
                  className="p-1 rounded text-zinc-400 hover:text-rose-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Subcategories Hierarchy */}
            <div className="pl-4 border-l-2 border-zinc-100 dark:border-zinc-800 space-y-2 mt-2">
              {parent.subcategories && parent.subcategories.length > 0 ? (
                parent.subcategories.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between text-xs py-1 px-2 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                  >
                    <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                      <ChevronRight className="h-3 w-3 text-zinc-400" />
                      {sub.name}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(sub)}
                        className="p-1 rounded text-zinc-400 hover:text-zinc-700"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(sub)}
                        className="p-1 rounded text-zinc-400 hover:text-rose-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[11px] text-zinc-400 italic py-1">Belum ada sub-kategori.</p>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Category Modal Form */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogHeader>
          <DialogTitle>
            {editingCategory ? 'Ubah Kategori' : 'Tambah Kategori'}
          </DialogTitle>
          <DialogDescription>
            Tentukan nama, jenis, dan apakah kategori ini memiliki kategori induk.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Nama Kategori *
            </label>
            <Input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Makan Siang, Belanja Bulanan"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Jenis Kategori
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as CategoryType)}
                className="w-full h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 text-xs"
              >
                <option value="expense">Pengeluaran</option>
                <option value="income">Pemasukan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Kategori Induk (Hierarki)
              </label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 text-xs"
              >
                <option value="">Tanpa Induk (Kategori Utama)</option>
                {parentCategories
                  .filter((p) => p.id !== editingCategory?.id)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Pilihan Warna
            </label>
            <div className="flex items-center gap-2">
              {colorPalette.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-6 w-6 rounded-full transition cursor-pointer ${
                    color === c ? 'ring-2 ring-zinc-900 dark:ring-white scale-110' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
              Simpan Kategori
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Hapus Kategori?"
        description={`Hapus kategori "${deleteTarget?.name}"? Transaksi yang sudah ada akan tetap tersimpan.`}
        confirmText="Hapus"
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteMutation.mutateAsync(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
};
