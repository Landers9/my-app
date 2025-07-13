// hooks/useGuestProjects.ts

import { useState } from 'react';
import { ProjectRequest, ProjectResponse, ApiError } from '@/types/models';
import { ProjectService } from '@/services/projectService';

interface UseGuestProjectsReturn {
  createProject: (projectData: ProjectRequest) => Promise<ProjectResponse>;
  isSubmitting: boolean;
  createError: ApiError | null;
}

export const useGuestProjects = (): UseGuestProjectsReturn => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createError, setCreateError] = useState<ApiError | null>(null);

  const createProject = async (projectData: ProjectRequest): Promise<ProjectResponse> => {
    try {
      setIsSubmitting(true);
      setCreateError(null);

      const response = await ProjectService.createGuestProject(projectData);
      return response;
    } catch (err) {
      const apiError = err as ApiError;
      setCreateError(apiError);
      throw apiError;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createProject,
    isSubmitting,
    createError
  };
};