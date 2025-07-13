/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, useEffect, ReactNode } from 'react';
import Link from "next/link";
import { usePathname } from 'next/navigation';
// import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, FileText, Users, User, LogOut, ChevronDown, Check, Building2 } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';

type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [companySwitcherOpen, setCompanySwitcherOpen] = useState(false);
  const pathname = usePathname();

  // Utiliser les données du contexte d'authentification
  const { user, currentCompany, logout, setCurrentCompany, isCurrentCompanyAdmin } = useAuthContext();

  // Obtenir toutes les compagnies de l'utilisateur
  const userCompanies = user?.companies || [];

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleCompanySwitcher = () => {
    setCompanySwitcherOpen(!companySwitcherOpen);
  };

  const selectCompany = (company: any) => {
    setCurrentCompany(company);
    setCompanySwitcherOpen(false);
  };

  const handleLogout = async () => {
    try {
      // Rediriger vers la page de login après déconnexion
      window.location.href = '/auth/login';
      await logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Même en cas d'erreur, rediriger vers login
      window.location.href = '/auth/login';
    }
  };

  // Fonction pour vérifier si un lien est actif
  const isActiveLink = (href: string) => {
    return pathname === href;
  };

  // Fonction pour générer les initiales d'une entreprise
  const getCompanyInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Fonction pour générer les initiales de l'utilisateur
  const getUserInitials = () => {
    if (!user) return 'U';
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    return (firstName[0] || '') + (lastName[0] || '');
  };

  // Animation pour les éléments du menu seulement
  const menuItemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const menuContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  // Animation pour le dropdown du sélecteur d'entreprise
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -10
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.15
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray bg-opacity-20 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static w-64 h-full bg-white shadow-lg z-30 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } transition-transform duration-300`}
      >
        {/* Sélecteur d'entreprise */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100">
          <div className="flex items-center flex-1 min-w-0">
            {/* Sélecteur d'entreprise */}
            <div className="relative flex-1">
              <button
                onClick={toggleCompanySwitcher}
                className="flex items-center w-full rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center min-w-0 flex-1">
                  {/* Initiales de l'entreprise */}
                  <div className="flex-shrink-0 w-8 h-8 mr-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#1EB1D1] to-[#17a2b8] rounded-md flex items-center justify-center text-white text-xs font-semibold">
                      {currentCompany ? getCompanyInitials(currentCompany.name) : 'MT'}
                    </div>
                  </div>

                  {/* Nom de l'entreprise */}
                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-md font-semibold text-gray-900 truncate">
                      {currentCompany?.name || 'Aucune entreprise'}
                    </p>
                  </div>
                </div>

                {/* Icône chevron */}
                <ChevronDown
                  size={16}
                  className={`text-gray-400 group-hover:text-gray-600 transition-all duration-200 ${
                    companySwitcherOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown du sélecteur d'entreprise */}
              <AnimatePresence>
                {companySwitcherOpen && userCompanies.length > 0 && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-64 overflow-y-auto"
                  >
                    <div className="py-2">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                        Changer d'entreprise
                      </div>
                      {userCompanies.map((company) => (
                        <button
                          key={company.id}
                          onClick={() => selectCompany(company)}
                          className="w-full flex items-center px-3 py-2 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex-shrink-0 w-6 h-6 mr-3">
                            <div className="w-6 h-6 bg-gradient-to-br from-[#1EB1D1] to-[#17a2b8] rounded flex items-center justify-center text-white text-xs font-semibold">
                              {getCompanyInitials(company.name)}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {company.name}
                            </p>
                          </div>
                          {currentCompany?.id === company.id && (
                            <Check size={16} className="text-[#1EB1D1] flex-shrink-0" />
                          )}
                        </button>
                      ))}

                      {/* Option pour créer/rejoindre une entreprise */}
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button className="w-full flex items-center px-3 py-2 hover:bg-gray-50 transition-colors text-gray-600">
                          <Building2 size={16} className="mr-3" />
                          <span className="text-sm">Créer une entreprise</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <button className="lg:hidden text-[#1EB1D1] hover:text-[#17a2b8] transition-colors" onClick={toggleSidebar}>
            <X size={20} />
          </button>
        </div>

        {/* Menu avec animations */}
        <div className="p-4">
          <p className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wider">MENU</p>
          <motion.nav
            variants={menuContainerVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
          >
            <ul className="space-y-2">
              {/* Dashboard - Visible uniquement pour les admins */}
              {isCurrentCompanyAdmin && (
                <motion.li variants={menuItemVariants}>
                  <Link
                    href="/dashboard"
                    className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                      isActiveLink('/dashboard')
                        ? 'bg-[#1EB1D1] text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Home size={18} className="mr-3" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                </motion.li>
              )}

              {/* Mes Projets - Visible pour tous */}
              <motion.li variants={menuItemVariants}>
                <Link
                  href="/dashboard/projects"
                  className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                    isActiveLink('/dashboard/projects')
                      ? 'bg-[#1EB1D1] text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <FileText size={18} className="mr-3" />
                  <span className="font-medium">Mes Projets</span>
                </Link>
              </motion.li>

              {/* Gestion des clients - Visible uniquement pour les admins */}
              {isCurrentCompanyAdmin && (
                <motion.li variants={menuItemVariants}>
                  <Link
                    href="/dashboard/clients"
                    className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                      isActiveLink('/dashboard/clients')
                        ? 'bg-[#1EB1D1] text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Users size={18} className="mr-3" />
                    <span className="font-medium">Gestion des clients</span>
                  </Link>
                </motion.li>
              )}
            </ul>
          </motion.nav>
        </div>

        {/* Profile Section avec animations */}
        <div className="p-4 mt-8">
          <p className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wider">PROFIL</p>
          <motion.nav
            variants={menuContainerVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
          >
            <ul className="space-y-2">
              <motion.li variants={menuItemVariants}>
                <Link
                  href="/dashboard/profile"
                  className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                    isActiveLink('/dashboard/profile')
                      ? 'bg-[#1EB1D1] text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <User size={18} className="mr-3" />
                  <span className="font-medium">Mon profil</span>
                </Link>
              </motion.li>
              <motion.li variants={menuItemVariants}>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center p-3 rounded-lg transition-all duration-200 text-gray-700 hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut size={18} className="mr-3" />
                  <span className="font-medium">Déconnexion</span>
                </button>
              </motion.li>
            </ul>
          </motion.nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header dynamique */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-6 h-16">
            <div className="flex items-center">
              <button
                className="lg:hidden mr-3 text-[#062C57] hover:text-[#17a2b8] transition-colors"
                onClick={toggleSidebar}
              >
                <Menu size={24} />
              </button>
              {/* Logo de l'entreprise courante */}
              {/* {currentCompany?.logo ? ( */}
                {/* <Image
                  src={currentCompany.logo}
                  alt={currentCompany.name}
                  width={160}
                  height={30}
                  className="object-contain"
                /> */}
              {/* // ) : ( */}
                <div className="text-xl font-bold bg-gradient-to-r from-[#062C57] to-[#1EB1D1] bg-clip-text text-transparent">
                  {currentCompany?.name || 'Millenium Tech'}
                </div>
              {/* // )} */}
            </div>
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white transition-colors">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
                </svg>
              </button>

              {/* User profile */}
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1EB1D1] to-[#17a2b8] flex items-center justify-center text-white font-semibold text-sm">
                  {getUserInitials()}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentCompany?.role === 'owner' ? 'Propriétaire' :
                     currentCompany?.role === 'admin' ? 'Admin' : 'Membre'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white px-6 py-4 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm font-medium">
            © 2025 Millenium Tech. Tous droits réservés.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;