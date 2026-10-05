import { mockStore } from './storage';
import { Category, CreateCategoryDTO, UpdateCategoryDTO, CategoryType } from '@/src/types/category';

export const mockCategoriesApi = {
  async getCategories(type?: CategoryType): Promise<Category[]> {
    await new Promise((r) => setTimeout(r, 200));
    const all = mockStore.getCategories();
    if (type) {
      return all.filter((c) => c.type === type && !c.isArchived);
    }
    return all.filter((c) => !c.isArchived);
  },

  async createCategory(dto: CreateCategoryDTO): Promise<Category> {
    await new Promise((r) => setTimeout(r, 250));
    const categories = mockStore.getCategories();

    const newCategory: Category = {
      id: `cat_${Date.now()}`,
      name: dto.name,
      type: dto.type,
      parentId: dto.parentId || null,
      icon: dto.icon || 'tag',
      color: dto.color || '#059669',
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (dto.parentId) {
      // Add as subcategory to parent
      const parent = categories.find((c) => c.id === dto.parentId);
      if (parent) {
        if (!parent.subcategories) parent.subcategories = [];
        parent.subcategories.push(newCategory);
      }
    } else {
      categories.push(newCategory);
    }

    mockStore.setCategories([...categories]);
    return newCategory;
  },

  async updateCategory(id: string, dto: UpdateCategoryDTO): Promise<Category> {
    await new Promise((r) => setTimeout(r, 200));
    const categories = mockStore.getCategories();

    let updatedCat: Category | null = null;
    const recursiveUpdate = (list: Category[]): boolean => {
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === id) {
          list[i] = { ...list[i], ...dto, updatedAt: new Date().toISOString() };
          updatedCat = list[i];
          return true;
        }
        if (list[i].subcategories && recursiveUpdate(list[i].subcategories!)) {
          return true;
        }
      }
      return false;
    };

    recursiveUpdate(categories);
    if (!updatedCat) throw new Error('Kategori tidak ditemukan');

    mockStore.setCategories([...categories]);
    return updatedCat;
  },

  async deleteCategory(id: string): Promise<{ success: boolean }> {
    await new Promise((r) => setTimeout(r, 200));
    let categories = mockStore.getCategories();
    categories = categories.filter((c) => c.id !== id);
    // Also remove from subcategories
    categories.forEach((c) => {
      if (c.subcategories) {
        c.subcategories = c.subcategories.filter((sub) => sub.id !== id);
      }
    });
    mockStore.setCategories(categories);
    return { success: true };
  },
};
