// services/formFieldService.ts

import { ApiResponse, FormField } from '@/types/models';
import { apiService } from './api';

export class FormFieldService {
  /**
   * Récupère les champs de formulaire pour un service de company
   */
  static async getCompanyServiceFormFields(companyServiceId: string): Promise<FormField[]> {
    const response = await apiService.get<ApiResponse<FormField[]>>(`/advanced/form-fields/company-service/${companyServiceId}`);

    // Trier par step puis par position
    const fields = response.data || [];
    fields.sort((a, b) => {
      if (a.step !== b.step) {
        return a.step - b.step;
      }
      return a.position - b.position;
    });

    return fields;
  }
}