// services/projectService.ts

import { ApiResponse, ProjectRequest, ProjectResponse } from '@/types/models';
import { apiService } from './api';

export class ProjectService {
  /**
   * Crée un nouveau projet en tant qu'invité
   */
  static async createGuestProject(projectData: ProjectRequest): Promise<ProjectResponse> {
    // Vérifier si nous avons des fichiers
    const hasFiles = projectData.fields.some(field =>
      field.file && (field.file instanceof File || field.file instanceof Blob)
    );

    if (hasFiles) {
      // Utiliser FormData pour les fichiers
      const formData = new FormData();
      formData.append('company_service_id', projectData.company_service_id);

      projectData.fields.forEach((field, index) => {
        formData.append(`fields[${index}][field_id]`, field.field_id);
        formData.append(`fields[${index}][value]`, field.value);

        if (field.file && (field.file instanceof File || field.file instanceof Blob)) {
          formData.append(`fields[${index}][file][]`, field.file);
        }
      });

      const response = await apiService.postFormData<ApiResponse<ProjectResponse>>('/advanced/projects/guest-create', formData);
      return response.data;
    } else {
      // Utiliser JSON pour les données textuelles
      const response = await apiService.post<ApiResponse<ProjectResponse>>('/advanced/projects/guest-create', projectData);
      return response.data;
    }
  }
}