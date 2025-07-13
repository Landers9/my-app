// services/projectService.ts

import { ProjectsResponse, ProjectFilters, ApiResponse, ProjectRequest, ProjectResponse, ProjectDetailResponse } from '@/types/models';
import { apiService } from './api';

export class ProjectService {

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

  /**
   * Récupère les projets d'une compagnie
   */
  static async getCompanyProjects(
    companyId: string,
    filters?: ProjectFilters
  ): Promise<ProjectsResponse> {
    let url = `/advanced/projects/company/${companyId}`;

    // Ajouter les paramètres de filtrage si présents
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.per_page) params.append('per_page', filters.per_page.toString());

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return await apiService.get<ProjectsResponse>(url);
  }

  /**
   * Récupère un projet spécifique
   */
  static async getProject(projectId: string): Promise<ProjectDetailResponse> {
    return await apiService.get(`/projects/${projectId}`);
  }

  /**
   * Supprime un projet
   */
  static async deleteProject(projectId: string): Promise<void> {
    return await apiService.delete(`/projects/${projectId}`);
  }
}