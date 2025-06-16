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

// Définition des types basés sur la structure de la DB
type FormFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'email'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'files_document'
  | 'files_image'
  | 'file_audio';

type FormField = {
  id: number;
  label: string;
  name: string;
  type: FormFieldType;
  options: string[] | null; // JSON parsé
  is_required: boolean;
  position: number;
  step: number;
};

type Category = {
  id: number;
  name: string;
  description: string;
  cover_image: string | null;
  slogan: string | null;
};

type Service = {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  price: number | null;
  is_active: boolean;
  category?: Category;
};

type FormData = {
  [key: string]: string | string[] | File[] | Blob | null;
};

// Fonction pour récupérer les services
const fetchServices = async (): Promise<Service[]> => {
  // Simuler un appel API avec des données réalistes
  await new Promise(resolve => setTimeout(resolve, 300));

  return [
    {
      id: 1,
      category_id: 1,
      name: "Développement d'application web",
      description: "Création d'applications web modernes et responsive",
      price: 2500.00,
      is_active: true,
      category: {
        id: 1,
        name: "Services informatiques",
        description: "Développement et maintenance informatique",
        cover_image: null,
        slogan: "Innovation technologique"
      }
    },
    {
      id: 2,
      category_id: 1,
      name: "Développement d'application mobile",
      description: "Applications iOS et Android natives ou hybrides",
      price: 3500.00,
      is_active: true,
      category: {
        id: 1,
        name: "Services informatiques",
        description: "Développement et maintenance informatique",
        cover_image: null,
        slogan: "Innovation technologique"
      }
    },
    {
      id: 3,
      category_id: 2,
      name: "Design graphique et branding",
      description: "Création d'identité visuelle et supports graphiques",
      price: 1200.00,
      is_active: true,
      category: {
        id: 2,
        name: "Services de communication",
        description: "Graphisme, marketing et communication",
        cover_image: null,
        slogan: "Créativité et impact"
      }
    },
    {
      id: 4,
      category_id: 3,
      name: "Conseil juridique entreprise",
      description: "Accompagnement juridique pour entreprises",
      price: 150.00,
      is_active: true,
      category: {
        id: 3,
        name: "Services juridiques",
        description: "Conseil, contrats et accompagnement juridique",
        cover_image: null,
        slogan: "Expertise et sécurité"
      }
    }
  ];
};

