/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

// Imports des hooks et services
import { useCompany } from '@/hooks/useCompany';
import { useFormFields } from '@/hooks/useFormFields';
import { useProject } from '@/hooks/useProject';
import { CompanyService } from '@/services/companyService';
import { FormData, ProjectRequest, ProjectField } from '@/types/models';

// Composant pour l'enregistrement audio
const AudioRecorder = dynamic(() => import("@/components/AudioRecorder"), {
  ssr: false,
  loading: () => (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      Chargement de l'enregistreur audio...
    </motion.p>
  ),
});

// Animations variants (gardées identiques)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
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

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 10
    }
  },
  hover: {
    scale: 1.05,
    boxShadow: "0 5px 10px rgba(0, 0, 0, 0.1)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  tap: { scale: 0.98 }
};

const stepIndicatorVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15,
      delayChildren: 0.1,
      staggerChildren: 0.1
    }
  }
};

const indicatorItemVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

const pageTransition = {
  initial: { opacity: 0, x: 100 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  exit: {
    opacity: 0,
    x: -100,
    transition: {
      duration: 0.2
    }
  }
};

export default function ServiceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<FormData>({});
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [totalSteps, setTotalSteps] = useState<number>(4);
  const [isLoaded, setIsLoaded] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // Récupérer l'ID de company depuis les paramètres URL
  const companyId = searchParams.get('company') || "0197e484-612e-7b7f-ac64-abff96823798";

  // Hooks pour récupérer les données
  const { company, services, isLoading: companyLoading } = useCompany(companyId);
  const { formFields, isLoading: fieldsLoading, getFieldsByStep } = useFormFields(
    formData.company_service_id as string || ''
  );
  const { createProject, isSubmitting } = useProject();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Calculer le nombre total d'étapes basé sur les champs
  useEffect(() => {
    if (formFields.length > 0) {
      const maxStep = Math.max(...formFields.map(field => field.step || 1), 0);
      setTotalSteps(maxStep + 1);
    }
  }, [formFields]);

  // Gestion des changements de champs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      const currentValues = formData[name] as string[] || [];
      let newValues: string[];

      if (checked) {
        newValues = [...currentValues, value];
      } else {
        newValues = currentValues.filter(val => val !== value);
      }

      setFormData(prev => ({ ...prev, [name]: newValues }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Gestion de l'enregistrement audio
  const handleAudioChange = (audioBlob: Blob | null) => {
    setFormData(prev => ({ ...prev, audio_message: audioBlob }));
  };

  // Gestion des fichiers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files) {
      const existingFiles = formData[fieldName] as File[] || [];
      const newFiles = Array.from(e.target.files);
      const allFiles = [...existingFiles, ...newFiles];
      setFormData(prev => ({ ...prev, [fieldName]: allFiles }));
    }
  };

  // Suppression d'un fichier
  const handleRemoveFile = (fieldName: string, indexToRemove: number) => {
    const currentFiles = formData[fieldName] as File[] || [];
    const updatedFiles = currentFiles.filter((_, index) => index !== indexToRemove);
    setFormData(prev => ({ ...prev, [fieldName]: updatedFiles }));
  };

  // Navigation entre les étapes
  const goToNextStep = () => {
    if (currentStep === 0) {
      if (!formData.company_service_id) {
        alert("Veuillez sélectionner un service avant de continuer.");
        return;
      }
      setCurrentStep(1);
      return;
    }

    // Valider les champs de l'étape actuelle
    const currentStepFields = getFieldsByStep(currentStep);
    let isValid = true;

    for (const field of currentStepFields) {
      if (field.is_required && !formData[field.name]) {
        isValid = false;
        break;
      }
    }

    if (isValid) {
      const nextStep = Math.min(currentStep + 1, totalSteps - 1);
      setCurrentStep(nextStep);
      if (formRef.current) {
        formRef.current.scrollTop = 0;
      }
    } else {
      alert("Veuillez remplir tous les champs obligatoires avant de continuer.");
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    if (formRef.current) {
      formRef.current.scrollTop = 0;
    }
  };

  // Soumission du formulaire
  const handleSubmitButtonClick = async () => {
    try {
      // Préparer les données selon le format attendu par l'API
      const projectFields: ProjectField[] = formFields.map(field => {
        let value = '';
        let file: string | File | Blob = '';

        const fieldValue = formData[field.name];

        // Gestion spéciale pour les champs audio
        if (field.form_field_enumeration?.name === 'files_audio') {
          if (formData.audio_message instanceof Blob) {
            file = formData.audio_message;
          }
        }
        // Gestion des fichiers uploadés
        else if ((field.form_field_enumeration?.name === 'files_document' || field.form_field_enumeration?.name === 'files_image') && Array.isArray(fieldValue)) {
          if (fieldValue.length > 0 && fieldValue[0] instanceof File) {
            file = fieldValue[0];
          }
        }
        // Gestion des valeurs textuelles et arrays
        else if (Array.isArray(fieldValue)) {
          value = fieldValue.join(',');
        } else if (fieldValue !== null && fieldValue !== undefined) {
          value = String(fieldValue);
        }

        return {
          field_id: field.id,
          value,
          file
        };
      });

      const projectData: ProjectRequest = {
        company_service_id: formData.company_service_id as string,
        fields: projectFields
      };

      await createProject(projectData);
      router.push("/confirmation");
    } catch (error) {
      alert("Erreur lors de la création du projet. Veuillez réessayer.");
    }
  };

  // Classes CSS
  const inputClass = "w-full p-3 bg-gray-200 text-gray-700 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-[#062C57]";
  const labelClass = "mb-1 text-sm text-gray-700";

  // Fonction utilitaire pour parser les options
  const parseOptions = (options: any): string[] => {
    if (!options) return [];
    if (Array.isArray(options)) return options;
    if (typeof options === 'string') {
      try {
        const parsed = JSON.parse(options);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  // Rendu des champs pour l'étape courante
  const renderCurrentStepFields = () => {
    // Step 0: Sélection du service
    if (currentStep === 0) {
      return (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          className="space-y-4"
        >
          <div className={labelClass}>Choisissez un service</div>
          <select
            name="company_service_id"
            value={formData.company_service_id as string || ""}
            onChange={handleChange}
            className={inputClass}
            required
          >
            <option value="">-- Sélectionnez un service --</option>
            {(services || [])
              .filter(service => CompanyService.isServiceActive(service))
              .map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} {service.price && `(${CompanyService.formatPrice(service.price)})`}
              </option>
            ))}
          </select>

          {/* Afficher les détails du service sélectionné */}
          {formData.company_service_id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 p-4 bg-gray-100 rounded-md"
            >
              {(() => {
                const selectedService = (services || []).find(s => s.id === formData.company_service_id);
                return selectedService ? (
                  <div>
                    <h3 className="font-semibold text-[#062C57]">{selectedService.name}</h3>
                    <p className="text-gray-600 mt-1">{selectedService.description}</p>
                    {selectedService.price && (
                      <p className="text-[#1EB1D1] font-semibold mt-2">
                        Prix: {CompanyService.formatPrice(selectedService.price)}
                      </p>
                    )}
                  </div>
                ) : null;
              })()}
            </motion.div>
          )}
        </motion.div>
      );
    }

    // Autres steps: afficher les champs correspondants
    if (fieldsLoading) {
      return (
        <motion.div
          className="flex justify-center items-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1EB1D1] mx-auto"></div>
            <p className="mt-2 text-gray-600">Chargement des champs...</p>
          </div>
        </motion.div>
      );
    }

    const currentStepFields = getFieldsByStep(currentStep);

    if (currentStepFields.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-gray-500"
        >
          Aucun champ disponible pour cette étape.
        </motion.div>
      );
    }

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="space-y-6"
      >
        {currentStepFields.map((field, index) => {
          const fieldOptions = parseOptions(field.options);
          const fieldType = field.form_field_enumeration?.name;

          return (
            <motion.div
              key={field.id}
              variants={itemVariants}
              custom={index}
              className="mb-4"
            >
              <div className={labelClass}>
                {field.label} {field.is_required && <span className="text-red-500">*</span>}
              </div>

              {/* Champ texte */}
              {fieldType === "text" && (
                <input
                  type="text"
                  name={field.name}
                  value={formData[field.name] as string || ""}
                  onChange={handleChange}
                  placeholder={field.label}
                  className={inputClass}
                  required={field.is_required}
                />
              )}

              {/* Champ email */}
              {fieldType === "email" && (
                <input
                  type="email"
                  name={field.name}
                  value={formData[field.name] as string || ""}
                  onChange={handleChange}
                  placeholder={field.label}
                  className={inputClass}
                  required={field.is_required}
                />
              )}

              {/* Champ textarea */}
              {fieldType === "textarea" && (
                <textarea
                  name={field.name}
                  value={formData[field.name] as string || ""}
                  onChange={handleChange}
                  placeholder={field.label}
                  className={`${inputClass} min-h-32 resize-vertical`}
                  required={field.is_required}
                />
              )}

              {/* Champ number */}
              {fieldType === "number" && (
                <input
                  type="number"
                  name={field.name}
                  value={formData[field.name] as string || ""}
                  onChange={handleChange}
                  placeholder={field.label}
                  className={inputClass}
                  required={field.is_required}
                />
              )}

              {/* Champ date */}
              {fieldType === "date" && (
                <input
                  type="date"
                  name={field.name}
                  value={formData[field.name] as string || ""}
                  onChange={handleChange}
                  className={inputClass}
                  required={field.is_required}
                />
              )}

              {/* Champ select */}
              {fieldType === "select" && fieldOptions.length > 0 && (
                <select
                  name={field.name}
                  value={formData[field.name] as string || ""}
                  onChange={handleChange}
                  className={inputClass}
                  required={field.is_required}
                >
                  <option value="">-- Sélectionnez une option --</option>
                  {fieldOptions.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}

              {/* Champ checkbox */}
              {fieldType === "checkbox" && fieldOptions.length > 0 && (
                <div className="space-y-2 bg-gray-200 p-3 rounded-md">
                  {fieldOptions.map((option, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-center"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <input
                        type="checkbox"
                        id={`${field.name}-${idx}`}
                        name={field.name}
                        value={option}
                        checked={(formData[field.name] as string[] || []).includes(option)}
                        onChange={handleChange}
                        className="mr-2 focus:ring-[#062C57]"
                      />
                      <label htmlFor={`${field.name}-${idx}`} className="text-gray-700">
                        {option}
                      </label>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Champ radio */}
              {fieldType === "radio" && fieldOptions.length > 0 && (
                <div className="space-y-2 bg-gray-200 p-3 rounded-md">
                  {fieldOptions.map((option, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-center"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <input
                        type="radio"
                        id={`${field.name}-${idx}`}
                        name={field.name}
                        value={option}
                        checked={(formData[field.name] as string) === option}
                        onChange={handleChange}
                        className="mr-2 focus:ring-[#062C57]"
                        required={field.is_required}
                      />
                      <label htmlFor={`${field.name}-${idx}`} className="text-gray-700">
                        {option}
                      </label>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Champ fichiers documents */}
              {fieldType === "files_document" && (
                <div>
                  <input
                    type="file"
                    name={field.name}
                    onChange={(e) => handleFileChange(e, field.name)}
                    multiple
                    accept=".pdf,.doc,.docx,.txt,.rtf,.xls,.xlsx,.ppt,.pptx"
                    className={`${inputClass} file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-[#1EB1D1] file:text-white hover:file:bg-[#062C57] file:cursor-pointer`}
                    required={field.is_required}
                  />
                  {formData[field.name] && (formData[field.name] as File[]).length > 0 && (
                    <motion.div
                      className="mt-2 bg-gray-100 p-3 rounded-md"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-sm font-semibold text-gray-700">
                        Documents sélectionnés ({(formData[field.name] as File[]).length}):
                      </p>
                      <ul className="mt-2 max-h-40 overflow-y-auto">
                        {(formData[field.name] as File[]).map((file, idx) => (
                          <motion.li
                            key={idx}
                            className="flex justify-between items-center py-1 border-b border-gray-200 last:border-0"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <div className="text-sm text-gray-700 truncate max-w-[80%]">
                              📄 {file.name} ({(file.size / 1024).toFixed(1)} KB)
                            </div>
                            <motion.button
                              type="button"
                              onClick={() => handleRemoveFile(field.name, idx)}
                              className="text-red-500 hover:text-red-700 text-sm p-1"
                              title="Supprimer ce fichier"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              ✕
                            </motion.button>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Champ fichiers images */}
              {fieldType === "files_image" && (
                <div>
                  <input
                    type="file"
                    name={field.name}
                    onChange={(e) => handleFileChange(e, field.name)}
                    multiple
                    accept="image/*"
                    className={`${inputClass} file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-[#1EB1D1] file:text-white hover:file:bg-[#062C57] file:cursor-pointer`}
                    required={field.is_required}
                  />
                  {formData[field.name] && (formData[field.name] as File[]).length > 0 && (
                    <motion.div
                      className="mt-2 bg-gray-100 p-3 rounded-md"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-sm font-semibold text-gray-700">
                        Images sélectionnées ({(formData[field.name] as File[]).length}):
                      </p>
                      <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                        {(formData[field.name] as File[]).map((file, idx) => (
                          <motion.div
                            key={idx}
                            className="relative group"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <div className="aspect-square bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-600 p-2">
                              🖼️ {file.name.length > 15 ? file.name.substring(0, 15) + '...' : file.name}
                            </div>
                            <motion.button
                              type="button"
                              onClick={() => handleRemoveFile(field.name, idx)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Supprimer cette image"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              ✕
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Champ enregistrement audio */}
              {fieldType === "files_audio" && (
                <div>
                  <AudioRecorder onChange={handleAudioChange} />
                  {formData.audio_message && (
                    <motion.div
                      className="mt-2 p-2 bg-green-100 rounded-md"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <p className="text-sm text-green-700">✅ Message vocal enregistré</p>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Affichage d'erreur pour les types non supportés */}
              {!['text', 'email', 'textarea', 'number', 'date', 'select', 'checkbox', 'radio', 'files_document', 'files_image', 'files_audio'].includes(fieldType || '') && (
                <div className="text-red-500 text-sm">
                  Type de champ non supporté: {fieldType}
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    );
  };

  // Rendu des boutons de navigation
  const renderNavigationButtons = () => {
    const isLastStep = currentStep === totalSteps - 1;

    return (
      <motion.div
        className="flex justify-between mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {currentStep > 0 && (
          <motion.button
            type="button"
            onClick={goToPreviousStep}
            className="h-12 w-12 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
            aria-label="Précédent"
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-700"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </motion.button>
        )}

        {!isLastStep ? (
          <motion.button
            type="button"
            onClick={goToNextStep}
            className={`ml-auto h-12 w-12 rounded-full flex items-center justify-center transition-colors ${
              (currentStep === 0 && !formData.company_service_id)
                ? 'bg-gray-200 cursor-not-allowed'
                : 'bg-[#1EB1D1] hover:bg-[#062C57]'
            }`}
            disabled={currentStep === 0 && !formData.company_service_id}
            aria-label="Suivant"
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </motion.button>
        ) : (
          <motion.button
            type="button"
            disabled={isSubmitting}
            className="ml-auto px-6 py-2 bg-[#1EB1D1] text-white rounded-md hover:bg-[#062C57] transition flex items-center"
            onClick={handleSubmitButtonClick}
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Création du projet...
              </span>
            ) : (
              "Créer mon projet"
            )}
          </motion.button>
        )}
      </motion.div>
    );
  };

  // Indicateur d'étapes
  const renderStepIndicator = () => {
    return (
      <motion.div
        className="flex justify-center mb-8"
        variants={stepIndicatorVariants}
        initial="hidden"
        animate="visible"
      >
        {Array.from({ length: totalSteps }).map((_, index) => (
          <motion.div
            key={index}
            className="flex items-center"
            variants={indicatorItemVariants}
          >
            <motion.div
              className={`relative w-10 h-10 rounded-full flex items-center justify-center ${
                index < currentStep
                  ? 'bg-[#062C57] text-white'
                  : index === currentStep
                    ? 'bg-[#1EB1D1] text-white'
                    : 'bg-gray-200 text-gray-700'
              }`}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {index + 1}
            </motion.div>
            {index < totalSteps - 1 && (
              <motion.div
                className={`h-1 w-8 ${
                  index < currentStep ? 'bg-[#062C57]' : 'bg-gray-200'
                }`}
                initial={{ width: 0 }}
                animate={{ width: "32px" }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
              ></motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white overflow-hidden">
      {/* Image de gauche - utilise l'image de couverture de la company */}
      <div className="hidden md:block md:w-1/2 relative">
        <motion.div
          className="fixed w-1/2 h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src={company?.cover_image || "/images/welcome.jpg"}
            alt={company?.name || "Image de couverture"}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 0.5, duration: 1.5 }}
          />
        </motion.div>
      </div>

      {/* Image mobile - utilise aussi l'image de couverture de la company */}
      <div className="md:hidden w-full h-48 relative">
        <Image
          src={company?.cover_image || "/images/welcome.jpg"}
          alt={company?.name || "Image de couverture"}
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      {/* Formulaire à droite */}
      <motion.div
        ref={formRef}
        className="w-full md:w-1/2 flex flex-col p-8 overflow-y-auto"
        style={{ maxHeight: "100vh" }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Logo de la company */}
        <motion.div
          className="mb-6 self-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.5,
            type: "spring",
            stiffness: 200
          }}
        >
          <Image
            src={company?.logo || "/images/logo_mts.png"}
            alt={company?.name || "Logo"}
            width={180}
            height={40}
            className="object-contain"
          />
        </motion.div>

        <motion.h1
          className="text-2xl font-bold mb-4 text-center text-[#062C57]"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Créez votre projet
        </motion.h1>

        {/* Indicateur d'étapes */}
        {renderStepIndicator()}

        <div className="flex-1 flex flex-col">
          {/* Titre de l'étape actuelle */}
          <AnimatePresence mode="wait">
            <motion.h2
              key={`step-title-${currentStep}`}
              className="text-xl mb-4 text-[#062C57]"
              variants={pageTransition}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {currentStep === 0 && "Sélectionnez votre service"}
              {currentStep === 1 && "Vos informations personnelles"}
              {currentStep === 2 && "Détails de votre projet"}
              {currentStep === 3 && "Fichiers et médias"}
            </motion.h2>
          </AnimatePresence>

          {/* Contenu de l'étape */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`step-content-${currentStep}`}
              className="flex-1"
              variants={pageTransition}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {renderCurrentStepFields()}
            </motion.div>
          </AnimatePresence>

          {/* Boutons de navigation */}
          {renderNavigationButtons()}
        </div>
      </motion.div>
    </div>
  );
}