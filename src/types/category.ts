export type CategoryType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  parentId?: string | null;
  icon?: string;
  color?: string;
  isArchived: boolean;
  order?: number;
  subcategories?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDTO {
  name: string;
  type: CategoryType;
  parentId?: string | null;
  icon?: string;
  color?: string;
}

export interface UpdateCategoryDTO extends Partial<CreateCategoryDTO> {
  isArchived?: boolean;
}
