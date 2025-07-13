/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useProjects.ts

import { useState, useEffect } from 'react';
import { Project, ProjectFilters, ProjectRequest, ProjectResponse, ApiError } from '@/types/models';
import { ProjectService } from '@/services/projectService';
import { useAuthContext } from '@/contexts/AuthContext';

interface UseProjectsReturn {
  // Récupération des projets
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  totalProjects: number;
  refetch: () => Promise<void>;
  updateFilters: (filters: ProjectFilters) => void;
  deleteProject: (projectId: string) => Promise<boolean>;

  // Création de projets
  createProject: (projectData: ProjectRequest) => Promise<ProjectResponse>;
  isSubmitting: boolean;
  createError: ApiError | null;
}

export const useProjects = (initialFilters?: ProjectFilters): UseProjectsReturn => {
  const { currentCompany } = useAuthContext();

  // États pour la récupération des projets
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProjects, setTotalProjects] = useState(0);
  const [filters, setFilters] = useState<ProjectFilters>(initialFilters || {});

  // États pour la création de projets
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createError, setCreateError] = useState<ApiError | null>(null);

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

  const createProject = async (projectData: ProjectRequest): Promise<ProjectResponse> => {
    try {
      setIsSubmitting(true);
      setCreateError(null);

      const response = await ProjectService.createGuestProject(projectData);

      // Optionnel : rafraîchir la liste des projets après création
      // await fetchProjects();

      return response;
    } catch (err) {
      const apiError = err as ApiError;
      setCreateError(apiError);
      throw apiError;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Recharger les projets quand les filtres changent ou la compagnie change
  useEffect(() => {
    fetchProjects();
  }, [currentCompany?.id, filters]);

  return {
    // Récupération des projets
    projects,
    isLoading,
    error,
    totalProjects,
    refetch: fetchProjects,
    updateFilters,
    deleteProject,

    // Création de projets
    createProject,
    isSubmitting,
    createError
  };
};