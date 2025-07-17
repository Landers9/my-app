/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, MoreHorizontal, Edit, Eye, ArrowLeft, AlertCircle, User, Users, Calendar, Building} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useClientDetail } from "@/hooks/useClientDetail";
import { Project } from "@/types/models";
import { getStatusConfig } from "@/utils/projectUtils";
import { useAuthContext } from "@/contexts/AuthContext";

export default function ClientDetailsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("tous");
  const [selectedCategory, setSelectedCategory] = useState("tous");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{top: number, left: number} | null>(null);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [perPage] = useState(8); // 8 projets par page
  const [clientDropdown, setClientDropdown] = useState(false);
  const { user } = useAuthContext();

  const isCompanyAdmin = () => {
    return user?.role === 'admin' || user?.has_company || user?.has_super_admin_access;
  };

  const router = useRouter();
  const params = useParams();
  const clientId = params?.id as string;

  const { client, projects, isLoading, error, refetch } = useClientDetail(clientId);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Filtrer les projets selon le statut et la catégorie
  useEffect(() => {
    let filtered = projects;

    // Filtrer par statut
    if (selectedStatus !== "tous") {
      filtered = filtered.filter(project => project.status === selectedStatus);
    }

    // Filtrer par catégorie (nom de l'entreprise)
    if (selectedCategory !== "tous") {
      filtered = filtered.filter(project =>
        project.company_service.company.name === selectedCategory
      );
    }

    setFilteredProjects(filtered);
    setTotalProjects(filtered.length);
    setTotalPages(Math.ceil(filtered.length / perPage));

    // Réinitialiser à la page 1 si les filtres changent
    if (currentPage > Math.ceil(filtered.length / perPage)) {
      setCurrentPage(1);
    }
  }, [projects, selectedStatus, selectedCategory, perPage, currentPage]);

  // Obtenir les projets paginés
  const getPaginatedProjects = () => {
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    return filteredProjects.slice(startIndex, endIndex);
  };

  // Fonctions de pagination
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setOpenDropdown(null);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Générer les numéros de pages à afficher
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4);
        if (totalPages > 5) pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        if (totalPages > 5) pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1, currentPage, currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  // Fonctions pour gérer les actions des projets
  const handleViewProject = (projectId: string) => {
    router.push(`/dashboard/projects/${projectId}`);
  };

  const handleEditProject = (projectId: string) => {
    console.log("Modifier projet:", projectId);
    setOpenDropdown(null);
  };

  const toggleDropdown = (projectId: string, event?: React.MouseEvent) => {
    if (openDropdown === projectId) {
      setOpenDropdown(null);
      setDropdownPosition(null);
    } else {
      setOpenDropdown(projectId);

      if (event) {
        const buttonRect = (event.target as HTMLElement).closest('button')?.getBoundingClientRect();
        if (buttonRect) {
          const scrollY = window.scrollY;
          const scrollX = window.scrollX;

          setDropdownPosition({
            top: buttonRect.bottom + scrollY + 5,
            left: buttonRect.right + scrollX - 192
          });
        }
      }
    }
  };

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null);
      setDropdownPosition(null);
      setClientDropdown(false);
    };
    if (openDropdown || clientDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown, clientDropdown]);

  // Fonctions utilitaires
  const getClientInitials = (firstName: string, lastName: string | null): string => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return (first + last).toUpperCase();
  };

  const getClientFullName = (firstName: string, lastName: string | null): string => {
    return `${firstName} ${lastName || ''}`.trim();
  };

  const getUniqueCategories = (): string[] => {
    const categories = projects.map(project => project.company_service.company.name);
    return [...new Set(categories)];
  };

  const getUniqueStatuses = (): string[] => {
    const statuses = projects.map(project => project.status);
    return [...new Set(statuses)];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  // Affichage des états de chargement et d'erreur
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-[#1EB1D1] border-t-transparent rounded-full"
          />
          <span className="ml-3 text-gray-600">Chargement des détails du client...</span>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur</h3>
            <p className="text-gray-600 mb-4">{error || 'Client non trouvé'}</p>
            <div className="space-x-3">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Retour
              </button>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-[#1EB1D1] text-white rounded-lg hover:bg-[#17a2b8] transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const paginatedProjects = getPaginatedProjects();

  return (
    <div className="p-6">
      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        {/* Breadcrumb */}
        <motion.div variants={itemVariants} className="flex items-center text-sm text-gray-600">
          <button
            onClick={() => router.back()}
            className="flex items-center hover:text-gray-900 transition-colors text-md"
          >
            <ArrowLeft size={16} className="mr-2" />
            Gestion des clients
          </button>
          <span className="mx-2">{">"}</span>
          <span className="text-gray-900 font-medium">Client</span>
        </motion.div>

        {/* Section profil client */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 relative h-40">
          {/* Partie cyan (haut) - 25% de la hauteur */}
          <div className="bg-[#1EB1D1] h-15"></div>

          {/* Partie blanche (bas) - 75% de la hauteur */}
          <div className="bg-white h-25 flex items-start justify-between px-6">
            <div className="ml-24 flex-1 mt-2">
              <h1 className="text-md font-bold text-[#062C57]">
                {getClientFullName(client.first_name, client.last_name)}
              </h1>
              <p className="text-[#062C57] text-sm">
                {client.email}
              </p>
              {client.telephone && (
                <p className="text-[#062C57] text-sm">
                  {client.telephone}
                </p>
              )}
            </div>

            {/* Statistiques du client et actions */}
            <div className="flex items-center space-x-6 mt-2">
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mb-1">
                  <Users size={20} className="text-blue-600" />
                </div>
                <p className="text-xs text-gray-600">Projets</p>
                <p className="text-sm font-semibold text-gray-900">{projects.length}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mb-1">
                  <User size={20} className="text-green-600" />
                </div>
                <p className="text-xs text-gray-600">Statut</p>
                <p className="text-sm font-semibold text-gray-900">
                  {client.is_active ? 'Actif' : 'Inactif'}
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full mb-1">
                  <Calendar size={20} className="text-purple-600" />
                </div>
                <p className="text-xs text-gray-600">Membre depuis</p>
                <p className="text-sm font-semibold text-gray-900">{client.created_at}</p>
              </div>
            </div>
          </div>

          {/* Avatar positionné à cheval entre 25% et 75% */}
          <div className="absolute left-6 top-3 w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg z-10">
            {client.avatar && !client.avatar.includes('default-avatar') ? (
              <img src={client.avatar} alt={getClientFullName(client.first_name, client.last_name)} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {getClientInitials(client.first_name, client.last_name)}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Section projets du client */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#062C57]">
              Projets du client ({projects.length})
            </h2>

            {/* Filtres */}
            <div className="flex items-center gap-3">
              {/* Filtre par statut */}
              <div className="relative">
                <select
                  className="appearance-none bg-[#1EB1D1] text-white px-6 py-3 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1EB1D1] focus:ring-opacity-50 cursor-pointer"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="tous">Tous les statuts</option>
                  {getUniqueStatuses().map((status) => (
                    <option key={status} value={status}>
                      {getStatusConfig(status as any).label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white pointer-events-none" />
              </div>

              {/* Filtre par catégories */}
              <div className="relative">
                <select
                  className="appearance-none bg-white border border-gray-200 rounded-lg px-6 py-3 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1EB1D1] focus:ring-opacity-50 cursor-pointer"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="tous">Toutes les catégories</option>
                  {getUniqueCategories().map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Tableau des projets */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Référence
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Entreprise
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Prix
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Créé le
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {paginatedProjects.length > 0 ? (
                    paginatedProjects.map((project, index) => {
                      const statusConfig = getStatusConfig(project.status);

                      return (
                        <motion.tr
                          key={project.id}
                          variants={itemVariants}
                          className="hover:bg-gray-50/50 transition-colors duration-150"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#1EB1D1] cursor-pointer hover:text-[#17a2b8] transition-colors"
                              onClick={() => handleViewProject(project.id)}>
                            {project.reference}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {project.company_service.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 mr-3 flex items-center justify-center text-white text-xs font-semibold">
                                {project.company_service.company.name.charAt(0)}
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {project.company_service.company.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                            {project.final_price > 0 ? `${project.final_price.toLocaleString()} €` : 'À définir'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatDate(project.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${statusConfig.className} border`}>
                              <div className={`w-1.5 h-1.5 ${statusConfig.dotColor} rounded-full mr-2`}></div>
                              {statusConfig.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            <div className="relative">
                              <button
                                className="hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors duration-150"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleDropdown(project.id, e);
                                }}
                              >
                                <MoreHorizontal size={16} />
                              </button>

                              {openDropdown === project.id && dropdownPosition && (
                                <div
                                  className="fixed bg-white rounded-lg shadow-xl border border-gray-100 py-1 w-48"
                                  style={{
                                    zIndex: 99999,
                                    top: `${dropdownPosition.top}px`,
                                    left: `${Math.max(dropdownPosition.left, 10)}px`
                                  }}
                                >
                                  <button
                                    onClick={() => handleViewProject(project.id)}
                                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                  >
                                    <Eye size={16} className="mr-3 text-blue-500" />
                                    Voir les détails
                                  </button>
                                  {isCompanyAdmin() && (
                                    <button
                                      onClick={() => handleEditProject(project.id)}
                                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                      <Edit size={16} className="mr-3 text-green-500" />
                                      Modifier
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <Building size={48} className="text-gray-300 mb-4" />
                          <p className="text-lg font-medium text-gray-900 mb-2">Aucun projet trouvé</p>
                          <p className="text-sm text-gray-600">
                            {selectedStatus !== "tous" || selectedCategory !== "tous"
                              ? 'Aucun projet ne correspond aux filtres sélectionnés.'
                              : 'Ce client n\'a pas encore de projets.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination fonctionnelle */}
            {totalPages > 1 && (
              <div className="bg-white px-6 py-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 font-medium">
                    Affichage de <span className="font-semibold text-gray-900">
                      {((currentPage - 1) * perPage) + 1}-{Math.min(currentPage * perPage, totalProjects)}
                    </span> sur <span className="font-semibold text-gray-900">{totalProjects}</span> projets
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* Bouton précédent */}
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-colors duration-150 ${
                        currentPage === 1
                          ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <span className="text-sm font-medium">‹</span>
                    </button>

                    {/* Numéros de pages */}
                    {getPageNumbers().map((page, index) => (
                      <React.Fragment key={index}>
                        {page === '...' ? (
                          <span className="text-gray-400 text-sm px-2">...</span>
                        ) : (
                          <button
                            onClick={() => goToPage(page as number)}
                            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors duration-150 ${
                              currentPage === page
                                ? 'bg-[#1EB1D1] text-white shadow-sm'
                                : 'border border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            {page}
                          </button>
                        )}
                      </React.Fragment>
                    ))}

                    {/* Bouton suivant */}
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-colors duration-150 ${
                        currentPage === totalPages
                          ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <span className="text-sm font-medium">›</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}