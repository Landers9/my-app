// types/models.ts

// ======= MODELS DE BASE =======

export interface Category {
  id: number;
  name: string;
  description: string;
  cover_image: string | null;
  slogan: string | null;
  created_at: string;
  updated_at: string;
  services?: Service[];
}

export interface Service {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  price: number | null;
  is_active: number; // 0 ou 1
  created_at: string;
  updated_at: string;
}

export interface FormField {
  id: number;
  label: string;
  name: string;
  type: FormFieldType;
  options: string[] | null;
  is_required: boolean;
  position: number;
  step: number;
  created_at: string;
  updated_at: string;
  pivot?: {
    service_id: number;
    field_id: number;
  };
}

// ======= TYPES =======

export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'email'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'files_document'
  | 'files_image'
  | 'files_audio';

// ======= RESPONSES API =======

export interface ServiceFormFieldsResponse {
  service_name: string;
  form_fields: FormField[];
}

export interface OrderField {
  value: string;
  file: string | File | Blob;
  field_id: number;
}

export interface OrderRequest {
  service_id: number;
  fields: OrderField[];
}

export interface OrderResponse {
  id?: number;
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

export type FormData = {
  [key: string]: string | string[] | File[] | Blob | null;
};