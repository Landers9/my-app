// services/categoryService.ts

import { Category } from '@/types/models';
import { apiService } from './api';

export class CategoryService {
  /**
   * Récupère une catégorie par son ID avec ses services
   */
  static async getCategoryById(id: number): Promise<Category> {
    return await apiService.get<Category>(`/categories/${id}`);
  }

  /**
   * Construit l'URL complète pour l'image de couverture
   */
  static getCoverImageUrl(coverImage: string | null): string {
    if (!coverImage) {
      return '/images/welcome.jpg'; // Image par défaut
    }

    if (coverImage.startsWith('http')) {
      return coverImage;
    }

    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    return `${baseUrl}/storage/images/${coverImage}`;
  }
}