// components/RouteGuard.tsx

"use client";
import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';

interface RouteGuardProps {
  children: ReactNode;
  requireAdmin?: boolean;
  fallbackPath?: string;
}

export const RouteGuard = ({
  children,
  requireAdmin = false,
  fallbackPath = '/dashboard/projects'
}: RouteGuardProps) => {
  const router = useRouter();
  const {
    isAuthenticated,
    isCurrentCompanyAdmin,
    isLoading,
  } = useAuthContext();

  useEffect(() => {
    // Attendre que le chargement soit terminé
    if (isLoading) return;

    // Vérifier l'authentification
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Vérifier les permissions admin si requis
    if (requireAdmin && !isCurrentCompanyAdmin) {
      router.push(fallbackPath);
      return;
    }

  }, [isAuthenticated, isCurrentCompanyAdmin, isLoading, requireAdmin, router, fallbackPath]);

  // Afficher un loader pendant la vérification
  if (isLoading || !isAuthenticated || (requireAdmin && !isCurrentCompanyAdmin)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#1EB1D1] mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isLoading ? 'Chargement...' :
             !isAuthenticated ? 'Redirection vers la connexion...' :
             'Vérification des permissions...'}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Hook personnalisé pour simplifier l'utilisation
export const useRouteGuard = () => {
  const { isAuthenticated, isCurrentCompanyAdmin } = useAuthContext();

  return {
    isAuthenticated,
    isCurrentCompanyAdmin,
    canAccessAdminRoutes: isAuthenticated && isCurrentCompanyAdmin,
    canAccessUserRoutes: isAuthenticated
  };
};