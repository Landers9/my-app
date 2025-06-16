// services/formFieldService.ts

import { ServiceFormFieldsResponse } from '@/types/models';
import { apiService } from './api';

export class FormFieldService {
  /**
   * Récupère les champs de formulaire pour un service
   */
  static async getServiceFormFields(serviceId: number): Promise<ServiceFormFieldsResponse> {
    const response = await apiService.get<ServiceFormFieldsResponse>(`/form-fields/service/${serviceId}`);

    // Trier par step puis par position
    response.form_fields = response.form_fields.sort((a, b) => {
      if (a.step !== b.step) {
        return a.step - b.step;
      }
      return a.position - b.position;
    });

    return response;
  }
}