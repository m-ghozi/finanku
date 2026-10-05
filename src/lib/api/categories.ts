import { USE_MOCK_API, apiClient } from './client';
import { mockCategoriesApi } from '@/src/mocks/categories';
import { Category, CreateCategoryDTO, UpdateCategoryDTO, CategoryType } from '@/src/types/category';

export const categoriesService = {
  async getCategories(type?: CategoryType): Promise<Category[]> {
    if (USE_MOCK_API) {
      return mockCategoriesApi.getCategories(type);
    }
    const query = type ? `?type=${type}` : '';
    const res = await apiClient<{ data: Category[] }>(`/categories${query}`);
    return res.data;
  },

  async createCategory(dto: CreateCategoryDTO): Promise<Category> {
    if (USE_MOCK_API) {
      return mockCategoriesApi.createCategory(dto);
    }
    const res = await apiClient<{ data: Category }>('/categories', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    return res.data;
  },

  async updateCategory(id: string, dto: UpdateCategoryDTO): Promise<Category> {
    if (USE_MOCK_API) {
      return mockCategoriesApi.updateCategory(id, dto);
    }
    const res = await apiClient<{ data: Category }>(`/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    });
    return res.data;
  },

  async deleteCategory(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK_API) {
      return mockCategoriesApi.deleteCategory(id);
    }
    return apiClient<{ success: boolean }>(`/categories/${id}`, {
      method: 'DELETE',
    });
  },
};
