// hooks/useProject.ts

import { useState } from 'react';
import { ApiError, ProjectRequest, ProjectResponse } from '@/types/models';
import { ProjectService } from '@/services/ProjectAsGuestService';

interface UseProjectReturn {
  createProject: (projectData: ProjectRequest) => Promise<ProjectResponse>;
  isSubmitting: boolean;
  error: ApiError | null;
}

/**
 * Hook pour créer des projets
 */
export const useProject = (): UseProjectReturn => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const createProject = async (projectData: ProjectRequest): Promise<ProjectResponse> => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await ProjectService.createGuestProject(projectData);
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
    createProject,
    isSubmitting,
    error,
  };
};