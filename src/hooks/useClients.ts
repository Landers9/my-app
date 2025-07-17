/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
// hooks/useClients.ts

import { useState, useEffect } from 'react';
import { ClientService } from '@/services/clientService';
import { useAuthContext } from '@/contexts/AuthContext';
import { ClientListItem } from '@/types/models';

interface UseClientsReturn {
  clients: ClientListItem[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useClients = (): UseClientsReturn => {
  const { currentCompany } = useAuthContext();

  const [clients, setClients] = useState<ClientListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    if (!currentCompany?.id) {
      setError('Aucune entreprise sélectionnée');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await ClientService.getCompanyClients(currentCompany.id);

      if (response.success) {
        setClients(response.data);
      } else {
        setError('Erreur lors du chargement des clients');
        setClients([]);
      }
    } catch (err: any) {
      setError(err?.message || 'Erreur lors du chargement des clients');
      setClients([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [currentCompany?.id]);

  return {
    clients,
    isLoading,
    error,
    refetch: fetchClients
  };
};