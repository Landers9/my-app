// contexts/AuthContext.tsx

"use client";
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User, LoginRequest, UserCompany } from '@/types/models';

interface AuthContextType {
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};