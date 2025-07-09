// hooks/useFormFields.ts

import { useState, useEffect } from 'react';
import { FormField, ApiError } from '@/types/models';
import { FormFieldService } from '@/services/formFieldService';

interface UseFormFieldsReturn {
  formFields: FormField[];
  isLoading: boolean;
  error: ApiError | null;
  getFieldsByStep: (step: number) => FormField[];
}

/**
 * Hook pour récupérer les champs de formulaire d'un service
 */
export const useFormFields = (companyServiceId: string): UseFormFieldsReturn => {
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const getFieldsByStep = (step: number): FormField[] => {
    return formFields.filter(field => field.step === step);
  };

  useEffect(() => {
    const fetchFormFields = async () => {
      if (!companyServiceId) {
        setFormFields([]);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const fieldsData = await FormFieldService.getCompanyServiceFormFields(companyServiceId);
        setFormFields(fieldsData);
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFormFields();
  }, [companyServiceId]);

  return {
    formFields,
    isLoading,
    error,
    getFieldsByStep,
  };
};