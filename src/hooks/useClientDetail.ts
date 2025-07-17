/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useClientDetail.ts

import { useState, useEffect } from 'react';
import { ClientDetail, Project } from '@/types/models';
import { ClientService } from '@/services/clientService';

interface UseClientDetailReturn {
  client: ClientDetail | null;
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useClientDetail = (clientId: string): UseClientDetailReturn => {
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClientDetail = async () => {
    if (!clientId) {
      setError('ID du client manquant');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await ClientService.getClientDetails(clientId);

      if (response.success) {
        setClient(response.data);
        setProjects(response.data.projects || []);
      } else {
        setError('Erreur lors du chargement des détails du client');
        setClient(null);
        setProjects([]);
      }
    } catch (err: any) {
      setError(err?.message || 'Erreur lors du chargement des détails du client');
      setClient(null);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClientDetail();
  }, [clientId]);

  return {
    client,
    projects,
    isLoading,
    error,
    refetch: fetchClientDetail
  };
};