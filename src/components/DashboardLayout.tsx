/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, useEffect, ReactNode } from 'react';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, FileText, Users, User, Settings, ChevronDown, Check, Building2 } from 'lucide-react';
import Image from 'next/image';

type Company = {
  id: string;
  name: string;
  logo: string | null;
  slug: string;
};

type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [companySwitcherOpen, setCompanySwitcherOpen] = useState(false);
  const pathname = usePathname();

  // Mock data - à remplacer par vos données réelles
  const [userCompanies] = useState<Company[]>([
    {
      id: "1",
      name: "Millenium Tech",
      logo: "/images/logo_mts.png",
      slug: "millennium-tech"
    },
    {
      id: "2",
      name: "Startup Innovation",
      logo: null,
      slug: "startup-innovation"
    },
    {
      id: "3",
      name: "Digital Agency",
      logo: null,
      slug: "digital-agency-pro"
    }
  ]);

  const [currentCompany, setCurrentCompany] = useState<Company>(userCompanies[0]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleCompanySwitcher = () => {
    setCompanySwitcherOpen(!companySwitcherOpen);
  };

  const selectCompany = (company: Company) => {
    setCurrentCompany(company);
    setCompanySwitcherOpen(false);
    // Ici vous pouvez ajouter la logique pour changer de contexte d'entreprise
    // Par exemple : router.push(`/dashboard?company=${company.slug}`)
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
          {/* Sélecteur d'entreprise seulement */}
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
                      {getCompanyInitials(currentCompany.name)}
                    </div>
                  </div>

                  {/* Nom de l'entreprise */}
                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-md font-semibold text-gray-900 truncate">
                      {currentCompany.name}
                    </p>
                    {/* <p className="text-xs text-gray-500 truncate">
                      Entreprise
                    </p> */}
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
                {companySwitcherOpen && (
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
                          {currentCompany.id === company.id && (
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
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-6 h-16">
            <div className="flex items-center">
              <button
                className="lg:hidden mr-3 text-[#062C57] hover:text-[#17a2b8] transition-colors"
                onClick={toggleSidebar}
              >
                <Menu size={24} />
              </button>
              <Image
                src="/images/logo_mts.png"
                alt="Millennium Tech"
                width={180}
                height={40}
              />
              {/* <h1 className="text-xl font-semibold text-[#062C57]">{getPageTitle()}</h1> */}
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