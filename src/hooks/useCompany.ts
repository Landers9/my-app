// hooks/useCompany.ts

import { useState, useEffect } from 'react';
import { Company, Service, ApiError } from '@/types/models';
import { CompanyService } from '@/services/companyService';

interface UseCompanyReturn {
  company: Company | null;
  services: Service[];
  isLoading: boolean;
  error: ApiError | null;
}

/**
 * Hook pour récupérer une company et ses services
 */
export const useCompany = (id: string): UseCompanyReturn => {
  const [company, setCompany] = useState<Company | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);

        // Récupérer la company et ses services en parallèle
        const [companyData, servicesData] = await Promise.all([
          CompanyService.getCompanyById(id),
          CompanyService.getCompanyServices(id)
        ]);

        setCompany(companyData);
        setServices(servicesData || []);
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError);
        setServices([]); // S'assurer que services reste un tableau
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return {
    company,
    services,
    isLoading,
    error,
  };
};