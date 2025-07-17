/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Download, FileText, Image as ImageIcon, User, Calendar, DollarSign, Play, Pause, Volume2, Zap, Target, Smartphone, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Project, ProjectStatus } from "@/types/models";
import { ProjectService } from "@/services/projectService";
import { getStatusConfig, formatPrice, getFieldTypeIcon, formatFieldValue, groupFieldsByStep, sortFieldsByPosition } from "@/utils/projectUtils";

// Types pour les données locales
interface ProjectDocument {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'xlsx' | 'image';
  size: string;
  uploadDate: string;
  url?: string;
}

export default function ProjectDetailsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);

        if (params?.id) {
          console.log('Fetching project with ID:', params.id);
          const response = await ProjectService.getProject(params.id as string);
          console.log('Project response:', response);
          setProject(response.data);
        } else {
          setError('ID du projet manquant');
        }
      } catch (err: any) {
        console.error('Error fetching project:', err);
        setError(err?.message || 'Erreur lors du chargement du projet');
      } finally {
        setLoading(false);
        setIsLoaded(true);
      }
    };

    if (params?.id) {
      fetchProject();
    }
  }, [params?.id]);

  // Timeline basée sur le statut et les timestamps
  const getTimelineData = () => {
    if (!project) return [];

    type TimelineStatus = "completed" | "current" | "upcoming" | "rejected";

    const getStatusForStep = (stepDate: string | null, stepStatus: string): TimelineStatus => {
      if (stepDate) return "completed";
      if (project.status === stepStatus) return "current";
      return "upcoming";
    };

    const timeline = [
      {
        title: "Projet soumis",
        date: project.submitted_at || project.created_at,
        status: "completed" as TimelineStatus
      },
      {
        title: "En traitement",
        date: project.processing_at,
        status: getStatusForStep(project.processing_at, 'processing')
      },
      {
        title: "Approuvé",
        date: project.approved_at,
        status: getStatusForStep(project.approved_at, 'approved')
      },
      {
        title: "En développement",
        date: project.in_development_at,
        status: getStatusForStep(project.in_development_at, 'in_development')
      },
      {
        title: "En test",
        date: project.in_testing_at,
        status: getStatusForStep(project.in_testing_at, 'in_testing')
      },
      {
        title: "Terminé",
        date: project.completed_at,
        status: getStatusForStep(project.completed_at, 'completed')
      },
      {
        title: "Livré",
        date: project.achieved_at,
        status: getStatusForStep(project.achieved_at, 'achieved')
      }
    ];

    // Filtrer les étapes non pertinentes pour certains statuts
    if (project.status === 'rejected') {
      return timeline.slice(0, 3).concat([{
        title: "Rejeté",
        date: project.rejected_at,
        status: "rejected" as TimelineStatus
      }]);
    }

    return timeline.filter(item => item.title !== "Approuvé" || !['submitted', 'processing'].includes(project.status));
  };

  // Calculer le progrès basé sur le statut
  const getProgress = (): number => {
    if (!project) return 0;

    const progressMap: Record<ProjectStatus, number> = {
      submitted: 10,
      processing: 20,
      approved: 35,
      rejected: 0,
      in_development: 60,
      in_testing: 80,
      completed: 95,
      achieved: 100
    };

    return progressMap[project.status] || 0;
  };

  // Grouper les champs par étapes
  const getFieldsBySteps = () => {
    if (!project?.fields) return {};
    try {
      return groupFieldsByStep(sortFieldsByPosition(project.fields));
    } catch (err) {
      console.error('Error grouping fields:', err);
      return {};
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-[#1EB1D1] border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600">Chargement du projet...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <XCircle size={64} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-[#1EB1D1] text-white rounded-lg hover:bg-[#17a2b8] transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle size={64} className="text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Projet non trouvé</h2>
          <p className="text-gray-600 mb-4">Le projet demandé n'existe pas ou n'est plus disponible.</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-[#1EB1D1] text-white rounded-lg hover:bg-[#17a2b8] transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  // Calculer les valeurs nécessaires
  const statusConfig = getStatusConfig(project.status);
  const progress = getProgress();
  const timelineData = getTimelineData();
  const fieldsBySteps = getFieldsBySteps();

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
        {/* Breadcrumb */}
        <motion.div variants={itemVariants} className="flex items-center text-sm text-gray-600">
          <button
            onClick={() => router.back()}
            className="flex items-center hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Mes projets
          </button>
          <span className="mx-2">{">"}</span>
          <span className="text-gray-900 font-medium">Projet {project.reference}</span>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-lg backdrop-blur-xl bg-gradient-to-r from-white/40 to-white/20 border border-white/30"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
        >
          {/* Background Pattern */}
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
              {/* Info principale */}
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
                      className={`px-3 py-1 text-xs font-medium ${statusConfig.className} rounded-full border`}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {statusConfig.label}
                    </motion.span>
                    <motion.span
                      className="text-gray-600 text-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      {project.company_service.company.name}
                    </motion.span>
                  </motion.div>

                  <motion.h1
                    className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#062C57] to-[#1EB1D1] bg-clip-text text-transparent mb-4"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    {project.company_service.name}
                  </motion.h1>

                  <motion.p
                    className="text-gray-700 text-lg leading-relaxed mb-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                  >
                    {project.company_service.description || "Projet en développement selon les spécifications fournies."}
                  </motion.p>

                  {/* Client info */}
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
                      {`${project.user.first_name?.charAt(0) || ''}${project.user.last_name?.charAt(0) || ''}`.toUpperCase()}
                    </motion.div>
                    <div>
                      <motion.p
                        className="font-semibold text-gray-800"
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.1 }}
                      >
                        {`${project.user.first_name} ${project.user.last_name || ''}`.trim()}
                      </motion.p>
                      <motion.p
                        className="text-gray-600 text-sm"
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.2 }}
                      >
                        {project.user.email}
                      </motion.p>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Stats circulaires */}
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
                  {/* Cercle de progression */}
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
                      strokeDasharray={`${progress * 2.51} 251`}
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
                        {progress}%
                      </motion.div>
                      <div className="text-sm text-gray-600">Progrès</div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>

            {/* Métriques en bas */}
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
                {
                  icon: DollarSign,
                  label: "Prix final",
                  value: formatPrice(project.final_price),
                  color: "from-green-400 to-emerald-500"
                },
                {
                  icon: Calendar,
                  label: "Créé le",
                  value: new Date(project.created_at).toLocaleDateString('fr-FR'),
                  color: "from-blue-400 to-cyan-500"
                },
                {
                  icon: Clock,
                  label: "Référence",
                  value: project.reference,
                  color: "from-purple-400 to-violet-500"
                },
                {
                  icon: User,
                  label: "Service",
                  value: project.company_service.name.length > 20 ?
                    project.company_service.name.substring(0, 20) + '...' :
                    project.company_service.name,
                  color: "from-orange-400 to-red-500"
                }
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
                    title={item.value}
                  >
                    {item.value}
                  </motion.p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Informations du projet - Champs par étapes */}
        {Object.keys(fieldsBySteps).length > 0 && Object.entries(fieldsBySteps).map(([step, fields]) => (
          <motion.div
            key={step}
            variants={itemVariants}
            className="backdrop-blur-xl bg-white/30 rounded-3xl p-8 border border-white/30"
          >
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
              Étape {step} - Informations du projet
            </motion.h2>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
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
              {fields.map((field, index) => {
                const fieldIcon = getFieldTypeIcon(field.field_type);

                // Le champ description prend toute la largeur
                const isDescriptionField = field.field_label.toLowerCase().includes('description') &&
                                          field.field_type === 'textarea';

                return (
                  <motion.div
                    key={field.field_id}
                    className={`p-6 backdrop-blur-md bg-white/40 rounded-2xl border border-white/40 hover:bg-white/60 transition-all duration-300 group ${
                      isDescriptionField || ['files_image', 'files_audio', 'files_document'].includes(field.field_type) ? 'md:col-span-2' : ''
                    }`}
                    variants={{
                      hidden: { y: 30, opacity: 0 },
                      visible: { y: 0, opacity: 1 }
                    }}
                    whileHover={{ y: -2, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-start space-x-4 mb-4">
                      <motion.div
                        className={`w-12 h-12 bg-gradient-to-br ${fieldIcon.color} rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0`}
                        animate={{
                          rotate: [0, 5, -5, 0],
                          scale: [1, 1.05, 1]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.2
                        }}
                      >
                        {fieldIcon.icon}
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <motion.h3
                          className="font-semibold text-gray-900 group-hover:text-[#062C57] transition-colors mb-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                        >
                          {field.field_label}
                          {field.is_required && <span className="text-red-500 ml-1">*</span>}
                        </motion.h3>

                        {/* Contenu selon le type de field */}
                        {field.field_type === 'files_image' && field.files && field.files.length > 0 ? (
                          <motion.div
                            className="grid grid-cols-2 gap-3 mt-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                          >
                            {field.files.map((file, fileIndex) => (
                              <motion.div
                                key={fileIndex}
                                className="aspect-square rounded-xl overflow-hidden cursor-pointer group/img relative bg-gradient-to-br from-gray-200 to-gray-300"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                onClick={() => {
                                  // Modal d'agrandissement
                                  const modal = document.createElement('div');
                                  modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4';
                                  modal.innerHTML = `
                                    <div class="relative max-w-4xl max-h-full">
                                      <img src="${file}" alt="${field.field_label}" class="max-w-full max-h-full object-contain rounded-lg" />
                                      <button class="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors" onclick="this.parentElement.parentElement.remove()">
                                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                      </button>
                                      <div class="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-md rounded-lg p-3">
                                        <p class="text-white font-medium">${field.field_label}</p>
                                        <p class="text-white/70 text-sm">${file.split('/').pop()}</p>
                                      </div>
                                    </div>
                                  `;
                                  modal.onclick = (e) => {
                                    if (e.target === modal) modal.remove();
                                  };
                                  document.body.appendChild(modal);
                                }}
                              >
                                <img
                                  src={file}
                                  alt={field.field_label}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent) {
                                      parent.innerHTML = `
                                        <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1EB1D1]/20 to-[#062C57]/20">
                                          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="text-white/70">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                          </svg>
                                        </div>
                                      `;
                                    }
                                  }}
                                />
                                {/* Icône d'agrandissement */}
                                <motion.div
                                  className="absolute top-2 right-2 w-6 h-6 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-300"
                                  whileHover={{ scale: 1.1 }}
                                >
                                  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
                                  </svg>
                                </motion.div>
                              </motion.div>
                            ))}
                          </motion.div>
                        ) : field.field_type === 'files_audio' && field.files && field.files.length > 0 ? (
                          <motion.div
                            className="space-y-3 mt-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                          >
                            {field.files.map((file, fileIndex) => (
                              <motion.div
                                key={fileIndex}
                                className="p-4 bg-gradient-to-r from-[#1EB1D1]/10 to-[#062C57]/10 rounded-xl border border-white/40"
                              >
                                <div className="flex items-center space-x-4">
                                  <motion.button
                                    onClick={() => {
                                      const audio = new Audio(file);
                                      audio.play().catch(console.error);
                                    }}
                                    className="w-12 h-12 bg-gradient-to-br from-[#1EB1D1] to-[#062C57] rounded-full flex items-center justify-center text-white"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <Play size={16} />
                                  </motion.button>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800">
                                      {file.split('/').pop()}
                                    </p>
                                  </div>
                                </div>
                                {/* Mini visualiseur audio */}
                                <motion.div
                                  className="flex items-center justify-center space-x-1 mt-3"
                                >
                                  {[...Array(8)].map((_, i) => (
                                    <motion.div
                                      key={i}
                                      className="w-1 bg-gradient-to-t from-[#1EB1D1] to-[#062C57] rounded-full"
                                      style={{ height: Math.random() * 20 + 8 }}
                                      animate={{
                                        scaleY: [1, 0.3, 1]
                                      }}
                                      transition={{
                                        duration: 0.5 + Math.random() * 0.5,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: i * 0.1
                                      }}
                                    />
                                  ))}
                                </motion.div>
                              </motion.div>
                            ))}
                          </motion.div>
                        ) : field.field_type === 'files_document' && field.files && field.files.length > 0 ? (
                          <motion.div
                            className="space-y-3 mt-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                          >
                            {field.files.map((file, fileIndex) => {
                              const fileExtension = file.split('.').pop()?.toLowerCase();
                              let docType: 'pdf' | 'doc' | 'xlsx' | 'image' = 'doc';

                              if (fileExtension === 'pdf') {
                                docType = 'pdf';
                              } else if (['xlsx', 'xls'].includes(fileExtension || '')) {
                                docType = 'xlsx';
                              }

                              return (
                                <motion.div
                                  key={fileIndex}
                                  className="flex items-center p-3 backdrop-blur-md bg-white/40 rounded-xl border border-white/40 hover:bg-white/60 transition-all duration-300 cursor-pointer group/doc"
                                  whileHover={{ x: 3 }}
                                  onClick={() => window.open(file, '_blank')}
                                >
                                  <div className="flex items-center space-x-3 flex-1">
                                    {getDocumentIcon(docType)}
                                    <div>
                                      <p className="font-medium text-gray-900 group-hover/doc:text-[#062C57] transition-colors text-sm">
                                        {file.split('/').pop()}
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        Cliquez pour télécharger
                                      </p>
                                    </div>
                                  </div>
                                  <motion.div
                                    className="opacity-0 group-hover/doc:opacity-100 transition-opacity"
                                    whileHover={{ scale: 1.1 }}
                                  >
                                    <Download size={16} className="text-[#1EB1D1]" />
                                  </motion.div>
                                </motion.div>
                              );
                            })}
                          </motion.div>
                        ) : (
                          <motion.div
                            className={`text-gray-700 break-words ${
                              isDescriptionField ? 'text-lg leading-relaxed' : ''
                            }`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                          >
                            <span>{formatFieldValue(field)}</span>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        ))}

        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timeline moderne */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-3 backdrop-blur-xl bg-white/30 rounded-3xl p-8 border border-white/30"
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
              Timeline du projet
            </motion.h3>

            <motion.div
              className="flex flex-wrap gap-8 justify-center"
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
              {timelineData.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-4 p-4 backdrop-blur-md bg-white/40 rounded-2xl border border-white/40"
                  variants={{
                    hidden: { y: 30, opacity: 0 },
                    visible: { y: 0, opacity: 1 }
                  }}
                  whileHover={{ y: -2, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className={`w-4 h-4 rounded-full ${
                      item.status === 'completed' ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                      item.status === 'current' ? 'bg-gradient-to-r from-[#1EB1D1] to-[#062C57]' :
                      item.status === 'rejected' ? 'bg-gradient-to-r from-red-400 to-red-500' :
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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <p className={`font-medium ${
                      item.status === 'upcoming' ? 'text-gray-500' :
                      item.status === 'rejected' ? 'text-red-600' :
                      'text-gray-800'
                    }`}>
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {item.date ? new Date(item.date).toLocaleDateString('fr-FR') : '--'}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Actions rapides */}
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
            Actions rapides
          </motion.h3>
          <motion.div
            className="flex flex-wrap gap-4"
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
            {[
              {
                label: "Contacter le client",
                icon: User,
                color: "from-blue-400 to-cyan-500",
                action: () => window.location.href = `mailto:${project.user.email}`
              },
              {
                label: "Télécharger facture",
                icon: Download,
                color: "from-green-400 to-emerald-500",
                action: () => project.invoice_file_path && window.open(project.invoice_file_path, '_blank'),
                disabled: !project.invoice_file_path
              },
              {
                label: "Voir l'entreprise",
                icon: Target,
                color: "from-purple-400 to-violet-500",
                action: () => window.open(`/companies/${project.company_service.company.slug}`, '_blank')
              }
            ].map((action, index) => (
              <motion.button
                key={index}
                className={`flex items-center space-x-3 px-6 py-4 backdrop-blur-md bg-white/40 rounded-2xl border border-white/40 hover:bg-white/60 transition-all duration-300 ${action.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                variants={{
                  hidden: { x: -30, opacity: 0 },
                  visible: { x: 0, opacity: 1 }
                }}
                whileHover={!action.disabled ? { scale: 1.05, y: -2 } : {}}
                whileTap={!action.disabled ? { scale: 0.98 } : {}}
                onClick={!action.disabled ? action.action : undefined}
                disabled={action.disabled}
              >
                <motion.div
                  className={`w-10 h-10 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center`}
                  animate={!action.disabled ? {
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  } : {}}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.5
                  }}
                >
                  <action.icon size={20} className="text-white" />
                </motion.div>
                <span className="font-medium text-gray-800">{action.label}</span>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}