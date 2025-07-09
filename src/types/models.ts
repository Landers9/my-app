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
  form_field_enumeration: {
    id: string;
    name: string;
    description: string;
    type: string;
  };
}

// ======= REQUESTS =======

export interface ProjectField {
  value: string;
  file: string | File | Blob;
  field_id: string;
}

export interface ProjectRequest {
  company_service_id: string;
  fields: ProjectField[];
}

export interface ProjectResponse {
  id?: string;
  reference?: string;
  status?: string;
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