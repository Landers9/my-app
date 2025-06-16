// hooks/useOrder.ts

import { useState } from 'react';
import { ApiError, OrderRequest, OrderResponse } from '@/types/models';
import { OrderService } from '@/services/orderService';

interface UseOrderReturn {
  createOrder: (orderData: OrderRequest) => Promise<OrderResponse>;
  isSubmitting: boolean;
  error: ApiError | null;
}

/**
 * Hook pour créer des commandes
 */
export const useOrder = (): UseOrderReturn => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const createOrder = async (orderData: OrderRequest): Promise<OrderResponse> => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await OrderService.createGuestOrder(orderData);
      return response;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      throw apiError;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createOrder,
    isSubmitting,
    error,
  };
};