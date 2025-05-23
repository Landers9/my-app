"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, MoreHorizontal, Edit, Eye, Trash2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

// Types pour les données
interface ClientProject {
  id: string;
  title: string;
  category: string;
  serviceType: string;
  assignedTo: string;
  deadline: string;
  status: 'En cours' | 'Terminé' | 'En attente' | 'Annulé';
}

interface ClientDetails {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  profession: string;
  company: string;
  avatar: string;
}

export default function ClientDetailsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("En cours");
  const [selectedCategory, setSelectedCategory] = useState("Catégories");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Données du client (simulées)
  const clientData: ClientDetails = {
    id: params?.id as string || "#CLI001",
    nom: "ROSS",
    prenom: "Mike",
    email: "m.mikeross@gmail.com",
    profession: "Avocat",
    company: "PEARSON SPECTER LITE",
    avatar: "/images/client-avatar.jpg" // Tu peux remplacer par l'image réelle
  };

  // Projets du client
  const clientProjects: ClientProject[] = [
    {
      id: "#524AOP",
      title: "Dagger-Print",
      category: "MILLENNIUM TECH",
      serviceType: "Appli. Mobile",
      assignedTo: "Sylvestre",
      deadline: "15 Janvier 2023",
      status: "En cours"
    },
    {
      id: "#524AOP",
      title: "Dagger-Print",
      category: "MILLENNIUM TECH",
      serviceType: "Appli. Mobile",
      assignedTo: "Franck",
      deadline: "15 Janvier 2023",
      status: "En cours"
    },
    {
      id: "#524AOP",
      title: "Dagger-Print",
      category: "MILLENNIUM TECH",
      serviceType: "Appli. Mobile",
      assignedTo: "Correl",
      deadline: "15 Janvier 2023",
      status: "En cours"
    },
    {
      id: "#524AOP",
      title: "Dagger-Print",
      category: "MILLENNIUM TECH",
      serviceType: "Appli. Mobile",
      assignedTo: "Delvon",
      deadline: "15 Janvier 2023",
      status: "En cours"
    },
    {
      id: "#524AOP",
      title: "Dagger-Print",
      category: "MILLENNIUM TECH",
      serviceType: "Appli. Mobile",
      assignedTo: "Raoul",
      deadline: "15 Janvier 2023",
      status: "En cours"
    }
  ];

  // Fonctions pour gérer les actions
  const handleViewProject = (projectId: string) => {
    router.push(`/dashboard/projects/${projectId}`);
  };

  const handleEditProject = (projectId: string) => {
    console.log("Modifier projet:", projectId);
  };

  const handleDeleteProject = (projectId: string) => {
    console.log("Supprimer projet:", projectId);
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
                M. {clientData.prenom} {clientData.nom}
              </h1>
              <p className="text-[#062C57] text-sm">
                {clientData.email}
              </p>
            </div>
          </div>

          {/* Avatar positionné à cheval entre 25% et 75% */}
          <div className="absolute left-6 top-3 w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg z-10">
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {clientData.prenom.charAt(0)}{clientData.nom.charAt(0)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Section projets du client */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#062C57]">Projets du clients</h2>

            {/* Filtres */}
            <div className="flex items-center gap-3">
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
                      Assigné à
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Délais
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
                  {clientProjects.map((project, index) => (
                    <motion.tr
                      key={`${project.id}-${index}`}
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
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 mr-3 flex items-center justify-center text-white text-xs font-semibold">
                            {project.assignedTo.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{project.assignedTo}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                        {project.deadline}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        <div className="relative">
                          <button
                            className="hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors duration-150"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDropdown(`${project.id}-${index}`);
                            }}
                          >
                            <MoreHorizontal size={16} />
                          </button>

                          {/* Dropdown menu avec z-index élevé */}
                          {openDropdown === `${project.id}-${index}` && (
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

            {/* Pagination */}
            <div className="bg-white px-6 py-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 font-medium">
                  Affichage de <span className="font-semibold text-gray-900">1-5</span> sur <span className="font-semibold text-gray-900">5</span> projets
                </div>
                <div className="flex items-center space-x-2">
                  <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors duration-150">
                    <span className="text-sm font-medium">‹</span>
                  </button>
                  <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#1EB1D1] text-white text-sm font-semibold shadow-sm">
                    1
                  </button>
                  <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors duration-150">
                    <span className="text-sm font-medium">›</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}