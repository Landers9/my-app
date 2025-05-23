"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, FileText, Image as ImageIcon, User, Calendar, DollarSign, Play, Pause, Volume2, Zap, Target, Smartphone } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

// Types pour les données
interface ProjectDocument {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'xlsx' | 'image';
  size: string;
  uploadDate: string;
}

interface ProjectDetails {
  id: string;
  title: string;
  category: string;
  serviceType: string;
  client: {
    name: string;
    email: string;
  };
  status: string;
  creationDate: string;
  description: string;
  budget: string;
  features: string[];
  platform?: string;
  assignedTo: string;
  audioMessage?: string;
  progress: number;
}

export default function ProjectDetailsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Données du projet enrichies
  const projectData: ProjectDetails = {
    id: params?.id as string || "#PROJ001",
    title: "Dagger-Print",
    category: "MILLENNIUM TECH",
    serviceType: "Développement mobile",
    client: {
      name: "Mitchell ROSS",
      email: "m.mitchell@gmail.com"
    },
    status: "En cours",
    creationDate: "15 Janvier 2025",
    description: "Dagger-Print est une application mobile innovante conçue pour révolutionner l'industrie de l'impression. Cette solution permet aux utilisateurs de commander des services d'impression directement depuis leur smartphone, avec une interface intuitive et des fonctionnalités avancées de personnalisation. L'application intègre un système de géolocalisation pour trouver les imprimeurs les plus proches, un module de paiement sécurisé, et un suivi en temps réel des commandes.",
    budget: "25000",
    features: ["E-commerce", "Géolocalisation", "Paiement en ligne", "Notifications push", "Interface intuitive", "Suivi commandes"],
    platform: "Les deux",
    assignedTo: "M. Michael",
    audioMessage: "/audio/project-description.mp3",
    progress: 65
  };

  const projectDocuments: ProjectDocument[] = [
    {
      id: "doc1",
      name: "Cahier des charges complet.pdf",
      type: "pdf",
      size: "2.5 MB",
      uploadDate: "12 Jan 2025"
    },
    {
      id: "doc2",
      name: "Maquettes UI-UX.sketch",
      type: "image",
      size: "8.3 MB",
      uploadDate: "10 Jan 2025"
    },
    {
      id: "doc3",
      name: "Specifications techniques.docx",
      type: "doc",
      size: "1.2 MB",
      uploadDate: "10 Jan 2025"
    },
    {
      id: "doc4",
      name: "Budget détaillé.xlsx",
      type: "xlsx",
      size: "856 KB",
      uploadDate: "08 Jan 2025"
    }
  ];

  const galleryImages = [
    "/images/gallery1.jpg",
    "/images/gallery2.jpg",
    "/images/gallery3.jpg",
    "/images/gallery4.jpg",
    "/images/gallery5.jpg",
    "/images/gallery6.jpg"
  ];

  const toggleAudio = () => {
    setIsAudioPlaying(!isAudioPlaying);
  };

  const getDocumentIcon = (type: string) => {
    const iconMap = {
      pdf: { icon: FileText, color: "from-red-400 to-pink-500" },
      doc: { icon: FileText, color: "from-blue-400 to-cyan-500" },
      xlsx: { icon: FileText, color: "from-green-400 to-emerald-500" },
      image: { icon: ImageIcon, color: "from-purple-400 to-violet-500" }
    };

    const { icon: Icon, color } = iconMap[type as keyof typeof iconMap] || iconMap.doc;

    return (
      <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center`}>
        <Icon size={20} className="text-white" />
      </div>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-6">
      <motion.div
        className="max-w-7xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        {/* Breadcrumb simple */}
        <motion.div variants={itemVariants} className="flex items-center text-sm text-gray-600">
          <button
            onClick={() => router.back()}
            className="flex items-center hover:text-gray-900 transition-colors"
          >
            Mes projets
          </button>
          <span className="mx-2">{">"}</span>
          <span className="text-gray-900 font-medium">Projet n° {projectData.id}</span>
        </motion.div>

        {/* Hero Section avec plus d'animations et sans shadow */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-lg backdrop-blur-xl bg-gradient-to-r from-white/40 to-white/20 border border-white/30"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
        >
          {/* Background Pattern avec plus d'animation */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[#1EB1D1]/10 to-[#062C57]/10"
            animate={{
              background: [
                "linear-gradient(to right, rgba(30, 177, 209, 0.1), rgba(6, 44, 87, 0.1))",
                "linear-gradient(to right, rgba(6, 44, 87, 0.1), rgba(30, 177, 209, 0.1))",
                "linear-gradient(to right, rgba(30, 177, 209, 0.1), rgba(6, 44, 87, 0.1))"
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#1EB1D1]/20 to-transparent rounded-full blur-3xl"
            animate={{
              x: [0, 20, 0],
              y: [0, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-tr from-[#062C57]/20 to-transparent rounded-full blur-2xl"
            animate={{
              x: [0, -15, 0],
              y: [0, 15, 0],
              scale: [1, 0.9, 1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* Info principale avec plus d'animations */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <motion.div
                    className="flex items-center space-x-3 mb-4"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <motion.span
                      className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-[#1EB1D1] to-[#17a2b8] text-white rounded-full"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {projectData.serviceType}
                    </motion.span>
                    <motion.span
                      className="text-gray-600 text-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      {projectData.category}
                    </motion.span>
                  </motion.div>

                  <motion.h1
                    className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#062C57] to-[#1EB1D1] bg-clip-text text-transparent mb-4"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    {projectData.title}
                  </motion.h1>

                  <motion.p
                    className="text-gray-700 text-lg leading-relaxed mb-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                  >
                    {projectData.description}
                  </motion.p>

                  {/* Client info avec avatar animé */}
                  <motion.div
                    className="flex items-center space-x-4 p-4 backdrop-blur-md bg-white/30 rounded-2xl border border-white/40"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.div
                      className="w-12 h-12 bg-gradient-to-br from-[#1EB1D1] to-[#062C57] rounded-full flex items-center justify-center text-white font-bold text-lg"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {projectData.client.name.split(' ').map(n => n.charAt(0)).join('')}
                    </motion.div>
                    <div>
                      <motion.p
                        className="font-semibold text-gray-800"
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.1 }}
                      >
                        {projectData.client.name}
                      </motion.p>
                      <motion.p
                        className="text-gray-600 text-sm"
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.2 }}
                      >
                        {projectData.client.email}
                      </motion.p>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Stats circulaires avec plus d'animations */}
              <motion.div
                className="flex justify-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8, type: "spring", stiffness: 100 }}
              >
                <motion.div
                  className="relative"
                  animate={{
                    y: [0, -8, 0],
                    rotate: [0, 2, -2, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  {/* Cercle de progression avec animation */}
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="8"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: 1 }}
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${projectData.progress * 2.51} 251`}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 1.2, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#1EB1D1" />
                        <stop offset="100%" stopColor="#062C57" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                  >
                    <div className="text-center">
                      <motion.div
                        className="text-2xl font-bold text-gray-800"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        {projectData.progress}%
                      </motion.div>
                      <div className="text-sm text-gray-600">Progrès</div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>

            {/* Métriques en bas avec animations séquentielles */}
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 1.8
                  }
                }
              }}
            >
              {[
                { icon: DollarSign, label: "Budget", value: `${parseInt(projectData.budget).toLocaleString()} €`, color: "from-green-400 to-emerald-500" },
                { icon: Calendar, label: "Créé le", value: projectData.creationDate, color: "from-blue-400 to-cyan-500" },
                { icon: Smartphone, label: "Plateforme", value: projectData.platform, color: "from-purple-400 to-violet-500" },
                { icon: User, label: "Assigné à", value: projectData.assignedTo, color: "from-orange-400 to-red-500" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="backdrop-blur-md bg-white/25 rounded-2xl p-4 border border-white/30 hover:bg-white/35 transition-all duration-300"
                  variants={{
                    hidden: { y: 30, opacity: 0 },
                    visible: { y: 0, opacity: 1 }
                  }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-3`}
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
                  >
                    <item.icon size={20} className="text-white" />
                  </motion.div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">{item.label}</p>
                  <motion.p
                    className="font-bold text-gray-800"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 2 + index * 0.1, duration: 0.3 }}
                  >
                    {item.value}
                  </motion.p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Fonctionnalités en liste stylée avec animations */}
        <motion.div variants={itemVariants} className="backdrop-blur-xl bg-white/30 rounded-lg p-8 border border-white/30">
          <motion.h2
            className="text-2xl font-bold text-gray-800 mb-6 flex items-center"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Zap className="mr-3 text-[#1EB1D1]" />
            </motion.div>
            Fonctionnalités requises
          </motion.h2>
          <motion.div
            className="space-y-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.3
                }
              }
            }}
          >
            {projectData.features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center p-4 backdrop-blur-md bg-white/40 rounded-2xl border border-white/40 hover:bg-white/60 transition-all duration-300 group"
                variants={{
                  hidden: { x: -30, opacity: 0 },
                  visible: { x: 0, opacity: 1 }
                }}
                whileHover={{ x: 5, scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="w-10 h-10 bg-gradient-to-br from-[#1EB1D1] to-[#062C57] rounded-full flex items-center justify-center mr-4"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.2
                  }}
                >
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.3
                    }}
                  />
                </motion.div>
                <motion.span
                  className="font-medium text-gray-800 group-hover:text-[#062C57] transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  {feature}
                </motion.span>
                <motion.div
                  className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                  whileHover={{ scale: 1.2 }}
                >
                  <div className="w-2 h-2 bg-[#1EB1D1] rounded-full" />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Message audio stylé avec plus d'animations */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 backdrop-blur-xl bg-gradient-to-br from-white/40 to-white/20 rounded-lg p-8 border border-white/30"
          >
            <motion.h3
              className="text-2xl font-bold text-gray-800 mb-6 flex items-center"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Volume2 className="mr-3 text-[#1EB1D1]" />
              </motion.div>
              Message vocal du client
            </motion.h3>

            <motion.div
              className="relative p-6 bg-gradient-to-r from-[#1EB1D1]/10 to-[#062C57]/10 rounded-2xl border border-white/40"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="flex items-center space-x-6">
                <motion.button
                  onClick={toggleAudio}
                  className="w-16 h-16 bg-gradient-to-br from-[#1EB1D1] to-[#062C57] rounded-full flex items-center justify-center text-white"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(30, 177, 209, 0.4)",
                      "0 0 0 10px rgba(30, 177, 209, 0)",
                      "0 0 0 0 rgba(30, 177, 209, 0)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div
                    animate={isAudioPlaying ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5, repeat: isAudioPlaying ? Infinity : 0 }}
                  >
                    {isAudioPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </motion.div>
                </motion.button>

                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex-1 h-2 bg-white/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#1EB1D1] to-[#062C57] rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "35%" }}
                        transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
                      />
                    </div>
                    <motion.span
                      className="text-sm font-medium text-gray-700"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      2:34
                    </motion.span>
                  </div>
                  <motion.p
                    className="text-gray-700"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    Explication détaillée du projet par le client
                  </motion.p>
                </div>
              </div>

              {/* Visualiseur audio animé avec plus d'effets */}
              <motion.div
                className="flex items-center justify-center space-x-1 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-gradient-to-t from-[#1EB1D1] to-[#062C57] rounded-full"
                    style={{ height: Math.random() * 30 + 10 }}
                    animate={isAudioPlaying ? {
                      scaleY: [1, Math.random() * 2 + 0.5, 1],
                      opacity: [0.5, 1, 0.5]
                    } : {
                      scaleY: [1, 0.3, 1]
                    }}
                    transition={{
                      duration: 0.5 + Math.random() * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.05
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Timeline moderne avec plus d'animations */}
          <motion.div
            variants={itemVariants}
            className="backdrop-blur-xl bg-white/30 rounded-3xl p-8 border border-white/30"
          >
            <motion.h3
              className="text-xl font-bold text-gray-800 mb-6 flex items-center"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Target className="mr-3 text-[#1EB1D1]" />
              </motion.div>
              Timeline
            </motion.h3>

            <motion.div
              className="space-y-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.2,
                    delayChildren: 0.4
                  }
                }
              }}
            >
              {[
                { title: "Projet créé", date: "15 Jan 2025", status: "completed" },
                { title: "Développement", date: "18 Jan 2025", status: "completed" },
                { title: "Tests utilisateur", date: "15 Fév 2025", status: "current" },
                { title: "Livraison", date: "28 Fév 2025", status: "upcoming" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-4"
                  variants={{
                    hidden: { x: -30, opacity: 0 },
                    visible: { x: 0, opacity: 1 }
                  }}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className={`w-4 h-4 rounded-full mt-1 ${
                      item.status === 'completed' ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                      item.status === 'current' ? 'bg-gradient-to-r from-[#1EB1D1] to-[#062C57]' :
                      'bg-gray-300'
                    }`}
                    animate={item.status === 'current' ? {
                      scale: [1, 1.3, 1],
                      boxShadow: [
                        "0 0 0 0 rgba(30, 177, 209, 0.4)",
                        "0 0 0 8px rgba(30, 177, 209, 0)",
                        "0 0 0 0 rgba(30, 177, 209, 0)"
                      ]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <p className={`font-medium ${item.status === 'upcoming' ? 'text-gray-500' : 'text-gray-800'}`}>
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-600">{item.date}</p>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Documents en liste avec animations */}
        <motion.div
          variants={itemVariants}
          className="backdrop-blur-xl bg-white/30 rounded-lg p-8 border border-white/30"
        >
          <motion.h3
            className="text-2xl font-bold text-gray-800 mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Documents du projet
          </motion.h3>
          <motion.div
            className="space-y-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.3
                }
              }
            }}
          >
            {projectDocuments.map((doc, index) => (
              <motion.div
                key={doc.id}
                className="flex items-center justify-between p-4 backdrop-blur-md bg-white/40 rounded-2xl border border-white/40 hover:bg-white/60 transition-all duration-300 group"
                variants={{
                  hidden: { x: -30, opacity: 0 },
                  visible: { x: 0, opacity: 1 }
                }}
                whileHover={{ x: 5, scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-4">
                  <motion.div
                    animate={{
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.5
                    }}
                  >
                    {getDocumentIcon(doc.type)}
                  </motion.div>
                  <div>
                    <motion.h4
                      className="font-semibold text-gray-900 group-hover:text-[#062C57] transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      {doc.name}
                    </motion.h4>
                    <motion.p
                      className="text-sm text-gray-600"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      {doc.size} • Ajouté le {doc.uploadDate}
                    </motion.p>
                  </div>
                </div>
                <motion.button
                  className="p-3 hover:bg-white/50 rounded-xl transition-all duration-200 text-gray-600 hover:text-[#1EB1D1] opacity-0 group-hover:opacity-100"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download size={18} />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Galerie avec plus d'animations */}
        <motion.div
          variants={itemVariants}
          className="backdrop-blur-xl bg-white/30 rounded-3xl p-8 border border-white/30"
        >
          <motion.h3
            className="text-2xl font-bold text-gray-800 mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Galerie du projet
          </motion.h3>
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.3
                }
              }
            }}
          >
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                className="aspect-square rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden cursor-pointer group relative"
                variants={{
                  hidden: { scale: 0.8, opacity: 0 },
                  visible: { scale: 1, opacity: 1 }
                }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1EB1D1]/20 to-[#062C57]/20 group-hover:from-[#1EB1D1]/30 group-hover:to-[#062C57]/30 transition-all duration-300"
                  animate={{
                    background: [
                      "linear-gradient(to bottom right, rgba(30, 177, 209, 0.2), rgba(6, 44, 87, 0.2))",
                      "linear-gradient(to bottom right, rgba(6, 44, 87, 0.2), rgba(30, 177, 209, 0.2))",
                      "linear-gradient(to bottom right, rgba(30, 177, 209, 0.2), rgba(6, 44, 87, 0.2))"
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.3
                    }}
                  >
                    <ImageIcon size={40} className="text-white/70" />
                  </motion.div>
                </motion.div>

                {/* Effet de brillance au hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700"
                  style={{ width: "50%" }}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}