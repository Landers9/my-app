// services/orderService.ts

import { OrderRequest, OrderResponse } from '@/types/models';
import { apiService } from './api';

export class OrderService {
  /**
   * Crée une nouvelle commande
   */
  static async createGuestOrder(orderData: OrderRequest): Promise<OrderResponse> {
    // Vérifier si nous avons des fichiers
    const hasFiles = orderData.fields.some(field =>
      field.file && (field.file instanceof File || field.file instanceof Blob)
    );

    if (hasFiles) {
      // Utiliser FormData pour les fichiers
      const formData = new FormData();
      formData.append('service_id', orderData.service_id.toString());

      orderData.fields.forEach((field, index) => {
        formData.append(`fields[${index}][field_id]`, field.field_id.toString());
        formData.append(`fields[${index}][value]`, field.value);

        if (field.file && (field.file instanceof File || field.file instanceof Blob)) {
          formData.append(`fields[${index}][file][]`, field.file);
        }
      });

      return await apiService.postFormData<OrderResponse>('/orders', formData);
    } else {
      // Utiliser JSON pour les données textuelles
      return await apiService.post<OrderResponse>('/orders', orderData);
    }
  }
}