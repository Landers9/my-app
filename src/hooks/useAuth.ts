/* eslint-disable react-hooks/exhaustive-deps */
// hooks/useAuth.ts - Mise à jour

import { useState, useEffect } from 'react';
import { User, LoginRequest, ApiError, UserCompany } from '@/types/models';
import { AuthService } from '@/services/authService';

interface UseAuthReturn {
  user: User | null;
  currentCompany: UserCompany | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isCurrentCompanyAdmin: boolean;
  currentCompanyRole: string;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  setCurrentCompany: (company: UserCompany) => void;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [currentCompany, setCurrentCompanyState] = useState<UserCompany | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Calcul des propriétés dérivées
  const isCurrentCompanyAdmin = currentCompany?.role === 'admin' || currentCompany?.role === 'owner';
  const currentCompanyRole = currentCompany?.role || 'member';

  // Fonction pour rafraîchir les données utilisateur
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const refreshUser = async (): Promise<void> => {
    if (isRefreshing) return; // Éviter les appels multiples

    try {
      setIsRefreshing(true);
      if (AuthService.isAuthenticated()) {
        const userData = await AuthService.getCurrentUser();
        setUser(userData);
        setCurrentCompanyState(AuthService.getCurrentCompany());
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('Erreur lors du rafraîchissement utilisateur:', err);
      // ... reste du code
    } finally {
      setIsRefreshing(false);
    }
  };

  // Vérification initiale
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = AuthService.getStoredUser();
        const currentCompany = AuthService.getCurrentCompany();

        if (AuthService.isAuthenticated() && storedUser) {
          // Utiliser les données stockées immédiatement
          setUser(storedUser);
          setCurrentCompanyState(currentCompany);
          setIsAuthenticated(true);

          // Puis rafraîchir en arrière-plan sans bloquer l'UI
          refreshUser().catch(() => {
            // En cas d'erreur, garder les données stockées
          });
        } else {
          setUser(null);
          setCurrentCompanyState(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Erreur lors de la vérification auth:', err);
        setUser(null);
        setCurrentCompanyState(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []); // Uniquement au montage

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setError(null);
      setIsLoading(true);

      const userData = await AuthService.login(credentials);

      setUser(userData);
      setCurrentCompanyState(AuthService.getCurrentCompany());
      setIsAuthenticated(true);
    } catch (err) {
      const apiError = err as ApiError;

      if (apiError.status === 401) {
        setError('Email ou mot de passe incorrect.');
      } else if (apiError.status === 422) {
        setError('Données de connexion invalides.');
      } else {
        setError('Erreur de connexion. Vérifiez votre connexion internet.');
      }

      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AuthService.logout();
    } finally {
      setUser(null);
      setCurrentCompanyState(null);
      setIsAuthenticated(false);
    }
  };

  const setCurrentCompany = (company: UserCompany): void => {
    AuthService.setCurrentCompany(company);
    setCurrentCompanyState(company);
  };

  const clearError = (): void => {
    setError(null);
  };

  return {
    user,
    currentCompany,
    isAuthenticated,
    isLoading,
    error,
    isCurrentCompanyAdmin,
    currentCompanyRole,
    login,
    logout,
    setCurrentCompany,
    clearError,
    refreshUser,
  };
};