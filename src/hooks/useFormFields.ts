// hooks/useFormFields.ts

import { useState, useEffect } from 'react';
import { FormField, ApiError } from '@/types/models';
import { FormFieldService } from '@/services/formFieldService';

interface UseServiceFormFieldsReturn {
  serviceName: string;
  formFields: FormField[];
  isLoading: boolean;
  error: ApiError | null;
  getFieldsByStep: (step: number) => FormField[];
}

/**
 * Hook pour récupérer les champs de formulaire d'un service
 */
export const useServiceFormFields = (serviceId: number): UseServiceFormFieldsReturn => {
  const [serviceName, setServiceName] = useState<string>('');
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const getFieldsByStep = (step: number): FormField[] => {
    return formFields.filter(field => field.step === step);
  };

  useEffect(() => {
    const fetchFormFields = async () => {
      if (!serviceId) {
        setFormFields([]);
        setServiceName('');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await FormFieldService.getServiceFormFields(serviceId);
        setServiceName(response.service_name);
        setFormFields(response.form_fields);
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFormFields();
  }, [serviceId]);

  return {
    serviceName,
    formFields,
    isLoading,
    error,
    getFieldsByStep,
  };
};