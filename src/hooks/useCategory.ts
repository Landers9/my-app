// hooks/useCategory.ts

import { useState, useEffect } from 'react';
import { Category, ApiError } from '@/types/models';
import { CategoryService } from '@/services/categoryService';

interface UseCategoryReturn {
  category: Category | null;
  isLoading: boolean;
  error: ApiError | null;
}

/**
 * Hook pour récupérer une catégorie par son ID
 */
export const useCategory = (id: number): UseCategoryReturn => {
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);

        const categoryData = await CategoryService.getCategoryById(id);
        setCategory(categoryData);
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  return {
    category,
    isLoading,
    error,
  };
};