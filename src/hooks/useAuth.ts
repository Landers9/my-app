/* eslint-disable @typescript-eslint/no-unused-vars */
// hooks/useAuth.ts

import { useState, useEffect } from 'react';
import { User, LoginRequest, ApiError, UserCompany } from '@/types/models';
import { AuthService } from '@/services/authService';

interface UseAuthReturn {
  user: User | null;
  currentCompany: UserCompany | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  setCurrentCompany: (company: UserCompany) => void;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [currentCompany, setCurrentCompanyState] = useState<UserCompany | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Vérification initiale
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = AuthService.getStoredUser();
        const currentCompany = AuthService.getCurrentCompany();

        if (AuthService.isAuthenticated() && storedUser) {
          // Vérifier si le token est toujours valide
          try {
            const userData = await AuthService.getCurrentUser();
            setUser(userData);
            setCurrentCompanyState(AuthService.getCurrentCompany());
            setIsAuthenticated(true);
          } catch (err) {
            // Token invalide, utiliser les données stockées si disponibles
            if (storedUser) {
              setUser(storedUser);
              setCurrentCompanyState(currentCompany);
              setIsAuthenticated(true);
            } else {
              AuthService.removeToken();
              setUser(null);
              setCurrentCompanyState(null);
              setIsAuthenticated(false);
            }
          }
        } else {
          setUser(null);
          setCurrentCompanyState(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        setUser(null);
        setCurrentCompanyState(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

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
    login,
    logout,
    setCurrentCompany,
    clearError,
  };
};