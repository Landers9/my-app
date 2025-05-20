/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function NewPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Animation initiale au chargement
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Récupérer le token et l'email depuis l'URL (si présents)
  useEffect(() => {
    const urlToken = searchParams.get("token");
    const urlEmail = searchParams.get("email");

    if (urlToken) setToken(urlToken);
    if (urlEmail) setEmail(urlEmail);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simuler une requête d'API pour modifier le mot de passe
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simuler une réponse réussie
      setSuccess(true);

      // Rediriger vers la page de connexion après 3 secondes
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calcul de la force du mot de passe
  const calculatePasswordStrength = () => {
    if (password.length === 0) {
      return { strength: 0, text: "", color: "bg-gray-300" };
    }
    if (password.length < 6) {
      return { strength: 25, text: "Faible", color: "bg-red-500" };
    }
    if (password.length < 8) {
      return { strength: 50, text: "Moyen", color: "bg-orange-500" };
    }
    if (password.length < 10 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return { strength: 75, text: "Bon", color: "bg-yellow-500" };
    }
    return { strength: 100, text: "Excellent", color: "bg-green-500" };
  };

  const passwordStrength = calculatePasswordStrength();

  // Styles cohérents avec le reste de l'application
  const inputClass = "w-full p-2 bg-gray-200 text-gray-700 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-[#062C57] h-10";
  const buttonClass = "w-full p-3 bg-[#1EB1D1] hover:bg-[#062C57] text-white rounded-md transition duration-300 font-medium";
  const labelClass = "mb-1 text-sm text-gray-700";

  // Variantes d'animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
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
      scale: 1.03,
      boxShadow: "0 5px 10px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.98 },
    loading: {
      scale: 1,
      opacity: 0.8
    }
  };

  const successVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const successItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const strengthMeterVariants = {
    hidden: { width: 0 },
    visible: {
      width: `${passwordStrength.strength}%`,
      transition: { duration: 0.3 }
    }
  };

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
          className="text-2xl font-bold mb-6 text-center text-[#062C57]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Modification du mot de passe
        </motion.h1>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-5 rounded-md mb-4 text-center"
              key="success-message"
              variants={successVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto mb-4 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                variants={successItemVariants}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </motion.svg>
              <motion.h2
                className="text-lg font-semibold mb-2"
                variants={successItemVariants}
              >
                Mot de passe modifié avec succès
              </motion.h2>
              <motion.p
                className="mb-4"
                variants={successItemVariants}
              >
                Votre mot de passe a été modifié. Vous allez être redirigé vers la page de connexion.
              </motion.p>
              <motion.div
                className="w-full bg-gray-200 h-1 rounded-full mt-4"
              >
                <motion.div
                  className="bg-green-500 h-1 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, ease: "linear" }}
                ></motion.div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
            >
              {error && (
                <motion.div
                  className="p-3 bg-red-100 border border-red-400 text-red-700 rounded"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.div>
              )}

              {!token && (
                <motion.div variants={itemVariants}>
                  <div className={labelClass}>Mot de passe actuel</div>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Entrez votre mot de passe actuel"
                      className={inputClass}
                      required
                    />
                    <motion.button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showCurrentPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              <motion.div variants={itemVariants}>
                <div className={labelClass}>Nouveau mot de passe</div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrez votre nouveau mot de passe"
                    className={inputClass}
                    required
                    minLength={8}
                  />
                  <motion.button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </motion.button>
                </div>
                {/* Indicateur de force du mot de passe avec animation */}
                {password.length > 0 && (
                  <motion.div
                    className="mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-600">Force :</span>
                      <motion.span
                        className="text-xs font-medium"
                        initial={{ color: "#9CA3AF" }}
                        animate={{ color: passwordStrength.color.replace('bg-', '') }}
                        style={{
                          color: passwordStrength.color === "bg-red-500"
                            ? "#EF4444"
                            : passwordStrength.color === "bg-orange-500"
                              ? "#F97316"
                              : passwordStrength.color === "bg-yellow-500"
                                ? "#EAB308"
                                : "#10B981"
                        }}
                      >
                        {passwordStrength.text}
                      </motion.span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <motion.div
                        className={`${passwordStrength.color} h-1.5 rounded-full`}
                        variants={strengthMeterVariants}
                        initial="hidden"
                        animate="visible"
                        key={password} // Pour forcer l'animation à chaque changement
                      ></motion.div>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      Utilisez au moins 8 caractères avec des lettres majuscules et des chiffres.
                    </div>
                  </motion.div>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className={labelClass}>Confirmation du mot de passe</div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmez votre mot de passe"
                    className={inputClass}
                    required
                  />
                  <motion.button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </motion.button>
                </div>
                {/* Indicateur de correspondance des mots de passe */}
                {confirmPassword.length > 0 && (
                  <motion.div
                    className="mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {password === confirmPassword ? (
                      <p className="text-xs text-green-500 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Les mots de passe correspondent
                      </p>
                    ) : (
                      <p className="text-xs text-red-500 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Les mots de passe ne correspondent pas
                      </p>
                    )}
                  </motion.div>
                )}
              </motion.div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={buttonClass}
                variants={buttonVariants}
                animate={isSubmitting ? "loading" : "visible"}
                whileHover={!isSubmitting ? "hover" : undefined}
                whileTap={!isSubmitting ? "tap" : undefined}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Modification en cours...
                  </span>
                ) : (
                  "Modifier"
                )}
              </motion.button>

              <motion.div
                className="text-center mt-6"
                variants={itemVariants}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/auth/login"
                    className="text-sm text-[#1EB1D1] hover:text-[#062C57] flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <line x1="19" y1="12" x2="5" y2="12"></line>
                      <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Retour à la connexion
                  </Link>
                </motion.div>
              </motion.div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>

      {/* CTA dans le coin inférieur gauche (sur la partie image) - visible uniquement sur desktop */}
      <motion.div
        className="hidden md:block absolute bottom-8 left-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-white text-white bg-transparent hover:bg-white hover:text-[#062C57] rounded-md transition-colors duration-300"
          >
            <span className="mr-2">Retour à l'accueil</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h13M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}