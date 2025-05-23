"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, MoreHorizontal, Eye, Edit, Trash2} from "lucide-react";
import { useRouter } from "next/navigation";

// Types pour les données clients
interface Client {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  profil: string;
  projets: number;
  anciennete: string;
  statut: 'Actif' | 'Inactif' | 'Suspendu';
}

export default function ClientsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Actif");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Fonctions pour gérer les actions
  const handleViewClient = (clientId: string) => {
    router.push(`/dashboard/clients/${clientId}`);
  };

  const handleEditClient = (clientId: string) => {
    console.log("Modifier client:", clientId);
    // Logique pour modifier le client
  };

  const handleDeleteClient = (clientId: string) => {
    console.log("Supprimer client:", clientId);
    // Logique pour supprimer le client
  };

  const toggleDropdown = (clientId: string) => {
    setOpenDropdown(openDropdown === clientId ? null : clientId);
  };

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    if (openDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown]);

  // Données d'exemple basées sur l'image de la maquette
  const clients: Client[] = [
    {
      id: "CLI001",
      nom: "JOHNSON",
      prenom: "Mitchell",
      email: "m@gmail.com",
      profil: "Premium",
      projets: 3,
      anciennete: "15 Janvier 2023",
      statut: "Actif"
    },
    {
      id: "CLI002",
      nom: "JOHNSON",
      prenom: "Mitchell",
      email: "m@gmail.com",
      profil: "Premium",
      projets: 3,
      anciennete: "15 Janvier 2023",
      statut: "Actif"
    },
    {
      id: "CLI003",
      nom: "JOHNSON",
      prenom: "Mitchell",
      email: "m@gmail.com",
      profil: "Premium",
      projets: 3,
      anciennete: "15 Janvier 2023",
      statut: "Actif"
    },
    {
      id: "CLI004",
      nom: "JOHNSON",
      prenom: "Mitchell",
      email: "m@gmail.com",
      profil: "Premium",
      projets: 3,
      anciennete: "15 Janvier 2023",
      statut: "Actif"
    },
    {
      id: "CLI005",
      nom: "JOHNSON",
      prenom: "Mitchell",
      email: "m@gmail.com",
      profil: "Premium",
      projets: 3,
      anciennete: "15 Janvier 2023",
      statut: "Actif"
    },
    {
      id: "CLI006",
      nom: "JOHNSON",
      prenom: "Mitchell",
      email: "m@gmail.com",
      profil: "Premium",
      projets: 3,
      anciennete: "15 Janvier 2023",
      statut: "Actif"
    },
    {
      id: "CLI007",
      nom: "JOHNSON",
      prenom: "Mitchell",
      email: "m@gmail.com",
      profil: "Premium",
      projets: 3,
      anciennete: "15 Janvier 2023",
      statut: "Actif"
    },
    {
      id: "CLI008",
      nom: "JOHNSON",
      prenom: "Mitchell",
      email: "m@gmail.com",
      profil: "Premium",
      projets: 3,
      anciennete: "15 Janvier 2023",
      statut: "Actif"
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
    <div className="p-6">
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
              className="appearance-none bg-[#1EB1D1] text-white px-5 py-3 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#1EB1D1] focus:ring-opacity-50 cursor-pointer"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="Actif">Actif</option>
              <option value="Inactif">Inactif</option>
              <option value="Suspendu">Suspendu</option>
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
                    Nom
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Prénom
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Profil
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Projets
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Ancienneté
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
                {clients.map((client, index) => (
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
                      {client.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {client.nom}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                      {client.prenom}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {client.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 mr-3 flex items-center justify-center text-white text-xs font-semibold">
                          {client.prenom.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{client.profil}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                      {client.projets}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                      {client.anciennete}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                        {client.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      <div className="relative">
                        <button
                          className="hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors duration-150"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(client.id);
                          }}
                        >
                          <MoreHorizontal size={16} />
                        </button>

                        {/* Dropdown menu avec z-index élevé */}
                        {openDropdown === client.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-[9999]">
                            <button
                              onClick={() => handleViewClient(client.id)}
                              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <Eye size={16} className="mr-3 text-blue-500" />
                              Voir les détails
                            </button>
                            <button
                              onClick={() => handleEditClient(client.id)}
                              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <Edit size={16} className="mr-3 text-green-500" />
                              Modifier
                            </button>
                            <button
                              onClick={() => handleDeleteClient(client.id)}
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
                Affichage de <span className="font-semibold text-gray-900">1-8</span> sur <span className="font-semibold text-gray-900">24</span> clients
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