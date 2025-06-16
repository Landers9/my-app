// config/env.ts

export const config = {
  // URLs de l'API
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',

  // Configuration par défaut
  DEFAULT_CATEGORY_ID: 1,

  // Images par défaut
  DEFAULT_COVER_IMAGE: '/images/welcome.jpg',

  // Timeouts et retries
  API_TIMEOUT: 10000, // 10 secondes
  MAX_RETRIES: 3,

  // Pagination
  DEFAULT_PAGE_SIZE: 10,

  // Validation
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as readonly string[],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'] as readonly string[],
  ALLOWED_AUDIO_TYPES: ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/webm'] as readonly string[],
} as const;

// Fonction pour valider la configuration
export const validateConfig = (): boolean => {
  const requiredEnvVars = [
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_BACKEND_URL'
  ];

  const missing = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    console.warn('Variables d\'environnement manquantes:', missing);
    console.warn('Utilisation des valeurs par défaut...');
  }

  return missing.length === 0;
};

// Types pour TypeScript
export type Config = typeof config;