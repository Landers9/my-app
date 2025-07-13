// utils/projectUtils.ts

import { ProjectStatus, ProjectField } from '@/types/models';

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

// Nouvelles fonctions pour les champs du projet

export const getFieldTypeIcon = (fieldType: string) => {
  const iconMap: Record<string, { icon: string, color: string }> = {
    text: { icon: '📝', color: 'from-blue-400 to-cyan-500' },
    textarea: { icon: '📄', color: 'from-green-400 to-emerald-500' },
    email: { icon: '📧', color: 'from-purple-400 to-violet-500' },
    phone: { icon: '📞', color: 'from-orange-400 to-red-500' },
    number: { icon: '🔢', color: 'from-indigo-400 to-purple-500' },
    date: { icon: '📅', color: 'from-pink-400 to-rose-500' },
    time: { icon: '🕐', color: 'from-cyan-400 to-blue-500' },
    url: { icon: '🔗', color: 'from-teal-400 to-green-500' },
    file: { icon: '📎', color: 'from-gray-400 to-slate-500' },
    image: { icon: '🖼️', color: 'from-emerald-400 to-teal-500' },
    select: { icon: '📋', color: 'from-violet-400 to-purple-500' },
    radio: { icon: '🔘', color: 'from-rose-400 to-pink-500' },
    checkbox: { icon: '☑️', color: 'from-amber-400 to-yellow-500' },
    password: { icon: '🔒', color: 'from-red-400 to-pink-500' }
  };

  return iconMap[fieldType] || iconMap.text;
};

export const formatFieldValue = (field: ProjectField): string => {
  if (!field.value && field.files.length === 0) {
    return 'Non renseigné';
  }

  switch (field.field_type) {
    case 'email':
      return field.value;
    case 'phone':
      return field.value;
    case 'url':
      return field.value;
    case 'date':
      try {
        return new Date(field.value).toLocaleDateString('fr-FR');
      } catch {
        return field.value;
      }
    case 'time':
      return field.value;
    case 'number':
      return field.value;
    case 'file':
    case 'image':
      if (field.files.length > 0) {
        return `${field.files.length} fichier${field.files.length > 1 ? 's' : ''} joint${field.files.length > 1 ? 's' : ''}`;
      }
      return field.value || 'Aucun fichier';
    case 'textarea':
      return field.value.length > 100
        ? field.value.substring(0, 100) + '...'
        : field.value;
    case 'select':
    case 'radio':
      return field.value;
    case 'checkbox':
      try {
        const values = JSON.parse(field.value);
        return Array.isArray(values) ? values.join(', ') : field.value;
      } catch {
        return field.value;
      }
    default:
      return field.value;
  }
};

export const groupFieldsByStep = (fields: ProjectField[]): Record<number, ProjectField[]> => {
  return fields.reduce((groups, field) => {
    const step = field.step;
    if (!groups[step]) {
      groups[step] = [];
    }
    groups[step].push(field);
    return groups;
  }, {} as Record<number, ProjectField[]>);
};

export const sortFieldsByPosition = (fields: ProjectField[]): ProjectField[] => {
  return [...fields].sort((a, b) => a.position - b.position);
};