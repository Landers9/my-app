// services/companyService.ts

import { Company, Service, ApiResponse } from '@/types/models';
import { apiService } from './api';

export class CompanyService {
  /**
   * Récupère une company par son ID
   */
  static async getCompanyById(id: string): Promise<Company> {
    const response = await apiService.get<ApiResponse<Company>>(`/advanced/companies/${id}`);
    return response.data;
  }

  /**
   * Récupère les services d'une company
   */
  static async getCompanyServices(companyId: string): Promise<Service[]> {
    const response = await apiService.get<ApiResponse<Service[]>>(`/advanced/company-services/company/${companyId}`);
    return response.data;
  }

  /**
   * Vérifie si un service est actif
   */
  static isServiceActive(service: Service): boolean {
    return service.is_active === true;
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