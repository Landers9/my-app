/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Download, FileText, Image as ImageIcon, User, Calendar, DollarSign,
  Play, Pause, Volume2, ArrowLeft, ExternalLink, Mail, Phone, Globe,
  Eye, Hash, CheckCircle, Clock, AlertCircle, Package, Upload, TestTube2
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { RouteGuard } from "@/components/RouteGuard";
import { ProjectService } from "@/services/projectService";
import { Project } from "@/types/models";
import {
  getStatusConfig,
  formatPrice,
  getFieldTypeIcon,
  formatFieldValue,
  groupFieldsByStep,
  sortFieldsByPosition
} from "@/utils/projectUtils";

export default function ProjectDetailsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Charger les détails du projet
  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!params?.id) return;

      try {
        setIsLoading(true);
        setError(null);
        const response = await ProjectService.getProject(params.id as string);
        setProject(response.data);
      } catch (err: any) {
        console.error('Erreur lors du chargement du projet:', err);
        setError(err?.message || 'Erreur lors du chargement du projet');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectDetails();
  }, [params?.id]);

  const toggleAudio = () => {
    setIsAudioPlaying(!isAudioPlaying);
  };

  // Calculer le progrès basé sur le statut
  const getProgressPercentage = (status: string) => {
    const progressMap: Record<string, number> = {
      'submitted': 15,
      'processing': 30,
      'approved': 50,
      'rejected': 0,
      'in_development': 75,
      'in_testing': 90,
      'completed': 95,
      'achieved': 100
    };
    return progressMap[status] || 0;
  };

  // Timeline basée sur les timestamps du projet
  const getProjectTimeline = (project: Project) => {
    const timeline = [];

    const statusMapping = {
      submitted: { icon: Upload, label: "Projet soumis" },
      processing: { icon: Clock, label: "En traitement" },
      approved: { icon: CheckCircle, label: "Approuvé" },
      rejected: { icon: AlertCircle, label: "Rejeté" },
      in_development: { icon: Package, label: "En développement" },
      in_testing: { icon: TestTube2, label: "En test" },
      completed: { icon: CheckCircle, label: "Terminé" },
      achieved: { icon: CheckCircle, label: "Livré" }
    };

    if (project.submitted_at) {
      timeline.push({
        ...statusMapping.submitted,
        date: new Date(project.submitted_at).toLocaleDateString('fr-FR'),
        status: "completed"
      });
    }

    if (project.processing_at) {
      timeline.push({
        ...statusMapping.processing,
        date: new Date(project.processing_at).toLocaleDateString('fr-FR'),
        status: project.status === 'processing' ? "current" : "completed"
      });
    }

    if (project.approved_at) {
      timeline.push({
        ...statusMapping.approved,
        date: new Date(project.approved_at).toLocaleDateString('fr-FR'),
        status: project.status === 'approved' ? "current" : "completed"
      });
    }

    if (project.rejected_at) {
      timeline.push({
        ...statusMapping.rejected,
        date: new Date(project.rejected_at).toLocaleDateString('fr-FR'),
        status: project.status === 'rejected' ? "current" : "completed"
      });
    }

    if (project.in_development_at) {
      timeline.push({
        ...statusMapping.in_development,
        date: new Date(project.in_development_at).toLocaleDateString('fr-FR'),
        status: project.status === 'in_development' ? "current" : "completed"
      });
    }

    if (project.in_testing_at) {
      timeline.push({
        ...statusMapping.in_testing,
        date: new Date(project.in_testing_at).toLocaleDateString('fr-FR'),
        status: project.status === 'in_testing' ? "current" : "completed"
      });
    }

    if (project.completed_at) {
      timeline.push({
        ...statusMapping.completed,
        date: new Date(project.completed_at).toLocaleDateString('fr-FR'),
        status: project.status === 'completed' ? "current" : "completed"
      });
    }

    if (project.achieved_at) {
      timeline.push({
        ...statusMapping.achieved,
        date: new Date(project.achieved_at).toLocaleDateString('fr-FR'),
        status: project.status === 'achieved' ? "current" : "completed"
      });
    }

    return timeline;
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  if (isLoading) {
    return (
      <RouteGuard>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des détails du projet...</p>
          </div>
        </div>
      </RouteGuard>
    );
  }

  if (error || !project) {
    return (
      <RouteGuard>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={24} className="text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Projet introuvable</h2>
            <p className="text-gray-600 mb-6">{error || "Ce projet n'existe pas ou a été supprimé."}</p>
            <button
              onClick={() => router.push('/dashboard/projects')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retour aux projets
            </button>
          </div>
        </div>
      </RouteGuard>
    );
  }

  const statusConfig = getStatusConfig(project.status);
  const progress = getProgressPercentage(project.status);
  const timeline = getProjectTimeline(project);

  // Organiser les champs par étapes
  const fieldsByStep = groupFieldsByStep(project.fields);
  const sortedSteps = Object.keys(fieldsByStep).map(Number).sort((a, b) => a - b);

  // Séparer les fichiers par type
  const allFiles = project.fields.filter(field => field.files.length > 0);
  const imageFiles = allFiles.filter(field => field.field_type === 'image');
  const documentFiles = allFiles.filter(field => field.field_type === 'file');
  const audioFiles = allFiles.filter(field => field.field_type === 'audio');

  return (
    <RouteGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <motion.div
            className="flex items-center text-sm text-gray-600 mb-8"
            {...fadeInUp}
          >
            <button
              onClick={() => router.push('/dashboard/projects')}
              className="flex items-center hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={16} className="mr-1" />
              Mes projets
            </button>
            <span className="mx-2">{">"}</span>
            <span className="text-gray-900 font-medium">Projet {project.reference}</span>
          </motion.div>

          {/* En-tête du projet */}
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                    {project.company_service.name}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${statusConfig.className}`}>
                    <div className={`w-2 h-2 ${statusConfig.dotColor} rounded-full mr-2`}></div>
                    {statusConfig.label}
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  {project.reference}
                </h1>

                <p className="text-gray-600 leading-relaxed max-w-3xl">
                  {project.company_service.description}
                </p>
              </div>

              {/* Indicateur de progrès */}
              <div className="mt-6 lg:mt-0 lg:ml-8">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="rgb(229 231 235)"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="rgb(37 99 235)"
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${progress * 2.51} 251`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900">{progress}%</div>
                      <div className="text-xs text-gray-500">Avancement</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations client et métriques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-gray-200">
              {/* Client */}
              <div className="flex items-center space-x-3">
                {project.user.avatar && project.user.avatar !== "/tmp/phpJWLz2F" ? (
                  <img
                    src={project.user.avatar}
                    alt={`${project.user.first_name} ${project.user.last_name}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                    {project.user.first_name.charAt(0)}{project.user.last_name?.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">
                    {project.user.first_name} {project.user.last_name}
                  </p>
                  <p className="text-sm text-gray-500">{project.user.email}</p>
                </div>
              </div>

              {/* Budget */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Budget</p>
                  <p className="font-semibold text-gray-900">
                    {project.final_price > 0
                      ? formatPrice(project.final_price)
                      : formatPrice(project.company_service.price)}
                  </p>
                </div>
              </div>

              {/* Date de création */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Créé</p>
                  <p className="font-semibold text-gray-900">{project.created_at_humanized}</p>
                </div>
              </div>

              {/* Entreprise */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <User size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Entreprise</p>
                  <p className="font-semibold text-gray-900">{project.company_service.company.name}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-8">
              {/* Informations saisies par l'utilisateur */}
              {project.fields.length > 0 && (
                <motion.div
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Hash className="mr-3 text-blue-600" size={24} />
                    Informations du projet
                  </h2>

                  <div className="space-y-8">
                    {sortedSteps.map((stepNumber) => {
                      const stepFields = sortFieldsByPosition(fieldsByStep[stepNumber]);

                      return (
                        <div key={stepNumber}>
                          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm mr-3">
                              {stepNumber}
                            </span>
                            Étape {stepNumber}
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {stepFields.map((field) => {
                              const fieldIcon = getFieldTypeIcon(field.field_type);
                              const formattedValue = formatFieldValue(field);

                              return (
                                <div key={field.field_id} className="border border-gray-200 rounded-lg p-4">
                                  <div className="flex items-center space-x-2 mb-3">
                                    <div className={`w-6 h-6 bg-gradient-to-r ${fieldIcon.color} rounded flex items-center justify-center text-xs`}>
                                      {fieldIcon.icon}
                                    </div>
                                    <h4 className="font-medium text-gray-900">
                                      {field.field_label}
                                      {field.is_required && <span className="text-red-500 ml-1">*</span>}
                                    </h4>
                                  </div>

                                  <div className="text-sm">
                                    {field.field_type === 'textarea' ? (
                                      <div className="bg-gray-50 rounded p-3">
                                        <p className="text-gray-700 whitespace-pre-wrap">
                                          {field.value || "Non renseigné"}
                                        </p>
                                      </div>
                                    ) : (field.field_type === 'file' || field.field_type === 'image') ? (
                                      <div className="space-y-2">
                                        {field.files.length > 0 ? (
                                          field.files.map((file, fileIndex) => (
                                            <div key={fileIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                              <div className="flex items-center space-x-2">
                                                <FileText size={16} className="text-gray-400" />
                                                <span className="text-gray-700 text-sm truncate">
                                                  {file.split('/').pop() || file}
                                                </span>
                                              </div>
                                              <button
                                                onClick={() => window.open(file, '_blank')}
                                                className="p-1 hover:bg-gray-200 rounded"
                                              >
                                                <Eye size={14} className="text-blue-600" />
                                              </button>
                                            </div>
                                          ))
                                        ) : (
                                          <p className="text-gray-500 italic">Aucun fichier</p>
                                        )}
                                      </div>
                                    ) : field.field_type === 'email' ? (
                                      <a
                                        href={`mailto:${field.value}`}
                                        className="text-blue-600 hover:text-blue-800 flex items-center"
                                      >
                                        <Mail size={14} className="mr-1" />
                                        {field.value}
                                      </a>
                                    ) : field.field_type === 'phone' ? (
                                      <a
                                        href={`tel:${field.value}`}
                                        className="text-blue-600 hover:text-blue-800 flex items-center"
                                      >
                                        <Phone size={14} className="mr-1" />
                                        {field.value}
                                      </a>
                                    ) : field.field_type === 'url' ? (
                                      <a
                                        href={field.value}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 flex items-center"
                                      >
                                        <Globe size={14} className="mr-1" />
                                        {field.value}
                                        <ExternalLink size={12} className="ml-1" />
                                      </a>
                                    ) : (
                                      <p className="text-gray-700">{formattedValue}</p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Images */}
              {imageFiles.length > 0 && (
                <motion.div
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <ImageIcon className="mr-3 text-green-600" size={24} />
                    Images du projet
                  </h2>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imageFiles.map((field, index) =>
                      field.files.map((file, fileIndex) => (
                        <div key={`${index}-${fileIndex}`} className="relative group">
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={file}
                              alt={field.field_label}
                              className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                              onClick={() => window.open(file, '_blank')}
                            />
                          </div>
                          <p className="text-sm text-gray-600 mt-2 text-center">{field.field_label}</p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}

              {/* Documents */}
              {documentFiles.length > 0 && (
                <motion.div
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <FileText className="mr-3 text-blue-600" size={24} />
                    Documents
                  </h2>

                  <div className="space-y-3">
                    {documentFiles.map((field, index) =>
                      field.files.map((file, fileIndex) => (
                        <div key={`${index}-${fileIndex}`} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <FileText size={20} className="text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{field.field_label}</p>
                              <p className="text-sm text-gray-500">{file.split('/').pop()}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => window.open(file, '_blank')}
                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            <Download size={18} className="text-gray-600" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}

              {/* Audio */}
              {audioFiles.length > 0 && (
                <motion.div
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Volume2 className="mr-3 text-purple-600" size={24} />
                    Messages audio
                  </h2>

                  <div className="space-y-4">
                    {audioFiles.map((field, index) =>
                      field.files.map((file, fileIndex) => (
                        <div key={`${index}-${fileIndex}`} className="p-4 border border-gray-200 rounded-lg">
                          <h3 className="font-medium text-gray-900 mb-3">{field.field_label}</h3>
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={toggleAudio}
                              className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
                            >
                              {isAudioPlaying ? <Pause size={20} /> : <Play size={20} />}
                            </button>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="flex-1 h-2 bg-gray-200 rounded-full">
                                  <div className="h-2 bg-purple-600 rounded-full" style={{ width: '35%' }}></div>
                                </div>
                                <span className="text-sm text-gray-600">2:34</span>
                              </div>
                              <p className="text-sm text-gray-600">{file.split('/').pop()}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Timeline */}
              <motion.div
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Timeline</h2>

                <div className="space-y-4">
                  {timeline.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        item.status === 'completed' ? 'bg-green-100 text-green-600' :
                        item.status === 'current' ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-100 text-gray-400'
                      }`}>
                        <item.icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium ${
                          item.status === 'upcoming' ? 'text-gray-500' : 'text-gray-900'
                        }`}>
                          {item.label}
                        </p>
                        <p className="text-sm text-gray-500">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Barre de progression */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progression</span>
                    <span className="text-sm font-medium text-blue-600">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </motion.div>

              {/* Informations entreprise */}
              <motion.div
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Entreprise</h2>

                <div className="space-y-4">
                  {project.company_service.company.logo && (
                    <img
                      src={project.company_service.company.logo}
                      alt={project.company_service.company.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {project.company_service.company.name}
                    </h3>
                    {project.company_service.company.slogan && (
                      <p className="text-sm text-gray-600 italic mt-1">
                        {project.company_service.company.slogan}
                      </p>
                    )}
                  </div>

                  {project.company_service.company.description && (
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {project.company_service.company.description}
                    </p>
                  )}

                  <div className="space-y-2">
                    {project.company_service.company.email && (
                      <a
                        href={`mailto:${project.company_service.company.email}`}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Mail size={14} className="mr-2" />
                        {project.company_service.company.email}
                      </a>
                    )}

                    {project.company_service.company.phone && (
                      <a
                        href={`tel:${project.company_service.company.phone}`}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Phone size={14} className="mr-2" />
                        {project.company_service.company.phone}
                      </a>
                    )}

                    {project.company_service.company.website && (
                      <a
                        href={project.company_service.company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Globe size={14} className="mr-2" />
                        Site web
                        <ExternalLink size={12} className="ml-1" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Facture */}
              {project.invoice_file_path && (
                <motion.div
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Facture</h2>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <FileText size={20} className="text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Facture du projet</p>
                        <p className="text-sm text-gray-500">Document PDF</p>
                      </div>
                    </div>
                    <a
                      href={project.invoice_file_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Download size={18} className="text-gray-600" />
                    </a>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}