// Fonction pour récupérer les champs de formulaire pour un service
const fetchFormFields = async (serviceId: number): Promise<FormField[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  // Champs de base pour tous les services (step 1 - Informations utilisateur)
  const baseFields: FormField[] = [
    {
      id: 1,
      label: "Prénom",
      name: "first_name",
      type: "text",
      options: null,
      is_required: true,
      position: 1,
      step: 1
    },
    {
      id: 2,
      label: "Nom de famille",
      name: "last_name",
      type: "text",
      options: null,
      is_required: true,
      position: 2,
      step: 1
    },
    {
      id: 3,
      label: "Adresse email",
      name: "email",
      type: "email",
      options: null,
      is_required: true,
      position: 3,
      step: 1
    },
    {
      id: 4,
      label: "Numéro de téléphone",
      name: "phone",
      type: "text",
      options: null,
      is_required: false,
      position: 4,
      step: 1
    }
  ];

  // Champs spécifiques par service (step 2 - Informations projet)
  const serviceSpecificFields: { [key: number]: FormField[] } = {
    1: [ // Développement web
      {
        id: 5,
        label: "Description détaillée du projet",
        name: "project_description",
        type: "textarea",
        options: null,
        is_required: true,
        position: 1,
        step: 2
      },
      {
        id: 6,
        label: "Type de site web",
        name: "website_type",
        type: "select",
        options: ["Site vitrine", "E-commerce", "Blog", "Application web", "Portfolio", "Site institutionnel"],
        is_required: true,
        position: 2,
        step: 2
      },
      {
        id: 7,
        label: "Fonctionnalités souhaitées",
        name: "features",
        type: "checkbox",
        options: ["Système de paiement", "Espace membre", "Blog intégré", "Multilingue", "SEO optimisé", "Responsive design"],
        is_required: false,
        position: 3,
        step: 2
      },
      {
        id: 8,
        label: "Budget approximatif (€)",
        name: "budget",
        type: "number",
        options: null,
        is_required: false,
        position: 4,
        step: 2
      },
      {
        id: 9,
        label: "Date de livraison souhaitée",
        name: "delivery_date",
        type: "date",
        options: null,
        is_required: false,
        position: 5,
        step: 2
      }
    ],
    2: [ // Développement mobile
      {
        id: 10,
        label: "Description de l'application",
        name: "app_description",
        type: "textarea",
        options: null,
        is_required: true,
        position: 1,
        step: 2
      },
      {
        id: 11,
        label: "Plateforme cible",
        name: "platform",
        type: "radio",
        options: ["iOS uniquement", "Android uniquement", "iOS et Android (hybride)", "iOS et Android (natif)"],
        is_required: true,
        position: 2,
        step: 2
      },
      {
        id: 12,
        label: "Catégorie d'application",
        name: "app_category",
        type: "select",
        options: ["E-commerce", "Réseau social", "Productivité", "Jeux", "Éducation", "Santé", "Finance", "Autre"],
        is_required: true,
        position: 3,
        step: 2
      },
      {
        id: 13,
        label: "Fonctionnalités principales",
        name: "main_features",
        type: "checkbox",
        options: ["Authentification utilisateur", "Notifications push", "Géolocalisation", "Paiement intégré", "Mode hors ligne", "Partage social"],
        is_required: false,
        position: 4,
        step: 2
      },
      {
        id: 14,
        label: "Budget estimé (€)",
        name: "estimated_budget",
        type: "number",
        options: null,
        is_required: false,
        position: 5,
        step: 2
      }
    ],
    3: [ // Design graphique
      {
        id: 15,
        label: "Type de projet graphique",
        name: "design_type",
        type: "select",
        options: ["Logo", "Charte graphique", "Site web design", "Print (flyers, cartes)", "Packaging", "Autre"],
        is_required: true,
        position: 1,
        step: 2
      },
      {
        id: 16,
        label: "Brief créatif",
        name: "creative_brief",
        type: "textarea",
        options: null,
        is_required: true,
        position: 2,
        step: 2
      },
      {
        id: 17,
        label: "Style souhaité",
        name: "design_style",
        type: "checkbox",
        options: ["Moderne", "Classique", "Minimaliste", "Coloré", "Élégant", "Dynamique"],
        is_required: false,
        position: 3,
        step: 2
      },
      {
        id: 18,
        label: "Couleurs préférées",
        name: "preferred_colors",
        type: "text",
        options: null,
        is_required: false,
        position: 4,
        step: 2
      }
    ],
    4: [ // Conseil juridique
      {
        id: 19,
        label: "Type de conseil recherché",
        name: "legal_type",
        type: "select",
        options: ["Création d'entreprise", "Contrats commerciaux", "Droit du travail", "Propriété intellectuelle", "Contentieux", "Autre"],
        is_required: true,
        position: 1,
        step: 2
      },
      {
        id: 20,
        label: "Description de la situation",
        name: "legal_situation",
        type: "textarea",
        options: null,
        is_required: true,
        position: 2,
        step: 2
      },
      {
        id: 21,
        label: "Urgence du dossier",
        name: "urgency",
        type: "radio",
        options: ["Très urgent (< 1 semaine)", "Urgent (< 1 mois)", "Normal (1-3 mois)", "Pas urgent"],
        is_required: true,
        position: 3,
        step: 2
      }
    ]
  };

  // Champs médias pour tous les services (step 3)
  const mediaFields: FormField[] = [
    {
      id: 22,
      label: "Message vocal (optionnel)",
      name: "audio_message",
      type: "file_audio",
      options: null,
      is_required: false,
      position: 1,
      step: 3
    },
    {
      id: 23,
      label: "Documents de référence",
      name: "reference_documents",
      type: "files_document",
      options: null,
      is_required: false,
      position: 2,
      step: 3
    },
    {
      id: 24,
      label: "Images d'inspiration",
      name: "inspiration_images",
      type: "files_image",
      options: null,
      is_required: false,
      position: 3,
      step: 3
    }
  ];

  // Combiner les champs
  let allFields: FormField[] = [...baseFields];

  if (serviceSpecificFields[serviceId]) {
    allFields = [...allFields, ...serviceSpecificFields[serviceId]];
  }

  allFields = [...allFields, ...mediaFields];

  // Trier par step puis par position
  return allFields.sort((a, b) => {
    if (a.step !== b.step) {
      return a.step - b.step;
    }
    return a.position - b.position;
  });
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
  const [formData, setFormData] = useState<FormData>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [services, setServices] = useState<Service[]>([]);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0); // Step 0: sélection service
  const [totalSteps] = useState<number>(4); // 0: service, 1: user info, 2: project info, 3: media
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadingFields, setIsLoadingFields] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const [hasInitiatedSubmit, setHasInitiatedSubmit] = useState<boolean>(false);

  // Animation initiale
  useEffect(() => {
    setIsLoaded(true);
    loadServices();
  }, []);

  // Charger les services
  const loadServices = async () => {
    try {
      const servicesData = await fetchServices();
      setServices(servicesData);
    } catch (error) {
      console.error("Erreur lors du chargement des services:", error);
    }
  };

  // Charger les champs quand le service change
  useEffect(() => {
    const loadFormFields = async () => {
      if (formData.service_id) {
        setIsLoadingFields(true);
        try {
          const fields = await fetchFormFields(parseInt(formData.service_id as string));
          setFormFields(fields);
          console.log("Champs chargés:", fields); // Debug
        } catch (error) {
          console.error("Erreur lors du chargement des champs:", error);
        } finally {
          setIsLoadingFields(false);
        }
      }
    };

    loadFormFields();
  }, [formData.service_id]);

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
    console.log("Tentative de passage au step suivant, step actuel:", currentStep); // Debug

    if (currentStep === 0) {
      if (!formData.service_id) {
        alert("Veuillez sélectionner un service avant de continuer.");
        return;
      }
      console.log("Passage au step 1, service sélectionné:", formData.service_id); // Debug
      setCurrentStep(1);
      return;
    }

    // Valider les champs de l'étape actuelle
    const currentStepFields = formFields.filter(field => field.step === currentStep);
    console.log("Validation step", currentStep, "champs:", currentStepFields); // Debug

    let isValid = true;

    for (const field of currentStepFields) {
      if (field.is_required && !formData[field.name]) {
        console.log("Champ manquant:", field.name); // Debug
        isValid = false;
        break;
      }
    }

    if (isValid) {
      const nextStep = Math.min(currentStep + 1, totalSteps - 1);
      console.log("Passage au step", nextStep); // Debug
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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (hasInitiatedSubmit) {
      try {
        setIsSubmitting(true);

        // Préparer les données pour l'API
        const orderData = {
          service_id: parseInt(formData.service_id as string),
          form_data: formData,
          // Les fichiers et audio seront traités séparément
        };

        console.log("Données de commande à soumettre:", orderData);

        // Simuler l'appel API
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Redirection vers la page d'authentification
        router.push("/auth");
      } catch (error) {
        console.error("Erreur lors de la soumission:", error);
        setHasInitiatedSubmit(false);
        setIsSubmitting(false);
      }
    }
  };

  const handleSubmitButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setHasInitiatedSubmit(true);

    const hiddenForm = document.getElementById('hiddenForm') as HTMLFormElement;
    if (hiddenForm) {
      hiddenForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  // Classes CSS
  const inputClass = "w-full p-3 bg-gray-200 text-gray-700 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-[#062C57]";
  const labelClass = "mb-1 text-sm text-gray-700";

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
            name="service_id"
            value={formData.service_id as string || ""}
            onChange={handleChange}
            className={inputClass}
            required
          >
            <option value="">-- Sélectionnez un service --</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} {service.price && `(${service.price}€)`}
              </option>
            ))}
          </select>

          {/* Afficher les détails du service sélectionné */}
          {formData.service_id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 p-4 bg-gray-100 rounded-md"
            >
              {(() => {
                const selectedService = services.find(s => s.id === parseInt(formData.service_id as string));
                return selectedService ? (
                  <div>
                    <h3 className="font-semibold text-[#062C57]">{selectedService.name}</h3>
                    <p className="text-gray-600 mt-1">{selectedService.description}</p>
                    {selectedService.price && (
                      <p className="text-[#1EB1D1] font-semibold mt-2">Prix: {selectedService.price}€</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      Catégorie: {selectedService.category?.name}
                    </p>
                  </div>
                ) : null;
              })()}
            </motion.div>
          )}
        </motion.div>
      );
    }

    // Autres steps: afficher les champs correspondants
    if (isLoadingFields) {
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

    const currentStepFields = formFields.filter(field => field.step === currentStep);

    console.log(`Step ${currentStep}, champs trouvés:`, currentStepFields); // Debug

    if (currentStepFields.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-gray-500"
        >
          Aucun champ disponible pour cette étape. (Step {currentStep})
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
        {currentStepFields.map((field, index) => (
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
            {field.type === "text" && (
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
            {field.type === "email" && (
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
            {field.type === "textarea" && (
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
            {field.type === "number" && (
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
            {field.type === "date" && (
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
            {field.type === "select" && field.options && (
              <select
                name={field.name}
                value={formData[field.name] as string || ""}
                onChange={handleChange}
                className={inputClass}
                required={field.is_required}
              >
                <option value="">-- Sélectionnez une option --</option>
                {field.options.map((option, idx) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}

            {/* Champ checkbox */}
            {field.type === "checkbox" && field.options && (
              <div className="space-y-2 bg-gray-200 p-3 rounded-md">
                {field.options.map((option, idx) => (
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
            {field.type === "radio" && field.options && (
              <div className="space-y-2 bg-gray-200 p-3 rounded-md">
                {field.options.map((option, idx) => (
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

            {/* Champ audio */}
            {field.type === "file_audio" && (
              <div>
                <AudioRecorder onChange={handleAudioChange} />
              </div>
            )}

            {/* Champ fichiers documents */}
            {field.type === "files_document" && (
              <div>
                <input
                  type="file"
                  name={field.name}
                  onChange={(e) => handleFileChange(e, field.name)}
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.rtf"
                  className={`${inputClass} file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-[#1EB1D1] file:text-white hover:file:bg-[#062C57] file:cursor-pointer`}
                  required={field.is_required}
                />
                {/* Afficher les fichiers sélectionnés */}
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
            {field.type === "files_image" && (
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
                {/* Afficher les images sélectionnées */}
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
          </motion.div>
        ))}
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
              (currentStep === 0 && !formData.service_id)
                ? 'bg-gray-200 cursor-not-allowed'
                : 'bg-[#1EB1D1] hover:bg-[#062C57]'
            }`}
            disabled={currentStep === 0 && !formData.service_id}
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
                Création de la commande...
              </span>
            ) : (
              "Créer ma commande"
            )}
          </motion.button>
        )}
      </motion.div>
    );
  };

  // Indicateur d'étapes
  const renderStepIndicator = () => {
    const stepTitles = ["Service", "Informations", "Projet", "Médias"];

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
              {/* Tooltip */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {stepTitles[index]}
              </div>
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

  // Effet pour réinitialiser la soumission
  useEffect(() => {
    if (hasInitiatedSubmit && currentStep !== totalSteps - 1) {
      setHasInitiatedSubmit(false);
      setIsSubmitting(false);
    }
  }, [currentStep, hasInitiatedSubmit, totalSteps]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white overflow-hidden">
      {/* Image de gauche */}
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
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 0.5, duration: 1.5 }}
          />
        </motion.div>
      </div>

      {/* Image mobile */}
      <div className="md:hidden w-full h-48 relative">
        <Image
          src="/images/welcome.jpg"
          alt="Poignée de main entre un humain et un robot"
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
          Créez votre commande
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

          {/* Formulaire caché pour la soumission */}
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