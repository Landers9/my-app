"use client";
import React, { useState, useEffect, ReactNode } from 'react';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { motion } from "framer-motion";
import { Menu, X, Home, FileText, Users, User, Settings } from 'lucide-react';
import Image from 'next/image';

type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Fonction pour obtenir le titre de la page basé sur l'URL
  const getPageTitle = () => {
    switch (pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/dashboard/projects':
        return 'Mes projets';
      case '/dashboard/clients':
        return 'Gestion des clients';
      case '/dashboard/profile':
        return 'Mon profil';
      case '/dashboard/settings':
        return 'Paramètres';
      default:
        return 'Dashboard';
    }
  };

  // Fonction pour vérifier si un lien est actif
  const isActiveLink = (href: string) => {
    return pathname === href;
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

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Overlay for mobile when sidebar is open - réduit l'opacité */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray bg-opacity-20 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar - sans animation d'apparition */}
      <div
        className={`fixed lg:static w-64 h-full bg-white shadow-lg z-30 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } transition-transform duration-300`}
      >
        {/* Logo - même hauteur que le header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100">
          <div className="flex items-center">
            <Image
              src="/images/logo_mts.png"
              alt="Millennium Tech"
              width={180}
              height={40}
            />
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
                <Link
                  href="/dashboard/settings"
                  className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                    isActiveLink('/dashboard/settings')
                      ? 'bg-[#1EB1D1] text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Settings size={18} className="mr-3" />
                  <span className="font-medium">Paramètres</span>
                </Link>
              </motion.li>
            </ul>
          </motion.nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header dynamique - sans background blanc ni shadow */}
        <header className="bg-gray-100 border-b border-gray-200">
          <div className="flex items-center justify-between px-6 h-16">
            <div className="flex items-center">
              <button
                className="lg:hidden mr-3 text-[#062C57] hover:text-[#17a2b8] transition-colors"
                onClick={toggleSidebar}
              >
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-semibold text-[#062C57]">{getPageTitle()}</h1>
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
                  U
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">Utilisateur</p>
                  <p className="text-xs text-gray-500">Admin</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          {/* Content will be rendered here */}
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