"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, MoreHorizontal, Eye, Edit, Search, Users, UserCheck, UserX, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { RouteGuard } from "@/components/RouteGuard";
import { useClients } from "@/hooks/useClients";
import { ClientListItem } from "@/types/models";
import { useAuthContext } from "@/contexts/AuthContext";

export default function ClientsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Actif");
  const [searchTerm, setSearchTerm] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{top: number, left: number} | null>(null);
  const [filteredClients, setFilteredClients] = useState<ClientListItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [perPage] = useState(8); // 8 clients par page
  const { user } = useAuthContext();

  const router = useRouter();
  const { clients, isLoading, error, refetch } = useClients();
  const isCompanyAdmin = () => {
    return user?.role === 'admin' || user?.has_company || user?.has_super_admin_access;
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Filtrer les clients selon le statut et la recherche
  useEffect(() => {
    let filtered = clients;

    // Filtrer par statut
    if (selectedStatus === "Actif") {
      filtered = filtered.filter(client => client.is_active);
    } else if (selectedStatus === "Inactif") {
      filtered = filtered.filter(client => !client.is_active);
    }

    // Filtrer par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(client =>
        client.first_name.toLowerCase().includes(term) ||
        (client.last_name?.toLowerCase() || '').includes(term) ||
        client.email.toLowerCase().includes(term) ||
        client.id.toLowerCase().includes(term)
      );
    }

    setFilteredClients(filtered);
    setTotalClients(filtered.length);
    setTotalPages(Math.ceil(filtered.length / perPage));

    // Réinitialiser à la page 1 si les filtres changent
    if (currentPage > Math.ceil(filtered.length / perPage)) {
      setCurrentPage(1);
    }
  }, [clients, selectedStatus, searchTerm, perPage, currentPage]);

  // Obtenir les clients paginés
  const getPaginatedClients = () => {
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    return filteredClients.slice(startIndex, endIndex);
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

  // Fonctions pour gérer les actions
  const handleViewClient = (clientId: string) => {
    router.push(`/dashboard/clients/${clientId}`);
  };

  const handleEditClient = (clientId: string) => {
    console.log("Modifier client:", clientId);
    setOpenDropdown(null);
    // Logique pour modifier le client
  };

  const toggleDropdown = (clientId: string, event?: React.MouseEvent) => {
    if (openDropdown === clientId) {
      setOpenDropdown(null);
      setDropdownPosition(null);
    } else {
      setOpenDropdown(clientId);

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
    };
    if (openDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown]);

  // Fonctions utilitaires
  const getClientInitials = (firstName: string, lastName: string | null): string => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return (first + last).toUpperCase();
  };

  const getClientFullName = (firstName: string, lastName: string | null): string => {
    return `${firstName} ${lastName || ''}`.trim();
  };

  const getProfilColor = (role: string): string => {
    return role === 'admin' ? 'from-red-400 to-red-600' : 'from-orange-400 to-orange-600';
  };

  const getProfilLabel = (role: string): string => {
    return role === 'admin' ? 'Admin' : 'Client';
  };

  const getStatutConfig = (isActive: boolean) => {
    return isActive ? {
      className: 'bg-green-100 text-green-700 border-green-200',
      dotColor: 'bg-green-500',
      label: 'Actif'
    } : {
      className: 'bg-red-100 text-red-700 border-red-200',
      dotColor: 'bg-red-500',
      label: 'Inactif'
    };
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
      <RouteGuard requireAdmin={true}>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-[#1EB1D1] border-t-transparent rounded-full"
            />
            <span className="ml-3 text-gray-600">Chargement des clients...</span>
          </div>
        </div>
      </RouteGuard>
    );
  }

  if (error) {
    return (
      <RouteGuard requireAdmin={true}>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-[#1EB1D1] text-white rounded-lg hover:bg-[#17a2b8] transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </RouteGuard>
    );
  }

  const paginatedClients = getPaginatedClients();

  return (
    <RouteGuard requireAdmin={true}>
      <div className="p-6 mb-10">
        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
        >
          {/* Header avec titre */}
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
              <p className="text-gray-600 mt-1">Gérez vos clients et leurs projets</p>
            </div>
          </motion.div>

          {/* Statistiques rapides */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users size={20} className="text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Total clients</p>
                  <p className="text-xl font-semibold text-gray-900">{clients.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <UserCheck size={20} className="text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Actifs</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {clients.filter(c => c.is_active).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <UserX size={20} className="text-red-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Inactifs</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {clients.filter(c => !c.is_active).length}
                  </p>
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
                placeholder="Rechercher un client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EB1D1] focus:border-transparent text-black"
              />
            </div>

            {/* Filtre par statut */}
            <div className="relative">
              <select
                className="appearance-none bg-[#1EB1D1] text-white px-5 py-3 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#1EB1D1] focus:ring-opacity-50 cursor-pointer"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="Actif">Actif</option>
                <option value="Inactif">Inactif</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white pointer-events-none" />
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
                      Client
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Téléphone
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Rôle
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Créé le
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {paginatedClients.length > 0 ? (
                    paginatedClients.map((client, index) => {
                      const statutConfig = getStatutConfig(client.is_active);
                      const profilColor = getProfilColor(client.role);

                      return (
                        <motion.tr
                          key={client.id}
                          variants={itemVariants}
                          className="hover:bg-gray-50/50 transition-colors duration-150"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#1EB1D1] cursor-pointer hover:text-[#17a2b8] transition-colors"
                              onClick={() => handleViewClient(client.id)}>
                            {client.id.slice(0, 8)}...
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${profilColor} mr-3 flex items-center justify-center text-white text-sm font-semibold`}>
                                {getClientInitials(client.first_name, client.last_name)}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {getClientFullName(client.first_name, client.last_name)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {getProfilLabel(client.role)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {client.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {client.telephone || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              client.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {getProfilLabel(client.role)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${statutConfig.className} border`}>
                              <div className={`w-1.5 h-1.5 ${statutConfig.dotColor} rounded-full mr-2`}></div>
                              {statutConfig.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {client.created_at}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            <div className="relative">
                              <button
                                className="hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors duration-150"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleDropdown(client.id, e);
                                }}
                              >
                                <MoreHorizontal size={16} />
                              </button>

                              {openDropdown === client.id && dropdownPosition && (
                                <div
                                  className="fixed bg-white rounded-lg shadow-xl border border-gray-100 py-1 w-48"
                                  style={{
                                    zIndex: 99999,
                                    top: `${dropdownPosition.top}px`,
                                    left: `${Math.max(dropdownPosition.left, 10)}px`
                                  }}
                                >
                                  <button
                                    onClick={() => handleViewClient(client.id)}
                                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                  >
                                    <Eye size={16} className="mr-3 text-blue-500" />
                                    Voir les détails
                                  </button>
                                  {isCompanyAdmin() && (
                                    <button
                                      onClick={() => handleEditClient(client.id)}
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
                      <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <Users size={48} className="text-gray-300 mb-4" />
                          <p className="text-lg font-medium text-gray-900 mb-2">Aucun client trouvé</p>
                          <p className="text-sm text-gray-600">
                            {searchTerm ? 'Aucun client ne correspond à votre recherche.' : 'Aucun client dans cette catégorie.'}
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
                      {((currentPage - 1) * perPage) + 1}-{Math.min(currentPage * perPage, totalClients)}
                    </span> sur <span className="font-semibold text-gray-900">{totalClients}</span> clients
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