
// services/clientService.ts

import { ClientsListResponse, ClientDetailResponse } from '@/types/models';
import { apiService } from './api';

export class ClientService {
  /**
   * Récupère la liste des clients d'une entreprise
   */
  static async getCompanyClients(companyId: string): Promise<ClientsListResponse> {
    return await apiService.get<ClientsListResponse>(`/advanced/users/company/${companyId}`);
  }

  /**
   * Récupère les détails d'un client spécifique
   */
  static async getClientDetails(clientId: string): Promise<ClientDetailResponse> {
    return await apiService.get<ClientDetailResponse>(`/users/${clientId}`);
  }
}