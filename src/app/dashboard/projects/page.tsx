/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, MoreHorizontal, Eye, Edit, Search, FolderOpen, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { RouteGuard } from "@/components/RouteGuard";
import { useAuthContext } from "@/contexts/AuthContext";
import { ProjectService } from "@/services/projectService";
import { Project } from "@/types/models";
import { getClientInitials } from "@/utils/projectUtils";

export default function ProjectsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("tous");
  const [selectedServiceType, setSelectedServiceType] = useState("tous");
  const [searchTerm, setSearchTerm] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{top: number, left: number} | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [perPage] = useState(8); // 8 projets par page
  const router = useRouter();
  const { user, currentCompany } = useAuthContext();

  // Fonction pour vérifier si l'utilisateur est admin
  const isCompanyAdmin = () => {
    return user?.role === 'admin' || user?.has_company || user?.has_super_admin_access;
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Charger les projets
  useEffect(() => {
    const fetchProjects = async () => {
      if (!currentCompany?.id) return;

      try {
        setIsLoading(true);
        const response = await ProjectService.getCompanyProjects(currentCompany.id, {});
        setProjects(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des projets:', error);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [currentCompany?.id]);

  // Filtrer les projets selon le statut, le type de service et la recherche
  useEffect(() => {
    let filtered = projects;

    // Filtrer par statut
    if (selectedStatus !== "tous") {
      const statusMap: Record<string, string[]> = {
        'En cours': ['processing', 'approved', 'in_development', 'in_testing'],
        'Terminé': ['completed', 'achieved'],
        'En attente': ['submitted'],
        'Annulé': ['rejected']
      };
      filtered = filtered.filter(project => statusMap[selectedStatus]?.includes(project.status));
    }

    // Filtrer par type de service
    if (selectedServiceType !== "tous") {
      filtered = filtered.filter(project => project.company_service.name === selectedServiceType);
    }

    // Filtrer par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(project =>
        project.reference.toLowerCase().includes(term) ||
        project.company_service.name.toLowerCase().includes(term) ||
        project.company_service.company.name.toLowerCase().includes(term) ||
        project.user.first_name.toLowerCase().includes(term) ||
        project.user.last_name.toLowerCase().includes(term)
      );
    }

    setFilteredProjects(filtered);
    setTotalProjects(filtered.length);
    setTotalPages(Math.ceil(filtered.length / perPage));

    // Réinitialiser à la page 1 si les filtres changent
    if (currentPage > Math.ceil(filtered.length / perPage)) {
      setCurrentPage(1);
    }
  }, [projects, selectedStatus, selectedServiceType, searchTerm, perPage, currentPage]);

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

  // Fonctions pour gérer les actions des projets
  const handleViewProject = (projectId: string) => {
    router.push(`/dashboard/projects/${projectId}`);
  };

  const handleEditProject = (projectId: string) => {
    console.log("Modifier projet:", projectId);
    setOpenDropdown(null);
  };

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null);
      setDropdownPosition(null);
    };
    if (openDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown]);

  // Mapper les statuts API vers les statuts de l'interface
  const getDisplayStatus = (apiStatus: string) => {
    const statusMap: Record<string, { label: string, color: string }> = {
      'submitted': { label: 'En attente', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
      'processing': { label: 'En cours', color: 'bg-blue-100 text-blue-700 border-blue-200' },
      'approved': { label: 'En cours', color: 'bg-blue-100 text-blue-700 border-blue-200' },
      'in_development': { label: 'En cours', color: 'bg-blue-100 text-blue-700 border-blue-200' },
      'in_testing': { label: 'En cours', color: 'bg-blue-100 text-blue-700 border-blue-200' },
      'completed': { label: 'Terminé', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
      'achieved': { label: 'Terminé', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
      'rejected': { label: 'Annulé', color: 'bg-red-100 text-red-700 border-red-200' }
    };
    return statusMap[apiStatus] || { label: 'En cours', color: 'bg-blue-100 text-blue-700 border-blue-200' };
  };

  // Obtenir les types de service uniques
  const getUniqueServiceTypes = () => {
    const serviceTypes = projects.map(project => project.company_service.name);
    return [...new Set(serviceTypes)];
  };

  // Calculer les statistiques
  const getProjectStats = () => {
    const total = projects.length;
    const enCours = projects.filter(p => ['processing', 'approved', 'in_development', 'in_testing'].includes(p.status)).length;
    const termines = projects.filter(p => ['completed', 'achieved'].includes(p.status)).length;
    const enAttente = projects.filter(p => p.status === 'submitted').length;

    return { total, enCours, termines, enAttente };
  };

  const stats = getProjectStats();

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

  const paginatedProjects = getPaginatedProjects();

  return (
    <RouteGuard>
      <div className="p-6 font-poppins">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

          .font-poppins {
            font-family: 'Poppins', sans-serif;
          }
        `}</style>

        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
        >
          {/* Header avec titre */}
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Projets</h1>
              <p className="text-gray-600 mt-1">Gérez vos projets et suivez leur progression</p>
            </div>
          </motion.div>

          {/* Statistiques rapides */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FolderOpen size={20} className="text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Total projets</p>
                  <p className="text-xl font-semibold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock size={20} className="text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">En cours</p>
                  <p className="text-xl font-semibold text-gray-900">{stats.enCours}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle2 size={20} className="text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Terminés</p>
                  <p className="text-xl font-semibold text-gray-900">{stats.termines}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertCircle size={20} className="text-yellow-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">En attente</p>
                  <p className="text-xl font-semibold text-gray-900">{stats.enAttente}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filtres */}
          <motion.div variants={itemVariants} className="flex items-center justify-between gap-4">
            {/* Barre de recherche */}
            <div className="relative flex-1 max-w-md">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un projet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EB1D1] focus:border-transparent text-black"
              />
            </div>

            <div className="flex items-center gap-3">
              {/* Filtre par statut */}
              <div className="relative">
                <select
                  className="appearance-none bg-[#1EB1D1] text-white px-6 py-3 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1EB1D1] focus:ring-opacity-50 cursor-pointer"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="tous">Tous les statuts</option>
                  <option value="En cours">En cours</option>
                  <option value="Terminé">Terminé</option>
                  <option value="En attente">En attente</option>
                  <option value="Annulé">Annulé</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white pointer-events-none" />
              </div>

              {/* Filtre par type de service */}
              <div className="relative">
                <select
                  className="appearance-none bg-white border border-gray-200 rounded-lg px-6 py-3 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1EB1D1] focus:ring-opacity-50 cursor-pointer"
                  value={selectedServiceType}
                  onChange={(e) => setSelectedServiceType(e.target.value)}
                >
                  <option value="tous">Tous les services</option>
                  {getUniqueServiceTypes().map((serviceType) => (
                    <option key={serviceType} value={serviceType}>
                      {serviceType}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </motion.div>

          {/* Tableau */}
          <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Titre du projet
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Catégorie
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Type de service
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date de création
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
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1EB1D1] mr-3"></div>
                          <span className="text-gray-600">Chargement...</span>
                        </div>
                      </td>
                    </tr>
                  ) : paginatedProjects.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <FolderOpen size={48} className="text-gray-300 mb-4" />
                          <p className="text-lg font-medium text-gray-900 mb-2">Aucun projet trouvé</p>
                          <p className="text-sm text-gray-600">
                            {searchTerm || selectedStatus !== "tous" || selectedServiceType !== "tous"
                              ? 'Aucun projet ne correspond aux filtres sélectionnés.'
                              : 'Aucun projet disponible.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedProjects.map((project, index) => {
                      const statusConfig = getDisplayStatus(project.status);

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
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                            {project.company_service.company.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {project.company_service.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {project.user.avatar ? (
                                <img
                                  src={project.user.avatar}
                                  alt={`${project.user.first_name} ${project.user.last_name}`}
                                  className="w-7 h-7 rounded-full object-cover mr-3"
                                />
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-400 to-red-600 mr-3 flex items-center justify-center text-white text-xs font-semibold">
                                  {getClientInitials(project.user.first_name, project.user.last_name)}
                                </div>
                              )}
                              <span className="text-sm font-medium text-gray-900">
                                {project.user.first_name} {project.user.last_name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                            {project.created_at_humanized}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${statusConfig.color} border`}>
                              <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                statusConfig.label === 'Terminé' ? 'bg-emerald-500' :
                                statusConfig.label === 'En cours' ? 'bg-blue-500' :
                                statusConfig.label === 'En attente' ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}></div>
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
          </motion.div>
        </motion.div>
      </div>
    </RouteGuard>
  );
}