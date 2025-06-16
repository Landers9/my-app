/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

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

// Définition des types
type FormField = {
  id: string;
  label: string;
  name: string;
  type: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'checkbox' | 'radio' | 'audio' | 'files';
  options?: string;
  is_required: boolean;
  order: number;
  step?: number; // Ajout d'un champ pour indiquer l'étape
};

type FormData = {
  [key: string]: string | string[] | File[] | Blob | null;
  email: string;
  name: string;
  serviceId: string;
  description: string;
  budget: string;
  audio: Blob | null;
  files: File[];
};

type Service = {
  id: string;
  name: string;
};

// Fonction pour récupérer les champs de formulaire pour un service (simulé)
const fetchFormFields = async (serviceId: string): Promise<FormField[]> => {
  // Simuler un appel API - à remplacer par un vrai appel API
  await new Promise(resolve => setTimeout(resolve, 500)); // Simuler un délai réseau

  // Champs de formulaire basés sur le schéma de base de données
  const commonFields: FormField[] = [
    {
      id: "1",
      label: "Email",
      name: "email",
      type: "text",
      is_required: true,
      order: 1,
      step: 1 // Étape 1
    },
    {
      id: "2",
      label: "Nom complet",
      name: "name",
      type: "text",
      is_required: true,
      order: 2,
      step: 1 // Étape 1
    }
  ];

  // Champs spécifiques en fonction du service
  const serviceSpecificFields: { [key: string]: FormField[] } = {
    "1": [ // Développement web
      {
        id: "3",
        label: "Description du projet",
        name: "description",
        type: "textarea",
        is_required: true,
        order: 3,
        step: 2 // Étape 2
      },
      {
        id: "4",
        label: "Budget estimé",
        name: "budget",
        type: "number",
        is_required: false,
        order: 4,
        step: 2 // Étape 2
      },
      {
        id: "5",
        label: "Fonctionnalités requises",
        name: "features",
        type: "checkbox",
        options: JSON.stringify(["E-commerce", "Blog", "Espace membre", "Paiement en ligne", "CMS"]),
        is_required: false,
        order: 5,
        step: 2 // Étape 2
      }
    ],
    "2": [ // Développement mobile
      {
        id: "6",
        label: "Description du projet",
        name: "description",
        type: "textarea",
        is_required: true,
        order: 3,
        step: 2 // Étape 2
      },
      {
        id: "7",
        label: "Plateforme",
        name: "platform",
        type: "radio",
        options: JSON.stringify(["iOS", "Android", "Les deux"]),
        is_required: true,
        order: 4,
        step: 2 // Étape 2
      },
      {
        id: "8",
        label: "Budget estimé",
        name: "budget",
        type: "number",
        is_required: false,
        order: 5,
        step: 2 // Étape 2
      }
    ],
  };

  // Ajouter des champs communs à tous les services
  const audioField: FormField = {
    id: "9",
    label: "Message vocal",
    name: "audio",
    type: "audio",
    is_required: false,
    order: 98,
    step: 3 // Étape 3
  };

  const filesField: FormField = {
    id: "10",
    label: "Fichiers joints",
    name: "files",
    type: "files",
    is_required: false,
    order: 99,
    step: 3 // Étape 3
  };

  // Combiner les champs
  let fields: FormField[] = [...commonFields];

  if (serviceId && serviceSpecificFields[serviceId]) {
    fields = [...fields, ...serviceSpecificFields[serviceId]];
  }

  fields = [...fields, audioField, filesField];

  // Trier par ordre
  return fields.sort((a, b) => a.order - b.order);
};

// Animations variants
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

