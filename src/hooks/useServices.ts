// hooks/useServices.ts

import { useState, useEffect } from 'react';
import { Service, ApiError } from '@/types/models';
import { ServiceService } from '@/services/serviceService';

interface UseServicesByCategoryReturn {
  services: Service[];
  isLoading: boolean;
  error: ApiError | null;
}

/**
 * Hook pour récupérer les services d'une catégorie
 */
export const useServicesByCategory = (categoryId: number): UseServicesByCategoryReturn => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      if (!categoryId) return;

      try {
        setIsLoading(true);
        setError(null);

        const servicesData = await ServiceService.getServicesByCategory(categoryId);
        setServices(servicesData);
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [categoryId]);

  return {
    services,
    isLoading,
    error,
  };
};