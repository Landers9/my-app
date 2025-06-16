// services/serviceService.ts

import { Service } from '@/types/models';
import { apiService } from './api';

export class ServiceService {
  /**
   * Récupère les services d'une catégorie
   */
  static async getServicesByCategory(categoryId: number): Promise<Service[]> {
    return await apiService.get<Service[]>(`/services/category/${categoryId}`);
  }

  /**
   * Vérifie si un service est actif
   */
  static isServiceActive(service: Service): boolean {
    return service.is_active === 1;
  }

  /**
   * Formate le prix d'un service
   */
  static formatPrice(price: number | null): string {
    if (price === null || price === 0) {
      return 'Sur devis';
    }

    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  }
}