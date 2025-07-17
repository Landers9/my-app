/* eslint-disable @typescript-eslint/no-explicit-any */
// types/models.ts

// ======= MODELS DE BASE =======

export interface Company {
  id: string; // UUID
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  slogan: string | null;
  cover_image: string | null;
  created_at: string;
}

export interface Service {
  id: string; // UUID
  name: string;
  description: string | null;
  price: number | null;
  is_active: boolean;
}

export interface FormField {
  id: string; // UUID
  label: string;
  name: string;
  options: any | null;
  is_required: boolean;
  position: number;
  step: number;
  can_edit?: boolean;
  form_field_enumeration: {
    id: string;
    name: string;
    description: string;
    type: string;
  };
}

// ======= AUTH MODELS =======

export interface User {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  telephone: string | null;
  _avatar: string | null;
  is_active: boolean;
  role?: string;
  has_super_admin_access: number;
  has_company: boolean;
  token: string;
  last_login_at: string | null;
  created_at: string;
  companies: UserCompany[];
}

export interface UserCompany {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  slogan: string | null;
  cover_image: string | null;
  created_at: string;
  role: string; // 'owner' | 'admin' | 'member'
  is_active: boolean;
}

// ======= PROFILE MODELS =======

export interface ProfileUpdateRequest {
  first_name: string;
  last_name: string;
  telephone: string;
  _avatar?: File | null;
}

export interface PasswordChangeRequest {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface ProfileFormData {
  first_name: string;
  last_name: string;
  telephone: string;
  _avatar?: File | null;
}

export interface PasswordFormData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

// ======= REQUESTS =======

// Type pour les champs lors de la création d'un projet
export interface ProjectFieldRequest {
  value: string;
  file: string | File | Blob;
  field_id: string;
}

export interface ProjectRequest {
  company_service_id: string;
  fields: ProjectFieldRequest[];
}

export interface ProjectResponse {
  id?: string;
  reference?: string;
  status?: string;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// ======= PROJECT MODELS =======

// Type pour les champs reçus dans les données du projet
export interface ProjectField {
  field_id: string;
  field_label: string;
  value: string;
  files: string[];
  is_required: boolean;
  step: number;
  position: number;
  options: any | null;
  field_type: string;
}

export interface Project {
  id: string;
  status: ProjectStatus;
  fields: ProjectField[];
  company_service: CompanyService;
  user: ProjectUser;
  invoice_file_path: string | null;
  final_price: number;
  reference: string;
  submitted_at: string | null;
  processing_at: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  in_development_at: string | null;
  in_testing_at: string | null;
  completed_at: string | null;
  achieved_at: string | null;
  created_at: string;
  created_at_humanized: string;
}

export interface CompanyService {
  id: string;
  name: string;
  description: string;
  price: number;
  is_active: boolean;
  company: ProjectCompany;
}

export interface ProjectCompany {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  slogan: string | null;
  cover_image: string | null;
  created_at: string;
}

export interface ProjectUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  telephone: string | null;
  avatar: string | null;
  is_active: boolean;
  role: string;
  created_at: string;
}

export type ProjectStatus =
  | 'submitted'
  | 'processing'
  | 'approved'
  | 'rejected'
  | 'in_development'
  | 'in_testing'
  | 'completed'
  | 'achieved';

export interface ProjectsResponse {
  success: boolean;
  count: number;
  data: Project[];
  message: string;
}

export interface ProjectDetailResponse {
  success: boolean;
  count: number;
  data: Project;
  message: string | null;
}

export interface ProjectFilters {
  status?: ProjectStatus;
  search?: string;
  page?: number;
  per_page?: number;
}

// ======= Models client =======

export interface ClientListItem {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  telephone: string | null;
  avatar: string;
  is_active: boolean;
  role: 'client' | 'admin';
  created_at: string;
}

export interface ClientDetail {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  telephone: string | null;
  avatar: string;
  projects: Project[]; // Utiliser le type Project si nécessaire
  is_active: boolean;
  role: 'client' | 'admin';
  has_super_admin_access: number;
  has_company: boolean;
  token: string | null;
  last_login_at: string | null;
  created_at: string;
}

export interface ClientsListResponse {
  count(count: any): unknown;
  success: boolean;
  data: ClientListItem[];
  message?: string;
}

export interface ClientDetailResponse {
  success: boolean;
  data: ClientDetail;
  message?: string;
}

// ======= UTILITAIRES =======

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export type FormData = {
  [key: string]: string | string[] | File[] | Blob | null;
};