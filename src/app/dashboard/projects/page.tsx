"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Types pour les données
interface Project {
  id: string;
  title: string;
  category: string;
  serviceType: string;
  client: string;
  creationDate: string;
  status: 'En cours' | 'Terminé' | 'En attente' | 'Annulé';
}

export default function ProjectsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("En cours");
  const [selectedCategory, setSelectedCategory] = useState("Catégories");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

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

  const toggleDropdown = (projectId: string) => {
    setOpenDropdown(openDropdown === projectId ? null : projectId);
  };

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    if (openDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown]);

  // Données d'exemple basées sur l'image
  const projects: Project[] = [
    {
      id: "PROJ001",
      title: "Dagger-Print",
      category: "MILLENNIUM TECH",
      serviceType: "App Mobile",
      client: "M. Meirion",
      creationDate: "15 Janvier 2025",
      status: "En cours"
    },
    {
      id: "PROJ002",
      title: "Dagger-Print",
      category: "MILLENNIUM TECH",
      serviceType: "App Mobile",
      client: "M. Meirion",
      creationDate: "15 Janvier 2025",
      status: "En cours"
    },
    {
      id: "PROJ003",
      title: "Dagger-Print",
      category: "MILLENNIUM TECH",
      serviceType: "App Mobile",
      client: "M. Meirion",
      creationDate: "15 Janvier 2025",
      status: "En cours"
    },
    {
      id: "PROJ004",
      title: "Dagger-Print",
      category: "MILLENNIUM TECH",
      serviceType: "App Mobile",
      client: "M. Meirion",
      creationDate: "15 Janvier 2025",
      status: "En cours"
    },
    {
      id: "PROJ005",
      title: "Dagger-Print",
      category: "MILLENNIUM TECH",
      serviceType: "App Mobile",
      client: "M. Meirion",
      creationDate: "15 Janvier 2025",
      status: "En cours"
    },
    {
      id: "PROJ006",
      title: "Dagger-Print",
      category: "MILLENNIUM TECH",
      serviceType: "App Mobile",
      client: "M. Meirion",
      creationDate: "15 Janvier 2025",
      status: "En cours"
    },
    {
      id: "PROJ007",
      title: "Dagger-Print",
      category: "MILLENNIUM TECH",
      serviceType: "App Mobile",
      client: "M. Meirion",
      creationDate: "15 Janvier 2025",
      status: "En cours"
    },
    {
      id: "PROJ008",
      title: "Dagger-Print",
      category: "MILLENNIUM TECH",
      serviceType: "App Mobile",
      client: "M. Meirion",
      creationDate: "15 Janvier 2025",
      status: "En cours"
    }
  ];

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
                {projects.map((project, index) => (
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
                      {project.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {project.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                      {project.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {project.serviceType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-400 to-red-600 mr-3 flex items-center justify-center text-white text-xs font-semibold">
                          {project.client.split('.')[1]?.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{project.client}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                      {project.creationDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></div>
                        En cours
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      <div className="relative">
                        <button
                          className="hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors duration-150"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(project.id);
                          }}
                        >
                          <MoreHorizontal size={16} />
                        </button>

                        {/* Dropdown menu avec z-index élevé */}
                        {openDropdown === project.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-[9999]">
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
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination améliorée */}
          <div className="bg-white px-6 py-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 font-medium">
                Affichage de <span className="font-semibold text-gray-900">1-8</span> sur <span className="font-semibold text-gray-900">24</span> projets
              </div>
              <div className="flex items-center space-x-2">
                <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors duration-150">
                  <span className="text-sm font-medium">‹</span>
                </button>
                <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#1EB1D1] text-white text-sm font-semibold shadow-sm">
                  1
                </button>
                <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors duration-150">
                  <span className="text-sm font-medium">2</span>
                </button>
                <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors duration-150">
                  <span className="text-sm font-medium">3</span>
                </button>
                <span className="text-gray-400 text-sm">...</span>
                <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors duration-150">
                  <span className="text-sm font-medium">12</span>
                </button>
                <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors duration-150">
                  <span className="text-sm font-medium">›</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}