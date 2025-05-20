/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Animation initiale au chargement
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Simuler un appel API pour envoyer le lien de réinitialisation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
    } catch (err) {
      setError("Nous n'avons pas pu envoyer le lien de réinitialisation. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          className="text-2xl font-bold mb-2 text-center text-[#062C57]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Mot de passe oublié ?
        </motion.h1>

        <motion.p
          className="text-center text-gray-600 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </motion.p>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-5 rounded-md mb-4 text-center"
              key="success-message"
              variants={successVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
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
                E-mail envoyé
              </motion.h2>
              <motion.p
                className="mb-4"
                variants={successItemVariants}
              >
                Si un compte existe avec l'adresse e-mail <strong>{email}</strong>, vous recevrez sous peu un lien pour réinitialiser votre mot de passe.
              </motion.p>
              <motion.div
                variants={successItemVariants}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/auth/login" className={buttonClass + " inline-block text-center"}>
                  Retour à la connexion
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4"
              key="forgot-password-form"
              variants={containerVariants}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
            >
              {error && (
                <motion.div
                  className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.div>
              )}

              <motion.div variants={itemVariants}>
                <div className={labelClass}>Adresse mail</div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse e-mail professionnelle"
                  className={inputClass}
                  required
                />
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
                    Envoi en cours...
                  </span>
                ) : (
                  "Envoyer le lien de réinitialisation"
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