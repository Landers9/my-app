/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
// hooks/useProjects.ts

import { useState, useEffect } from 'react';
import { Project, ProjectFilters } from '@/types/models';
import { ProjectService } from '@/services/projectService';
import { useAuthContext } from '@/contexts/AuthContext';

interface UseProjectsReturn {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  totalProjects: number;
  refetch: () => Promise<void>;
  updateFilters: (filters: ProjectFilters) => void;
  deleteProject: (projectId: string) => Promise<boolean>;
}

export const useProjects = (initialFilters?: ProjectFilters): UseProjectsReturn => {
  const { currentCompany } = useAuthContext();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProjects, setTotalProjects] = useState(0);
  const [filters, setFilters] = useState<ProjectFilters>(initialFilters || {});

  const fetchProjects = async () => {
    if (!currentCompany?.id) {
      setError('Aucune entreprise sélectionnée');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await ProjectService.getCompanyProjects(currentCompany.id, filters);

      setProjects(response.data);
      setTotalProjects(response.count);
    } catch (err: any) {
      setError(err?.message || 'Erreur lors du chargement des projets');
      setProjects([]);
      setTotalProjects(0);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFilters = (newFilters: ProjectFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const deleteProject = async (projectId: string): Promise<boolean> => {
    try {
      await ProjectService.deleteProject(projectId);
      // Supprimer le projet de la liste locale
      setProjects(prev => prev.filter(p => p.id !== projectId));
      setTotalProjects(prev => prev - 1);
      return true;
    } catch (err: any) {
      setError(err?.message || 'Erreur lors de la suppression du projet');
      return false;
    }
  };

  // Recharger les projets quand les filtres changent ou la compagnie change
  useEffect(() => {
    fetchProjects();
  }, [currentCompany?.id, filters]);

  return {
    projects,
    isLoading,
    error,
    totalProjects,
    refetch: fetchProjects,
    updateFilters,
    deleteProject
  };
};