// Animation pour les transitions entre étapes
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
  const [formData, setFormData] = useState<FormData>({
    email: "",
    name: "",
    serviceId: "",
    description: "",
    budget: "",
    audio: null,
    files: [],
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0); // Étape 0: sélection du service
  const [totalSteps, setTotalSteps] = useState<number>(4); // Total des étapes (mise à jour dynamique)
  const [isLoaded, setIsLoaded] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const [hasInitiatedSubmit, setHasInitiatedSubmit] = useState<boolean>(false); // Nouvel état pour suivre si l'utilisateur a intentionnellement soumis
  const formSubmitButtonRef = useRef<HTMLButtonElement>(null); // Référence au bouton de soumission

  // Animation initiale au chargement
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Liste des services disponibles (à remplacer par un appel API)
  const services: Service[] = [
    { id: "1", name: "Développement web" },
    { id: "2", name: "Développement mobile" },
    { id: "3", name: "Design graphique" },
    { id: "4", name: "Conseil en stratégie numérique" },
  ];

  // Effet pour charger les champs quand le service change et que l'utilisateur passe à l'étape suivante
  useEffect(() => {
    const loadFormFields = async () => {
      if (formData.serviceId && currentStep > 0) {
        const fields = await fetchFormFields(formData.serviceId as string);
        setFormFields(fields);

        // Calculer le nombre total d'étapes
        const maxStep = Math.max(...fields.map(field => field.step || 1), 0);
        setTotalSteps(maxStep + 1); // +1 pour inclure l'étape de sélection du service
      }
    };

    loadFormFields();
  }, [formData.serviceId, currentStep]);

  // Gestion des changements de champs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      // Pour les cases à cocher, nous devons gérer un tableau de valeurs
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
      // Pour tous les autres types de champs
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Gestion du changement de description (rich text)
  const handleRichTextChange = (content: string, fieldName: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: content }));
  };

  // Gestion de l'enregistrement audio
  const handleAudioChange = (audioBlob: Blob | null) => {
    setFormData((prev) => ({ ...prev, audio: audioBlob }));
  };

  // Gestion des fichiers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Récupérer les fichiers existants
      const existingFiles = formData.files as File[] || [];

      // Ajouter les nouveaux fichiers à ceux existants
      const newFiles = Array.from(e.target.files);
      const allFiles = [...existingFiles, ...newFiles];

      // Mettre à jour l'état
      setFormData((prev) => ({ ...prev, files: allFiles }));
    }
  };

  // Suppression d'un fichier
  const handleRemoveFile = (indexToRemove: number) => {
    const currentFiles = formData.files as File[] || [];
    const updatedFiles = currentFiles.filter((_, index) => index !== indexToRemove);
    setFormData((prev) => ({ ...prev, files: updatedFiles }));
  };

  // Navigation entre les étapes
  const goToNextStep = () => {
    // Vérifier si l'étape actuelle est valide avant de continuer
    if (currentStep === 0) {
      // À l'étape 0, on valide seulement la sélection du service
      if (!formData.serviceId) {
        alert("Veuillez sélectionner un service avant de continuer.");
        return;
      }
      setCurrentStep(1);
      return;
    }

    const currentStepFields = formFields.filter(field => field.step === currentStep);

    let isValid = true;
    for (const field of currentStepFields) {
      if (field.is_required && !formData[field.name]) {
        isValid = false;
        break;
      }
    }

    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      // Scroll en haut du formulaire quand on change d'étape
      if (formRef.current) {
        formRef.current.scrollTop = 0;
      }
    } else {
      alert("Veuillez remplir tous les champs obligatoires avant de continuer.");
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    // Scroll en haut du formulaire quand on change d'étape
    if (formRef.current) {
      formRef.current.scrollTop = 0;
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Seulement traiter la soumission si l'utilisateur a explicitement cliqué sur le bouton
    if (hasInitiatedSubmit) {
      try {
        setIsSubmitting(true);
        // Ici, vous feriez normalement une requête API pour envoyer les données
        console.log("Données soumises:", formData);

        // Simuler un délai de traitement
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Rediriger vers la page de connexion/inscription
        router.push("/auth");
      } catch (error) {
        console.error("Erreur lors de la soumission:", error);
        // Réinitialiser l'état pour permettre une autre tentative
        setHasInitiatedSubmit(false);
        setIsSubmitting(false);
      }
    } else {
      console.log("Tentative de soumission non initiée par l'utilisateur - ignorée");
      // Ne pas traiter la soumission si elle n'a pas été initiée par l'utilisateur
    }
  };

  // Fonction explicite pour gérer le clic sur le bouton d'envoi
  const handleSubmitButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Empêcher le comportement par défaut

    console.log("Bouton d'envoi cliqué intentionnellement");
    setHasInitiatedSubmit(true);

    // Soumettre le formulaire caché
    const hiddenForm = document.getElementById('hiddenForm') as HTMLFormElement;
    if (hiddenForm) {
      hiddenForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    } else {
      console.error("Formulaire caché non trouvé");
    }
  };

  // Classe commune pour les champs de formulaire
  const inputClass = "w-full p-3 bg-gray-200 text-gray-700 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-[#062C57]";
  const labelClass = "mb-1 text-sm text-gray-700";

  // Rendu des champs pour l'étape courante
  const renderCurrentStepFields = () => {
    // Étape 0: sélection du service
    if (currentStep === 0) {
      return (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          <select
            name="serviceId"
            value={formData.serviceId as string}
            onChange={handleChange}
            className={inputClass}
            required
          >
            <option value="">Sélectionnez un service</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </motion.div>
      );
    }

    // Filtrer les champs pour l'étape courante
    const currentStepFields = formFields.filter(field => field.step === currentStep);

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="space-y-4"
      >
        {currentStepFields.map((field, index) => (
          <motion.div
            key={field.id}
            variants={itemVariants}
            custom={index}
            className="mb-4"
          >
            {field.type === "text" && (
              <>
                <div className={labelClass}>{field.label} {field.is_required && <span className="text-red-500">*</span>}</div>
                <input
                  type={field.name === "email" ? "email" : "text"}
                  name={field.name}
                  value={formData[field.name] as string || ""}
                  onChange={handleChange}
                  placeholder={field.label}
                  className={`${inputClass} h-10`}
                  required={field.is_required}
                />
              </>
            )}

            {field.type === "textarea" && (
              <>
                <div className={labelClass}>
                  {field.label} {field.is_required && <span className="text-red-500">*</span>}
                </div>
                <textarea
                  name={field.name}
                  value={formData[field.name] as string || ""}
                  onChange={handleChange}
                  placeholder="Décrivez votre projet, besoins et attentes..."
                  className={`${inputClass} min-h-32 resize-vertical`}
                  required={field.is_required}
                />
              </>
            )}

            {field.type === "number" && (
              <>
                <div className={labelClass}>{field.label} {field.is_required && <span className="text-red-500">*</span>}</div>
                <input
                  type="number"
                  name={field.name}
                  value={formData[field.name] as string || ""}
                  onChange={handleChange}
                  placeholder={field.label}
                  className={`${inputClass} h-10`}
                  required={field.is_required}
                />
              </>
            )}

            {field.type === "checkbox" && field.options && (
              <>
                <div className={labelClass}>{field.label} {field.is_required && <span className="text-red-500">*</span>}</div>
                <div className="space-y-1 bg-gray-200 p-3 rounded-md">
                  {JSON.parse(field.options).map((option: string, idx: number) => (
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
                        required={field.is_required && idx === 0} // Seul le premier est marqué comme required
                      />
                      <label htmlFor={`${field.name}-${idx}`} className="text-gray-700">{option}</label>
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            {field.type === "radio" && field.options && (
              <>
                <div className={labelClass}>{field.label} {field.is_required && <span className="text-red-500">*</span>}</div>
                <div className="space-y-1 bg-gray-200 p-3 rounded-md">
                  {JSON.parse(field.options).map((option: string, idx: number) => (
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
                      <label htmlFor={`${field.name}-${idx}`} className="text-gray-700">{option}</label>
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            {field.type === "audio" && (
              <>
                <div className={labelClass}>{field.label} {field.is_required && <span className="text-red-500">*</span>}</div>
                <AudioRecorder onChange={handleAudioChange} />
              </>
            )}

            {field.type === "files" && (
              <>
                <div className={labelClass}>{field.label} {field.is_required && <span className="text-red-500">*</span>}</div>
                <div className="mb-2">
                  <input
                    type="file"
                    name="files"
                    onChange={handleFileChange}
                    multiple // Permet la sélection multiple de fichiers
                    className={`${inputClass} file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-[#1EB1D1] file:text-white hover:file:bg-[#062C57] file:cursor-pointer`}
                    required={field.is_required}
                  />
                </div>
                {/* Afficher la liste des fichiers sélectionnés */}
                {formData.files && (formData.files as File[]).length > 0 && (
                  <motion.div
                    className="mt-2 bg-gray-100 p-3 rounded-md"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-sm font-semibold text-gray-700">Fichiers sélectionnés ({(formData.files as File[]).length}):</p>
                    <ul className="mt-2 max-h-40 overflow-y-auto">
                      {(formData.files as File[]).map((file, idx) => (
                        <motion.li
                          key={idx}
                          className="flex justify-between items-center py-1 border-b border-gray-200 last:border-0"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <div className="text-sm text-gray-700 truncate max-w-[80%]">
                            {file.name} ({(file.size / 1024).toFixed(1)} KB)
                          </div>
                          <motion.button
                            type="button"
                            onClick={() => handleRemoveFile(idx)}
                            className="text-red-500 hover:text-red-700 text-sm p-1"
                            title="Supprimer ce fichier"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                          </motion.button>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        ))}
      </motion.div>
    );
  };

  // Rendu des boutons de navigation avec des flèches dans des cercles
  const renderNavigationButtons = () => {
    const isLastStep = currentStep === totalSteps - 1; // Dernière étape

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
              (currentStep === 0 && !formData.serviceId)
                ? 'bg-gray-200 cursor-not-allowed'
                : 'bg-[#1EB1D1] hover:bg-[#062C57]'
            }`}
            disabled={currentStep === 0 && !formData.serviceId}
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
            ref={formSubmitButtonRef}
            type="button" // Changé en type="button" pour gérer manuellement la soumission
            disabled={isSubmitting}
            className="ml-auto px-6 py-2 bg-[#1EB1D1] text-white rounded-md hover:bg-[#062C57] transition flex items-center"
            onClick={handleSubmitButtonClick} // Utiliser notre gestionnaire personnalisé
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
                Envoi en cours...
              </span>
            ) : (
              "Envoyer"
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
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
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
                className={`h-1 w-10 ${
                  index < currentStep ? 'bg-[#062C57]' : 'bg-gray-200'
                }`}
                initial={{ width: 0 }}
                animate={{ width: "40px" }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
              ></motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>
    );
  };

  // Effet pour désactiver les redirections automatiques pendant les étapes
  useEffect(() => {
    // Réinitialiser l'indicateur de soumission lorsque l'étape change
    if (hasInitiatedSubmit && currentStep !== totalSteps - 1) {
      setHasInitiatedSubmit(false);
      setIsSubmitting(false);
    }
  }, [currentStep, hasInitiatedSubmit, totalSteps]);

  // Désactivation du comportement de soumission automatique du formulaire
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Empêcher la navigation non intentionnelle pendant l'étape des fichiers/audio (étape 3)
      if (currentStep === totalSteps - 1 && !hasInitiatedSubmit) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentStep, totalSteps, hasInitiatedSubmit]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white overflow-hidden">
      {/* Image de gauche - fixe même en cas de défilement */}
      <div className="hidden md:block md:w-1/2 relative">
        <motion.div
          className="fixed w-1/2 h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src="/images/welcome.jpg"
            alt="Poignée de main entre un humain et un robot"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
          {/* Overlay gradué qui disparaît progressivement */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 0.5, duration: 1.5 }}
          />
        </motion.div>
      </div>

      {/* Image mobile (uniquement visible sur les petits écrans) */}
      <div className="md:hidden w-full h-48 relative">
        <Image
          src="/images/welcome.jpg"
          alt="Poignée de main entre un humain et un robot"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      {/* Formulaire à droite avec défilement */}
      <motion.div
        ref={formRef}
        className="w-full md:w-1/2 flex flex-col p-8 overflow-y-auto"
        style={{ maxHeight: "100vh" }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Logo */}
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
            src="/images/logo_mts.png"
            alt="Millennium Tech"
            width={180}
            height={40}
          />
        </motion.div>

        <motion.h1
          className="text-2xl font-bold mb-4 text-center text-[#062C57]"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Dites-nous en plus !
        </motion.h1>

        {/* Indicateur d'étapes */}
        {currentStep > 0 && renderStepIndicator()}

        {/*
          Utiliser un div au lieu d'un form ici pour éviter la soumission accidentelle
          La gestion de soumission est faite manuellement via le bouton d'envoi
        */}
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
              {currentStep === 0 && "Sélectionnez un service"}
              {currentStep === 1 && "Vos informations"}
              {currentStep === 2 && "Détails du projet"}
              {currentStep === 3 && "Fichiers additionnels"}
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

          {/* Formulaire invisible pour gérer la soumission réelle */}
          <form
            onSubmit={handleSubmit}
            style={{ display: "none" }}
            id="hiddenForm"
          >
            <input type="hidden" name="formSubmitted" value="true" />
          </form>
        </div>
      </motion.div>
    </div>
  );
}