// utils/projectUtils.ts

import { ProjectStatus } from '@/types/models';

export const getStatusConfig = (status: ProjectStatus) => {
  const configs = {
    submitted: {
      label: 'Soumis',
      className: 'bg-blue-100 text-blue-700 border-blue-200',
      dotColor: 'bg-blue-500'
    },
    processing: {
      label: 'En traitement',
      className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      dotColor: 'bg-yellow-500'
    },
    approved: {
      label: 'Approuvé',
      className: 'bg-green-100 text-green-700 border-green-200',
      dotColor: 'bg-green-500'
    },
    rejected: {
      label: 'Rejeté',
      className: 'bg-red-100 text-red-700 border-red-200',
      dotColor: 'bg-red-500'
    },
    in_development: {
      label: 'En développement',
      className: 'bg-purple-100 text-purple-700 border-purple-200',
      dotColor: 'bg-purple-500'
    },
    in_testing: {
      label: 'En test',
      className: 'bg-orange-100 text-orange-700 border-orange-200',
      dotColor: 'bg-orange-500'
    },
    completed: {
      label: 'Terminé',
      className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      dotColor: 'bg-emerald-500'
    },
    achieved: {
      label: 'Livré',
      className: 'bg-gray-100 text-gray-700 border-gray-200',
      dotColor: 'bg-gray-500'
    }
  };

  return configs[status] || configs.submitted;
};

export const getClientInitials = (firstName: string, lastName: string): string => {
  const first = firstName?.charAt(0) || '';
  const last = lastName?.charAt(0) || '';
  return (first + last).toUpperCase();
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
};

export const getStatusOptions = () => [
  { value: '', label: 'Tous les statuts' },
  { value: 'submitted', label: 'Soumis' },
  { value: 'processing', label: 'En traitement' },
  { value: 'approved', label: 'Approuvé' },
  { value: 'rejected', label: 'Rejeté' },
  { value: 'in_development', label: 'En développement' },
  { value: 'in_testing', label: 'En test' },
  { value: 'completed', label: 'Terminé' },
  { value: 'achieved', label: 'Livré' }
];