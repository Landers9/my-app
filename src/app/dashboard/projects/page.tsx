/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { RouteGuard } from "@/components/RouteGuard";
import { useAuthContext } from "@/contexts/AuthContext";
import { ProjectService } from "@/services/projectService";
import { Project } from "@/types/models";
import { getClientInitials } from "@/utils/projectUtils";

export default function ProjectsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("En cours");
  const [selectedCategory, setSelectedCategory] = useState("Catégories");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{top: number, left: number} | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [perPage] = useState(8); // 8 projets par page
  const router = useRouter();
  const { currentCompany } = useAuthContext();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Charger les projets avec pagination
  useEffect(() => {
    const fetchProjects = async () => {
      if (!currentCompany?.id) return;

      try {
        setIsLoading(true);
        const filters = {
          page: currentPage,
          per_page: perPage
        };
        const response = await ProjectService.getCompanyProjects(currentCompany.id, filters);
        setProjects(response.data);
        setTotalProjects(response.count);
        setTotalPages(Math.ceil(response.count / perPage));
      } catch (error) {
        console.error('Erreur lors du chargement des projets:', error);
        setProjects([]);
        setTotalProjects(0);
        setTotalPages(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [currentCompany?.id, currentPage, perPage]); // Recharger quand la page change

  // Fonctions de pagination
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setOpenDropdown(null); // Fermer les dropdowns ouverts
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
      // Afficher toutes les pages si il y en a peu
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logique pour afficher pages avec ...
      if (currentPage <= 3) {
        // Début: 1, 2, 3, 4, ..., last
        pages.push(1, 2, 3, 4);
        if (totalPages > 5) pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Fin: 1, ..., last-3, last-2, last-1, last
        pages.push(1);
        if (totalPages > 5) pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Milieu: 1, ..., current-1, current, current+1, ..., last
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

      // Calculer la position du dropdown
      if (event) {
        const buttonRect = (event.target as HTMLElement).closest('button')?.getBoundingClientRect();
        if (buttonRect) {
          const scrollY = window.scrollY;
          const scrollX = window.scrollX;

          setDropdownPosition({
            top: buttonRect.bottom + scrollY + 5, // 5px sous le bouton
            left: buttonRect.right + scrollX - 192 // 192px = largeur du dropdown, aligné à droite du bouton
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
    // Logique pour modifier le projet
  };

  const handleDeleteProject = (projectId: string) => {
    console.log("Supprimer projet:", projectId);
    // Logique pour supprimer le projet
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
    const statusMap: Record<string, string> = {
      'submitted': 'En attente',
      'processing': 'En cours',
      'approved': 'En cours',
      'in_development': 'En cours',
      'in_testing': 'En cours',
      'completed': 'Terminé',
      'achieved': 'Terminé',
      'rejected': 'Annulé'
    };
    return statusMap[apiStatus] || 'En cours';
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
          {/* Filtres en haut */}
          <motion.div variants={itemVariants} className="flex items-center justify-end gap-3">
            {/* Filtre par statut */}
            <div className="relative">
              <select
                className="appearance-none bg-[#1EB1D1] text-white px-6 py-3 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1EB1D1] focus:ring-opacity-50 cursor-pointer"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="En cours">En cours</option>
                <option value="Terminé">Terminé</option>
                <option value="En attente">En attente</option>
                <option value="Annulé">Annulé</option>
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
                <option value="Catégories">Catégories</option>
                <option value="MILLENNIUM TECH">MILLENNIUM TECH</option>
                <option value="Services Web">Services Web</option>
                <option value="Mobile Apps">Mobile Apps</option>
                <option value="Consulting">Consulting</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
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
                  ) : projects.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                        Aucun projet trouvé
                      </td>
                    </tr>
                  ) : (
                    projects.map((project, index) => (
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
                          <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></div>
                            {getDisplayStatus(project.status)}
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

                            {/* Dropdown menu avec positionnement fixed précis */}
                            {openDropdown === project.id && dropdownPosition && (
                              <div
                                className="fixed bg-white rounded-lg shadow-xl border border-gray-100 py-1 w-48"
                                style={{
                                  zIndex: 99999,
                                  top: `${dropdownPosition.top}px`,
                                  left: `${Math.max(dropdownPosition.left, 10)}px` // Minimum 10px du bord gauche
                                }}
                              >
                                <button
                                  onClick={() => handleViewProject(project.id)}
                                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                  <Eye size={16} className="mr-3 text-blue-500" />
                                  Voir les détails
                                </button>
                                <button
                                  onClick={() => handleEditProject(project.id)}
                                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                  <Edit size={16} className="mr-3 text-green-500" />
                                  Modifier
                                </button>
                                <button
                                  onClick={() => handleDeleteProject(project.id)}
                                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 size={16} className="mr-3" />
                                  Supprimer
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))
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