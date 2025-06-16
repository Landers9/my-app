// utils/index.ts

import { config } from '@/config/env';

/**
 * Formate une date en français
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Formate une date relative (il y a X jours)
 */
export const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return 'il y a 1 jour';
  } else if (diffDays < 7) {
    return `il y a ${diffDays} jours`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `il y a ${months} mois`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `il y a ${years} an${years > 1 ? 's' : ''}`;
  }
};

/**
 * Tronque un texte à une longueur donnée
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength).trim() + '...';
};

/**
 * Génère un slug à partir d'un titre
 */
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z0-9\s-]/g, '') // Supprime les caractères spéciaux
    .replace(/\s+/g, '-') // Remplace les espaces par des tirets
    .replace(/-+/g, '-') // Supprime les tirets multiples
    .trim();
};

/**
 * Valide une adresse email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valide un numéro de téléphone français
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
  return phoneRegex.test(phone);
};

/**
 * Formate la taille d'un fichier
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Vérifie si un fichier est une image
 */
export const isImageFile = (file: File): boolean => {
  return config.ALLOWED_IMAGE_TYPES.includes(file.type);
};

/**
 * Vérifie si un fichier est un document
 */
export const isDocumentFile = (file: File): boolean => {
  return config.ALLOWED_DOCUMENT_TYPES.includes(file.type);
};

/**
 * Vérifie si un fichier est un audio
 */
export const isAudioFile = (file: File): boolean => {
  return config.ALLOWED_AUDIO_TYPES.includes(file.type);
};

/**
 * Vérifie la taille d'un fichier
 */
export const isValidFileSize = (file: File): boolean => {
  return file.size <= config.MAX_FILE_SIZE;
};

/**
 * Débounce une fonction
 */
export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): T => {
  let timeout: NodeJS.Timeout;

  return ((...args: unknown[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
};

/**
 * Gère les erreurs de façon uniforme
 */
export const handleError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message: unknown }).message);
  }

  return 'Une erreur inattendue s\'est produite';
};

/**
 * Construit une URL complète pour les assets
 */
export const buildAssetUrl = (path: string): string => {
  if (!path) return config.DEFAULT_COVER_IMAGE;

  if (path.startsWith('http')) {
    return path;
  }

  return `${config.BACKEND_URL}/storage/${path}`;
};

/**
 * Classe utilitaire pour les classes CSS conditionnelles
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};