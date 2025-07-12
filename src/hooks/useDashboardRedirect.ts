// hooks/useDashboardRedirect.ts

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';

/**
 * Hook pour gérer la redirection automatique selon le rôle de l'utilisateur
 */
export const useDashboardRedirect = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isCurrentCompanyAdmin, isAuthenticated, currentCompany, isLoading } = useAuthContext();

  useEffect(() => {
    // Attendre que l'authentification soit chargée
    if (isLoading || !isAuthenticated || !currentCompany) {
      return;
    }

    // Routes réservées aux admins
    const adminRoutes = ['/dashboard', '/dashboard/clients'];
    const isAdminRoute = adminRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));

    // Si l'utilisateur n'est pas admin et tente d'accéder à une route admin
    if (!isCurrentCompanyAdmin && isAdminRoute) {
      router.replace('/dashboard/projects');
      return;
    }

    // Si l'utilisateur non-admin va sur /dashboard, rediriger vers ses projets
    if (!isCurrentCompanyAdmin && pathname === '/dashboard') {
      router.replace('/dashboard/projects');
      return;
    }

  }, [isCurrentCompanyAdmin, isAuthenticated, currentCompany, pathname, router, isLoading]);

  return {
    isCurrentCompanyAdmin,
    canAccessRoute: (routePath: string) => {
      const adminRoutes = ['/dashboard', '/dashboard/clients'];
      const isAdminRoute = adminRoutes.some(route => routePath === route || routePath.startsWith(route + '/'));

      if (isAdminRoute) {
        return isCurrentCompanyAdmin;
      }

      return isAuthenticated;
    }
  };
};